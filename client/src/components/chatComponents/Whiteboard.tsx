import React, { useEffect, useRef, useState } from 'react'
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { BinaryFiles, ExcalidrawImperativeAPI, SocketId } from "@excalidraw/excalidraw/types";
import { socket } from '../../utils';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';

interface PointerEvent {
  userName: string;
  userId: string;
  x: number;
  y: number;
}

interface WhiteboardProps {
  sessionId: string | undefined;
  isRecorded?: boolean;
}

function Whiteboard({ sessionId, isRecorded }: WhiteboardProps) {
  const { userData, backendUrl } = useAppContext();
  const excalidrawAPI = useRef<ExcalidrawImperativeAPI | null>(null);
  const isRemoteUpdate = useRef(false);
  const whiteboardRef = useRef<HTMLDivElement | null>(null);
  const suppressViewportSync = useRef(false);
  const lastViewportKey = useRef<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  // Generate or retrieve unique userId from localStorage
  useEffect(() => {
    let stored = localStorage.getItem("userId");
    if (!stored) {
      stored = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("userId", stored);
    }
    setUserId(stored);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const fetchWhiteboard = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/session/${sessionId}`, { withCredentials: true });
        const elements = res.data.whiteboard?.elements || [];
        const files = res.data.whiteboard?.files || {};
        console.log(res.data.whiteboard?.elements);

        const interval = setInterval(() => {
          if (excalidrawAPI.current) {
            excalidrawAPI.current.addFiles(Object.values(files));
            excalidrawAPI.current.updateScene({ elements });
            clearInterval(interval);
          }
        }, 50);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWhiteboard();

    // Only setup real-time collaboration for live sessions
    if (!isRecorded) {
      socket.on("wb:load", (data: { elements: any[]; files: BinaryFiles }) => {
        const { elements, files } = data;
        if (!Array.isArray(elements)) {
          console.error("wb:load: expected array, got", elements);
          return;
        }
        if (!excalidrawAPI.current) return;

        // Prevent recursive socket update loop
        isRemoteUpdate.current = true;
        excalidrawAPI.current.addFiles(Object.values(files));
        excalidrawAPI.current.updateScene({ elements });
        isRemoteUpdate.current = false;
      });

      // Update pointer positions of other users
      socket.on("wb:pointer", (payload: PointerEvent & { userName: string}) => {
        if (!excalidrawAPI.current) return;

        // Retrieve existing collaborators on whiteboard
        const collaborators = new Map(
          excalidrawAPI.current.getAppState().collaborators
        );

        // Add/Update pointer position for remote user
        collaborators.set(payload.userId as unknown as SocketId, {
          username: payload.userName,
          pointer: { x: payload.x, y: payload.y, tool: "laser" },
        });
        
        // Remove own pointer to avoid duplication
        collaborators.delete(userData._id as unknown as SocketId);

        // Update Excalidraw scene with collaborators
        excalidrawAPI.current.updateScene({ collaborators });
      });

      // Receive viewport changes made with the hand/pan tool.
      socket.on("wb:viewport", (viewport: { scrollX: number; scrollY: number; zoom: { value: number } }) => {
        if (!excalidrawAPI.current) return;

        const viewportKey = `${viewport.scrollX}:${viewport.scrollY}:${viewport.zoom.value}`;
        lastViewportKey.current = viewportKey;
        suppressViewportSync.current = true;
        isRemoteUpdate.current = true;
        excalidrawAPI.current.updateScene({ appState: viewport as any });
        isRemoteUpdate.current = false;
        window.setTimeout(() => {
          suppressViewportSync.current = false;
        }, 0);
      });

      // Receive updated elements from other users
      socket.on("wb:elements", (data: { elements: any[]; files: BinaryFiles }) => {
        const { elements, files } = data;
        console.log("Received elements update", elements.length);

        if (!excalidrawAPI.current) return;
        isRemoteUpdate.current = true;
        excalidrawAPI.current.addFiles(Object.values(files));
        excalidrawAPI.current.updateScene({ elements });
        isRemoteUpdate.current = false;
      });

      // Join after listeners are registered so the initial state cannot be missed.
      socket.emit("wb:join", { sessionId, userId });

      const handleKeyUp = (event: KeyboardEvent) => {
        if (!whiteboardRef.current?.contains(event.target as Node)) return;
        if (!excalidrawAPI.current || isRemoteUpdate.current) return;

        socket.emit("wb:elements", {
          sessionId,
          elements: excalidrawAPI.current.getSceneElements(),
          files: excalidrawAPI.current.getFiles(),
          userId: userData._id,
          userName: userData.firstName,
        });
      };

      document.addEventListener("keyup", handleKeyUp);

      return () => {
        document.removeEventListener("keyup", handleKeyUp);
        socket.off("wb:load");
        socket.off("wb:elements");
        socket.off("wb:pointer");
        socket.off("wb:viewport");
      };
    }
  }, [sessionId, userId, isRecorded]);

  // Handle local pointer moves and broadcast to other users
  const handlePointerUpdate = (payload: any) => {
    if (!sessionId || isRecorded) return;

    socket.emit("wb:pointer", { sessionId, payload: { userId: userData._id, userName: userData.firstName, x: payload.pointer.x, y: payload.pointer.y } });

  };

  const handlePointerUp = () => {
    if (!excalidrawAPI.current || !sessionId || isRemoteUpdate.current || isRecorded) return;

    // Excalidraw applies eraser changes after pointer-up; read the scene next frame.
    requestAnimationFrame(() => {
      if (!excalidrawAPI.current || isRemoteUpdate.current || isRecorded) return;

      socket.emit("wb:elements", {
          sessionId,
          elements: excalidrawAPI.current.getSceneElements(),
          files: excalidrawAPI.current.getFiles(),
          userId: userData._id,
          userName: userData.firstName,
        });
    });
  };

  const handleWhiteboardChange = (_elements: readonly any[], appState: any) => {
    if (!sessionId || isRemoteUpdate.current || isRecorded || suppressViewportSync.current) return;

    const viewportKey = `${appState.scrollX}:${appState.scrollY}:${appState.zoom.value}`;
    if (viewportKey === lastViewportKey.current) return;
    lastViewportKey.current = viewportKey;

    socket.emit("wb:viewport", {
      sessionId,
      viewport: {
        scrollX: appState.scrollX,
        scrollY: appState.scrollY,
        zoom: appState.zoom,
      },
    });
  };

  return (
    <div ref={whiteboardRef} style={{ width: "100%", height: "690px" }}>
      <Excalidraw
        onPointerUpdate={handlePointerUpdate}
        onPointerUp={handlePointerUp}
        onChange={handleWhiteboardChange}
        excalidrawAPI={(api) => (excalidrawAPI.current = api)}
        viewModeEnabled={!!isRecorded} // disable editing for recorded sessions
      />
    </div>
  );
}

export default Whiteboard;
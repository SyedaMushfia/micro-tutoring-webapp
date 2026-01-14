import React, { useEffect, useRef, useState } from 'react'
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI, SocketId } from "@excalidraw/excalidraw/types";
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
  const [userId, setUserId] = useState<string>("");

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

        console.log(res.data.whiteboard?.elements);

        const interval = setInterval(() => {
          if (excalidrawAPI.current) {
            excalidrawAPI.current.updateScene({ elements });
            clearInterval(interval);
          }
      }, 50);

      } catch (err) {
        console.error(err);
      }
    };

    fetchWhiteboard();

    if (!isRecorded) {
      socket.emit("wb:join", { sessionId, userId });

      socket.on("wb:load", (elements: any[]) => {
        if (!Array.isArray(elements)) {
          console.error("wb:load: expected array, got", elements);
          return;
        }
        if (!excalidrawAPI.current) return;
        isRemoteUpdate.current = true;
        excalidrawAPI.current.updateScene({ elements });
        isRemoteUpdate.current = false;
      });

      socket.on("wb:pointer", (payload: PointerEvent & { userName: string}) => {
        if (!excalidrawAPI.current) return;

        const collaborators = new Map(
          excalidrawAPI.current.getAppState().collaborators
        );

        collaborators.set(payload.userId as unknown as SocketId, {
          username: payload.userName,
          pointer: { x: payload.x, y: payload.y, tool: "laser" },
        });

        collaborators.delete(userData._id as unknown as SocketId);

        excalidrawAPI.current.updateScene({ collaborators });
      });

      socket.on("wb:elements", (elements: any[]) => {
        console.log("Received elements update", elements.length);

        if (!excalidrawAPI.current) return;
        isRemoteUpdate.current = true;
        excalidrawAPI.current.updateScene({ elements });
        isRemoteUpdate.current = false;
      });

      return () => {
        socket.off("wb:load");
        socket.off("wb:elements");
        socket.off("wb:pointer");
    }}
  }, [sessionId, userId, isRecorded]);

  // Local pointer moves
  const handlePointerUpdate = (payload: any) => {
    if (!sessionId || isRecorded) return;

    socket.emit("wb:pointer", { sessionId, payload: { userId: userData._id, userName: userData.firstName, x: payload.pointer.x, y: payload.pointer.y } });
  };

  const handlePointerUp = () => {
    if (!excalidrawAPI.current || !sessionId || isRemoteUpdate.current || isRecorded) return;

    const elements = excalidrawAPI.current.getSceneElements();
    socket.emit("wb:elements", {
        sessionId,
        elements,               
        userId: userData._id,   
        userName: userData.firstName,
      });  };

  return (
    <div style={{ width: "100%", height: "690px" }}>
      <Excalidraw
        onPointerUpdate={handlePointerUpdate}
        onPointerUp={handlePointerUp}
        excalidrawAPI={(api) => (excalidrawAPI.current = api)}
        viewModeEnabled={!!isRecorded}
      />
    </div>
  );
}

export default Whiteboard;
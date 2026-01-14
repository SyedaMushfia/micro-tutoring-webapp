import React, { useEffect, useRef, useState } from 'react'
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Chat from '../components/chatComponents/Chat';
import Whiteboard from '../components/chatComponents/Whiteboard';
import useViewportWidth from '../hooks/useViewportWidth';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { socket } from '../utils';

interface SessionEndedPayload {
  studentAmountDeducted: number;
  tutorAmountCredited: number;
}

function ChatPage() {
  const { userData } = useAppContext()
  const [isChatClicked, setIsChatClicked] = useState(true);
  const [isWhiteboardClicked, setIsWhiteboardClicked] = useState(false);
  const width = useViewportWidth();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [otherUser, setOtherUser] = useState<{ name: string; profilePicture: string; online: boolean } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isRecorded, setIsRecorded] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const navigate = useNavigate();


  const isTab = width <= 769;

  useEffect(() => {
    if (!sessionId || !userData?._id) return;

    axios.get(`http://localhost:4000/api/session/${sessionId}`, {withCredentials: true})
      .then(res => {
        console.log("Session data:", res.data);
        const session = res.data;
        if (!session) return;

        setIsRecorded(session.status !== "Active");

        const start = new Date(session.startedAt).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - start) / 1000);
        const total = session.duration;

        setRemainingTime(Math.max(total - elapsed, 0));

        const otherParticipant = session.tutor._id === userData._id ? session.student : session.tutor;

        setOtherUser({
          name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
          profilePicture: otherParticipant.profilePicture,
          online: otherParticipant.isOnline
        });
      })
      .catch (error => console.error(error));
  }, [sessionId, userData])

  useEffect(() => {
    if (!userData) return;

    const handleSessionEnded = ({ studentAmountDeducted, tutorAmountCredited }: SessionEndedPayload) => {
      if (userData.role === "student") {
        setModalMessage(`Rs.${studentAmountDeducted} has been deducted from your wallet.`);
      } else {
        setModalMessage(`Rs.${tutorAmountCredited} has been credited to your account.`);
      }

      setShowModal(true);
    };

    socket.on("session-ended", handleSessionEnded);

    return () => {
      socket.off("session-ended", handleSessionEnded);
    };
  }, [userData]);

  useEffect(() => {
    if (remainingTime === null || isRecorded) return;

    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, isRecorded]);


  const handleClickChat = () => {
    setIsChatClicked(true);
    setIsWhiteboardClicked(false)
  }

  const handleWhiteboardClick = () => {
    setIsWhiteboardClicked(true);
    setIsChatClicked(false);
  }

  const handleShowModal = () => {
    setShowModal(false);

    if (userData.role === "student") {
      navigate("/studentDashboard");
    } else {
      navigate("/tutorDashboard");
    }
  };


  if (!otherUser) return <p>Loading chat...</p>

  return (
    <div>
      {isTab ? (
        <div>
          {remainingTime !== null && !isRecorded && (
            <div className="w-full flex justify-center items-center bg-gray-100 px-3 py-1.5 border-b-[1px] border-b-[#bfbfbf]">
              <div className='bg-red-200 border-[1px] border-red-300 px-4 rounded-lg'>
                <span className="text-sm font-medium mr-2 text-gray-700">
                  Time left:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.floor(remainingTime / 60)}:
                  {(remainingTime % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          )}
          <div className='flex justify-between'>
            <button className={`${isChatClicked ? 'bg-[#2e294e] text-white' : 'bg-white text-[#2e294e]'} w-[50%] border-[1px] border-[#2e294e] text-center py-4`} onClick={handleClickChat}>Chat</button>
            <button className={`${isWhiteboardClicked ? 'bg-[#2e294e] text-white' : 'bg-white text-[#2e294e]'} w-[50%] border-[1px] border-[#2e294e] text-center py-4`} onClick={handleWhiteboardClick}>Whiteboard</button>
          </div>
          {isChatClicked && <Chat sessionId={sessionId} userData={userData} otherUser={otherUser} isRecorded={isRecorded}/> || isWhiteboardClicked && <Whiteboard sessionId={sessionId} isRecorded={isRecorded}/>}
        </div>) : (
        <div>
          {remainingTime !== null && !isRecorded && (
            <div className="w-full flex justify-center items-center bg-gray-100 px-3 py-1.5 border-b-[1px] border-b-[#bfbfbf]">
              <div className='bg-red-200 border-[1px] border-red-300 px-4 rounded-lg'>
                <span className="text-sm font-medium mr-2 text-gray-700">
                  Time left:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.floor(remainingTime / 60)}:
                  {(remainingTime % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          )}
          <div className='bg-[#d8d8d8] flex'>
            <Chat sessionId={sessionId} userData={userData} otherUser={otherUser} isRecorded={isRecorded}/>
            <Whiteboard sessionId={sessionId} isRecorded={isRecorded}/>
          </div>
        </div>
    )}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[90%] max-w-md">
          <p className="mb-6 text-[#2e294e]">{modalMessage}</p>
          <button
            onClick={handleShowModal}
            className="bg-[#2e294e] text-white px-6 py-2 rounded-lg"
          >
            OK
          </button>
        </div>
      </div>
    )}

    </div>
  )
}

export default ChatPage

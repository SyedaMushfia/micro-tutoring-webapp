import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Chat from '../components/chatComponents/Chat';
import Whiteboard from '../components/chatComponents/Whiteboard';
import useViewportWidth from '../hooks/useViewportWidth';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { socket } from '../utils';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface SessionEndedPayload {
  studentAmountDeducted: number;
  tutorAmountCredited: number;
}

function ChatPage() {
  const { userData } = useAppContext()
  const width = useViewportWidth();
  const isTab = width <= 769;

  // UI state for mobile view (switch between chat and whiteboard)
  const [isChatClicked, setIsChatClicked] = useState(true);
  const [isWhiteboardClicked, setIsWhiteboardClicked] = useState(false);
  
  // Get sessionId from URL
  const { sessionId } = useParams<{ sessionId: string }>();
  const [otherUser, setOtherUser] = useState<{ name: string; profilePicture: string; online: boolean } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isRecorded, setIsRecorded] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const navigate = useNavigate();

  // Prevent user from leaving the page during an active session. Show warning modal if back button is pressed.
  useEffect(() => {
    if (isRecorded) return; 

    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);
      setModalMessage("You are in an active session. Please end the session before leaving.");
      setShowModal(true);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isRecorded]);

  // Fetch session details from backend. 
  useEffect(() => {
    if (!sessionId || !userData?._id) return;

    axios.get(`http://localhost:4000/api/session/${sessionId}`, {withCredentials: true})
      .then(res => {
        console.log("Session data:", res.data);
        const session = res.data;
        if (!session) return;
        setTutorId(session.tutor?._id ?? null);

        // If session is not active, mark as recorded
        setIsRecorded(session.status !== "Active");

        if (session.startedAt && session.status === "Active") {
          const sessionEnd = new Date(session.startedAt).getTime() + 20 * 60 * 1000;
          setRemainingTime(Math.max(0, Math.ceil((sessionEnd - Date.now()) / 1000)));
        }

        // Identify the other user (student or tutor)
        const otherParticipant = session.tutor._id === userData._id ? session.student : session.tutor;

        setOtherUser({
          name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
          profilePicture: otherParticipant.profilePicture,
          online: otherParticipant.isOnline
        });
      })
      .catch (error => console.error(error));
  }, [sessionId, userData])

  // Listen for session-ended event from server. Show wallet deduction/credit message.
  useEffect(() => {
    if (!userData) return;

    const handleSessionEnded = ({ studentAmountDeducted, tutorAmountCredited }: SessionEndedPayload) => {
      if (userData.role === "student") {
        setModalMessage(`Rs.${studentAmountDeducted} has been deducted from your wallet.`);
      } else {
        setModalMessage(`Rs.${tutorAmountCredited} has been credited to your account.`);
      }

      setShowModal(true);
      setIsRecorded(true);
    };

    socket.on("session-ended", handleSessionEnded);

    return () => {
      socket.off("session-ended", handleSessionEnded);
    };
  }, [userData]);

  // Listen for real-time session timer updates. End session automatically when time reaches zero.
  useEffect(() => {
    if (!sessionId) return;

    const handleSessionTick = (data: { remainingTime: number }) => {
      setRemainingTime(data.remainingTime);

      if (data.remainingTime <= 0) {
        setIsRecorded(true);
      }
    };

    socket.on("session-tick", handleSessionTick);

    return () => {
      socket.off("session-tick", handleSessionTick);
    };
  }, [sessionId]);


  const handleClickChat = () => {
    setIsChatClicked(true);
    setIsWhiteboardClicked(false)
  }

  const handleWhiteboardClick = () => {
    setIsWhiteboardClicked(true);
    setIsChatClicked(false);
  }

  // Close modal and redirect user to dashboard after session ends.
  const handleShowModal = () => {
    setShowModal(false);

    if (userData.role === "student") {
      navigate("/studentDashboard");
    } else {
      navigate("/tutorDashboard");
    }
  };

  const handleSubmitRating = async () => {
    if (!sessionId || !tutorId || !rating) return;

    try {
      const response = await axios.post("http://localhost:4000/api/reviews", {
        sessionId,
        rating,
      }, { withCredentials: true });

      if (response.data.success) {
        setRatingSubmitted(true);
        socket.emit("rating-submitted", {
          tutorId,
          average: response.data.summary.average,
          count: response.data.summary.count,
        });
        navigate("/studentDashboard");
      }
    } catch (error: any) {
      setModalMessage(error.response?.data?.message ?? "Failed to submit rating");
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
          <p className="mb-4 text-[#2e294e] font-bold">{modalMessage}</p>
          {userData.role === "student" && !ratingSubmitted && (
            <>
              <p className="text-[#2e294e] mb-2">Rate your tutor</p>
              <div className="flex justify-center mb-5" aria-label="Tutor rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} stars`}>
                    {value <= rating ? <StarIcon className="!text-4xl text-[#f5b700]" /> : <StarBorderIcon className="!text-4xl text-[#f5b700]" />}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmitRating}
                disabled={!rating}
                className="bg-[#2e294e] text-white px-6 py-2 rounded-lg mr-2 disabled:opacity-50"
              >
                Submit Rating
              </button>
            </>
          )}
          {userData.role !== "student" && (
            <button
              onClick={handleShowModal}
              className="bg-[#2e294e] text-white px-6 py-2 rounded-lg"
            >
              OK
            </button>
          )}
        </div>
      </div>
    )}

    </div>
  )
}

export default ChatPage

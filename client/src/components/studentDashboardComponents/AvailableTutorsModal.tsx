import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import axios from 'axios';
import { socket } from '../../utils';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import LazyImage from '../LazyImage';

interface AvailableTutorsModalProps {
  onShowModal: (value: boolean) => void;
  subject: string;
  questionData: {
    _id: string;
    userId: string;
    subject: string;
    topic: string;
    question: string;
    image?: string | null;
    createdAt: string;
  };
}

interface Tutor {
  _id: string;
  firstName: string;
  lastName: string;
  isFavorite?: boolean;
  tutor: {
    subjects: string[];
    bio: string;
    profilePicture: string;
  };
}

function AvailableTutorsModal({onShowModal, subject, questionData} : AvailableTutorsModalProps) {
  const navigate  = useNavigate()
  const { userData } = useAppContext();

  const [onlineTutors, setOnlineTutors] = useState<Tutor[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [requestedTutorId, setRequestedTutorId] = useState<string | null>(null);
  const [requestPending, setRequestPending] = useState(false);
  const [requestExpiryMsg, setRequestExpiryMsg] = useState<string | null>(null);

  // Fetch online tutors from backend based on selected subject
  const fetchOnlineTutors = async () => {
    const [tutorsRes, favoritesRes] = await Promise.all([
      axios.get(`http://localhost:4000/api/user/online-tutors?subject=${subject}`, { withCredentials: true }),
      axios.get(`http://localhost:4000/api/user/favorites`, { withCredentials: true }),
    ]);

    const favoriteIds = new Set((favoritesRes.data?.favorites || []).map((tutor: any) => tutor._id));
    const tutors = tutorsRes.data.map((tutor: Tutor) => ({ ...tutor, isFavorite: favoriteIds.has(tutor._id) }));
    setOnlineTutors(tutors);
  }

  // Fetch tutors on component mount and listen for tutor status updates
  useEffect(() => {
    fetchOnlineTutors();
    
    socket.on("tutor-status-updated", fetchOnlineTutors); // update tutor list when any tutor comes online/offline

    return () => {
      socket.off("tutor-status-updated");
    }
  }, [subject])

  // Update 'now' every second to enable countdown timer
  useEffect(() => {
    if (!timer) return;
    
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000)

    return () => clearInterval(interval);
  }, [timer])

  const getTimeLeft = () => {
    if (!timer) return null;

    const difference = timer - now;
    return difference > 0 ? Math.floor(difference / 1000) : 0;
  }

  const timeLeft = getTimeLeft();

  // Listen for expired requests and update the UI
  useEffect(() => {
    const handleRequestSent = (data: { tutorId: string; expiresAt: number }) => {
      setRequestedTutorId(data.tutorId);
      setTimer(data.expiresAt);
      setRequestPending(false);
      setNow(Date.now());
    };

    const handleExpiredRequest = (data: {tutorId: string, questionId: string}) => {
        setOnlineTutors(prev => prev.filter(tutor => tutor._id !== data.tutorId)); // Remove the expired tutor from the list

        // Reset request and timer states
        setRequestedTutorId(null);
        setTimer(null);
        setRequestPending(false);
        setNow(Date.now());

        setRequestExpiryMsg("Request expired. Please choose another tutor.");
    };

    socket.on("question-request-sent", handleRequestSent);
    socket.on("request-expired", handleExpiredRequest);

    return () => {
      socket.off("question-request-sent", handleRequestSent);
      socket.off("request-expired", handleExpiredRequest)
    }
  }, [])

  // Handle sending a request to a tutor
  const handleRequest = (tutor: Tutor) => {
    setRequestExpiryMsg(null);
    setRequestPending(true);
    setRequestedTutorId(tutor._id);
    setTimer(Date.now() + 60000);
    setNow(Date.now());

    // Emit socket event with question and student details
    socket.emit("send-question-request", {
      tutorId: tutor._id,
      questionId: questionData._id,
      subject: questionData.subject,
      question: questionData.question,
      image: questionData.image,
      student: {
        id: questionData.userId,
        name: `${userData.firstName}`,
        grade: userData.student?.grade,
        profilePicture: userData.student?.profilePicture
      }
    })

  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 sm:w-[600px] xs:w-[500px] shadow-xl  rounded-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between mb-4'>
              <h2 className="text-2xl font-semibold text-[#2e294e]">
                Available Tutors
              </h2>
              <CloseIcon onClick={() => onShowModal(false)} className='!text-2xl text-white bg-[#2e294e] hover:bg-[#675cae] rounded-full'/>
            </div>
            {requestExpiryMsg && (
              <h3 className='mb-4'>{requestExpiryMsg}</h3>
            )}
              <ul className=''>
                {Array.isArray(onlineTutors) && onlineTutors.length > 0 ? (
                  onlineTutors.map(tutor => (
                    <li key={tutor._id} className='flex justify-start items-center mb-6 bg-[#f2f4fc] shadow-lg h-[125px] sm:w-full xs:w-[100%] py-4 sm:px-[3%] xs:px-[2.5%] rounded-2xl'>
                      <div className='w-[5vw] h-[5vw] my-2 mr-4 rounded-full overflow-hidden'>
                        <LazyImage
                          src={tutor.tutor?.profilePicture}
                          alt={`${tutor.firstName} ${tutor.lastName}`}
                          width={80}
                          height={80}
                          className='h-full w-full rounded-full'
                          placeholderClassName='bg-[#eef1f9]'
                        />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-semibold">{tutor.firstName} {tutor.lastName}</h3>
                          {tutor.isFavorite && <span className="rounded-full bg-[#fff1f5] px-2 py-0.5 text-xs font-semibold text-[#d13b63]">Favorite</span>}
                        </div>
                        <ul className='flex sm:gap-6 xs:gap-2 sm:items-center'>{tutor.tutor?.subjects.map(sub => (
                          <li key={sub} className='!text-sm flex items-center gap-[1px] text-[#555] mb-2'>
                            <CircleIcon className='!text-sm'/>
                            <p>{sub}</p>
                          </li>
                      ))}</ul>
                      <p className='text-[#555]'>4.5⭐</p>
                      </div>
                      {requestPending && requestedTutorId === tutor._id ? (
                        <button disabled className='cursor-not-allowed bg-[#2e294e] ml-auto sm:px-8 xs:px-4 py-4 rounded-full text-white'>Requesting...</button>
                      ) : requestedTutorId === tutor._id && timeLeft !== null ? (
                        timeLeft > 0 ? (
                        <button disabled className='cursor-not-allowed bg-[#2e294e] hover:bg-[#675cae] ml-auto sm:px-8 xs:px-4 py-4 rounded-full text-white'>{timeLeft}</button>
                      ) : null
                        ) : (
                        <button onClick={() => handleRequest(tutor)} className='bg-[#2e294e] hover:bg-[#675cae] ml-auto sm:px-8 xs:px-4 py-4 rounded-full text-white'>Request</button>
                        )}
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No tutors available. Please try again later!</p>
                )}
              </ul>
            <p className="text-right mt-4 text-gray-700 font-medium text-lg">
              Session Price: <strong>LKR 250</strong>
            </p>
      </div>
    </div>
  )
}

export default AvailableTutorsModal

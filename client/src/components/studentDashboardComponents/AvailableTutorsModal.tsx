import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import axios from 'axios';
import { socket } from '../../utils';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

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
  const [requestExpiryMsg, setRequestExpiryMsg] = useState<string | null>(null);

  const fetchOnlineTutors = async () => {
    const res = await axios.get(`http://localhost:4000/api/user/online-tutors?subject=${subject}`, { withCredentials: true });
    console.log("API response:", res.data);
    setOnlineTutors(res.data);
  }

  useEffect(() => {
    fetchOnlineTutors();

    socket.on("tutor-status-updated", fetchOnlineTutors);

    return () => {
      socket.off("tutor-status-updated");
    }
  }, [subject])

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

  useEffect(() => {
    const handleExpiredRequest = (data: {tutorId: string, questionId: string}) => {

        setOnlineTutors(prev => prev.filter(tutor => tutor._id !== data.tutorId));

        setRequestedTutorId(null);
        setTimer(null);
        setNow(Date.now());

        setRequestExpiryMsg("Request expired. Please choose another tutor.");
    };

    socket.on("request-expired", handleExpiredRequest);

    return () => {
      socket.off("request-expired", handleExpiredRequest)
    }
  }, [])

  const handleRequest = (tutor: Tutor) => {
    setRequestExpiryMsg(null);

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

    setRequestedTutorId(tutor._id);
    setTimer(Date.now() + 60000);
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
                        <img src={tutor.tutor?.profilePicture} alt={tutor.firstName} className="w-full h-full object-cover"/>
                        </div>
                      <div>
                        <h3 className="font-semibold">{tutor.firstName} {tutor.lastName}</h3>
                        <ul className='flex sm:gap-6 xs:gap-2 sm:items-center'>{tutor.tutor?.subjects.map(sub => (
                          <li key={sub} className='!text-sm flex items-center gap-[1px] text-[#555] mb-2'>
                            <CircleIcon className='!text-sm'/>
                            <p>{sub}</p>
                          </li>
                      ))}</ul>
                      <p className='text-[#555]'>4.5⭐</p>
                      </div>
                      {requestedTutorId === tutor._id  && timeLeft !== null? (
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

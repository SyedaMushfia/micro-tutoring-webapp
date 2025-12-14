import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import axios from 'axios';
import { socket } from '../../utils';

interface AvailableTutorsModalProps {
  onShowModal: (value: boolean) => void;
  subject: string;
}

interface Tutor {
  _id: string;
  firstName: string;
  lastName: string;
  tutor: {
    subjects: string[];
    bio: string;
    profilePicture: string;
    rating: number;
  };
}

function AvailableTutorsModal({onShowModal, subject} : AvailableTutorsModalProps) {
  const [onlineTutors, setOnlineTutors] = useState<Tutor[]>([]);

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
                          <li className='!text-sm flex items-center gap-[1px] text-[#555] mb-2'>
                            <CircleIcon className='!text-sm'/>
                            <p>{sub}</p>
                          </li>
                      ))}</ul>
                      <p className='text-[#555]'>{tutor.tutor?.rating}⭐</p>
                      </div>
                      <button className='bg-[#2e294e] hover:bg-[#675cae] ml-auto sm:px-8 xs:px-4 py-4 rounded-full text-white'>Request</button>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No tutors available. Please try again later!</p>
                )}
                {/* {tutorsData.map(tutor => (
                  <li key={tutor.id} className='flex justify-between items-center mb-6 bg-[#f2f4fc] shadow-lg h-[125px] sm:w-full xs:w-[100%] py-4 sm:px-[3%] xs:px-[2.5%] rounded-2xl'>
                    <img src={tutor.image} alt={tutor.name} className="w-20 h-18 my-2 rounded-full object-cover"/>
                    <div>
                      <h3 className='text-base tracking-wide font-semibold text-[#2e294e] mb-2'>{tutor.name}</h3>
                      <ul className='flex sm:gap-6 xs:gap-2 sm:items-center'>{tutor.subjects.map(sub => (
                          <li className='!text-sm flex items-center gap-[1px] text-[#555] mb-2'>
                            <CircleIcon className='!text-sm'/>
                            <p>{sub}</p>
                          </li>
                      ))}</ul>
                      <p className='text-[#555]'>{tutor.rating}⭐</p>
                    </div>
                    <button className='bg-[#2e294e] hover:bg-[#675cae] sm:px-8 xs:px-4 py-4 rounded-full text-white'>Request</button>
                  </li>
                ))} */}
              </ul>
            <p className="text-right mt-4 text-gray-700 font-medium text-lg">
              Session Price: <strong>LKR 250</strong>
            </p>
      </div>
    </div>
  )
}

export default AvailableTutorsModal

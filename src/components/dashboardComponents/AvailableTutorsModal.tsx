import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';

interface AvailableTutorsModalProps {
  onShowModal: (value: boolean) => void;
}

function AvailableTutorsModal({onShowModal} : AvailableTutorsModalProps) {
  const tutorsData = [
  {
    id: 1,
    name: "Alice Johnson",
    subjects: ["Math", "Physics", "Chemistry"],
    rating: 4.8,
    image: "public/tutor1.png",
  },
  {
    id: 2,
    name: "Yehani Perera",
    subjects: ["Physics", "Math", "Biology"],
    rating: 4.6,
    image: "public/tutor2.png",
  },
  {
    id: 3,
    name: "Sarah Jane",
    subjects: ["English", "History", "Geography"],
    rating: 4.9,
    image: "public/tutor3.png",
  },
];


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
                {tutorsData.map(tutor => (
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
                ))}
              </ul>
            <p className="text-right mt-4 text-gray-700 font-medium text-lg">
              Session Price: <strong>LKR 250</strong>
            </p>
      </div>
    </div>
  )
}

export default AvailableTutorsModal

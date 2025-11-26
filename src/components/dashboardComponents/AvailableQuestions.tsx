import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useViewportWidth from '../../hooks/useViewportWidth';
import QuestionModal from './QuestionModal';
import type { QuestionRow } from '../../types';

function AvailableQuestions() {
  const navigate  = useNavigate()
    
  // Store the row currently selected for viewing inside the modal
  const [selectedRow, setSelectedRow] = useState<QuestionRow | null>(null);
  const width = useViewportWidth();

  const isMobile = width <= 640;

  const desktopColData = [
    { header: 'ID', field: 'id', width: '5%' },
    { header: 'Subject', field: 'subject', width: '10%' },
    { header: 'Question', field: 'question', width: '52%' },
    { header: 'Grade', field: 'grade', width: '12%' },
    { header: 'Student', field: 'student', width: '12%' },
    { header: 'Action', field: 'button', width: '12%' }
  ];

  const mobileColData = [
    { header: 'ID', field: 'id', width: '10%' },
    { header: 'Question', field: 'question', width: '75%' },
    { header: 'Action', field: 'button', width: '12%' }
  ]

  const rowData = [
    {
      id: 1,
      subject: 'Mathematics',
      question: 'A rectangle has a length of 10 centimeters and its width is 5 centimeters. If a smaller rectangle with a length of 5 and a width of 2 is cut from the corner, what is the area of the remaining shape?',
      grade: 'Grade 6',
      student: 'Sandali',
      image: 'public/question.png',
      button: 'Accept'
    },
    {
      id: 2,
      subject: 'Science',
      question: 'Why do objects appear lighter in water? Explain how buoyant force works.',
      grade: 'Grade 8',
      student: 'Tharushi',
      button: 'Accept'
    },
    {
      id: 3,
      subject: 'Mathematics',
      question: 'Solve for x: 3x + 4 = 19. What is the value of x?',
      grade: 'Grade 6',
      student: 'Ishaan',
      button: 'Accept'
    },
    {
      id: 4,
      subject: 'Science',
      question: 'Plants make their own food through photosynthesis. What two things do they need from the environment to carry this out?',
      grade: 'Grade 5',
      student: 'Maleesha',
      button: 'Accept'
    },
    {
      id: 5,
      subject: 'Mathematics',
      question: 'A shop sells pencils at Rs. 12 each. If a student buys 7 pencils, how much do they spend in total?',
      grade: 'Grade 4',
      student: 'Ravindu',
      button: 'Accept'
    }
  ];

  const handleView = (row: QuestionRow) => {
    setSelectedRow(row);
  };

  const closeModal = () => {
    setSelectedRow(null);
  };

  // Navigate to chatroom after tutor accepts the request
  const handleAccept = () => {
    navigate('/chatroom')
  }

  return (
    <div className='bg-[#f2f4fc] rounded-2xl px-[3%] h-[434px] overflow-y-scroll'>
      {isMobile ? (
        <div>
          <div className="flex py-4 text-sm font-semibold text-[#adadad] border-b border-gray-200">
          {mobileColData.map(col => (
           <div key={col.header} style={{ width: col.width }} className='text-left px-2'>
            {col.header}
          </div> ))}
          </div>
          {rowData.map((row, index) => (
          <div key={index} className="flex items-center text-[#2e294e] py-6 border-b border-gray-200">
            <p className='w-[10%] px-2 text-[14px]'>{row.id}</p>
            <div className='w-[75%]'>
              <p className='w-[90%] px-2 text-[14px] whitespace-nowrap overflow-hidden text-ellipsis font-medium'>{row.question}</p>
            </div>
            <button onClick={() => handleView(row)} className='text-sm font-semibold bg-[#d8d2ff] shadow-md rounded-xl text-[#2e294e] h-[40px] px-[3.5%] hover:bg-[#d1e674]'>View</button>
          </div> ))}
        </div>
      ) : (<div>
        <h1 className='text-[20px] text-[#2e294e] font-semibold py-[2%] border-b-[1px] border-b-gray-200'>Student Requests</h1>
        <div className="flex py-4 text-sm font-semibold text-[#adadad] border-b border-gray-200">
          {desktopColData.map(col => (
           <div key={col.header} style={{ width: col.width }} className='text-left px-2'>
            {col.header}
          </div> ))}
        </div>
        {rowData.map((row, index) => (
          <div key={index} className="flex items-center text-[#2e294e] py-6 border-b border-gray-200">
            <p className='w-[4.75%] px-2 text-[14px]'>{row.id}</p>
            <p className='w-[10%] px-2 text-[14px] font-medium whitespace-nowrap overflow-hidden text-ellipsis'>{row.subject}</p>
            <div className='w-[50%]'>
              <p className='w-[90%] px-2 text-[14px] whitespace-nowrap overflow-hidden text-ellipsis font-medium'>{row.question}</p>
            </div>
            <p className='w-[12%] px-2 text-[14px] font-medium'>{row.grade}</p>
            <p className='w-[12%] px-2 text-[14px]'>{row.student}</p>
            <button onClick={() => handleView(row)} className='text-sm font-semibold bg-[#d8d2ff] shadow-md rounded-xl text-[#2e294e] h-[40px] px-8 hover:bg-[#d1e674]'>View</button>
          </div> ))}
      </div>)}
      {/* MODAL */}
      {selectedRow && (
        <QuestionModal row={selectedRow} onClose={closeModal} onAccept={handleAccept}/>
      )}
    </div>
  )
}

export default AvailableQuestions

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useViewportWidth from '../../hooks/useViewportWidth';
import QuestionModal from './QuestionModal';
import type { QuestionRow } from '../../types';
import { socket } from '../../utils';
import { useAppContext } from '../../context/AppContext';

interface QuestionRequestPayload {
  questionId: string;
  subject: string;
  question: string;
  image?: string;
  timeLeft: number;
  student: {
    id: string;
    name: string;
    grade: string;
    profilePicture?: string;
  };
}

function QuestionRequests() {
  const { userData } = useAppContext();
    
  // Store the row currently selected for viewing inside the modal
  const [selectedRow, setSelectedRow] = useState<QuestionRow | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [now, setNow] = useState(Date.now());
  const width = useViewportWidth();

  const isMobile = width <= 640;

  useEffect(() => {
    const handleQuestionRequest = (data: QuestionRequestPayload) => {
      console.log("Received question request:", data);
      const timeLeft = Date.now() + 60000;

      setQuestions(prev => [
        ...prev,
        {
          id: data.questionId,
          subject: data.subject,
          question: data.question,
          image: data.image,
          grade: data.student.grade,
          student: data.student.name,
          studentId: data.student.id,
          profilePicture: data.student.profilePicture,
          timeLeft,
          button: "Accept"
        }]);
    };

    const handleExpiredRequest = (data: { questionId: string }) => {
      setQuestions(prev => prev.filter(question => question.id !== data.questionId));
    }

    socket.on("question-request", handleQuestionRequest);
    socket.on("request-expired", handleExpiredRequest);

    return () => {
      socket.off("question-request", handleQuestionRequest);
      socket.off("request-expired", handleExpiredRequest);
    };
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    setQuestions(prev => prev.filter(question => question.timeLeft > now))
  }, [now]);

  const getTimeLeft = (timeLeft: number) => {
    const seconds = Math.max(0, Math.floor((timeLeft - now) / 1000));
    return seconds;
  }

  const desktopColData = [
    { header: 'ID',  width: '5%' },
    { header: 'Subject', width: '10%' },
    { header: 'Question', width: '52%' },
    { header: 'Grade', width: '12%' },
    { header: 'Student', width: '12%' },
    { header: 'Timer', width: '15%'},
    { header: 'Action', width: '12%' }
  ];

  const mobileColData = [
    { header: 'ID', width: '10%' },
    { header: 'Question', width: '60%' },
    { header: 'Timer', width: '15%'},
    { header: 'Action', width: '15%' }
  ]

  const handleView = (row: QuestionRow) => {
    setSelectedRow(row);
  };

  const closeModal = () => {
    setSelectedRow(null);
  };

  // Navigate to chatroom after tutor accepts the request
  const handleAccept = (question: QuestionRow) => {
    console.log("Accept clicked", question);
    socket.emit("accept-question", {
      questionId: question.id,
      tutorId: userData._id,
      studentId: question.studentId
    })
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
          {questions.map((question, index) => (
          <div key={index} className="flex items-center text-[#2e294e] py-6 border-b border-gray-200">
            <p className='w-[10%] px-2 text-[14px] whitespace-nowrap overflow-hidden text-ellipsis'>{question.id}</p>
            <div className='w-[75%]'>
              <p className='w-[90%] px-2 text-[14px] whitespace-nowrap overflow-hidden text-ellipsis font-medium'>{question.question}</p>
            </div>
            <div className='w-[20%] ml-auto'>
              <p className='w-[50%] text-center py-2 text-[14px] font-medium bg-red-400 shadow-md rounded-xl text-white h-[38px] hover:bg-[#d1e674]'>{getTimeLeft(question.timeLeft)}</p>
            </div>
            <button onClick={() => handleView(question)} className='text-sm font-semibold bg-[#d8d2ff] shadow-md rounded-xl text-[#2e294e] h-[40px] px-[3.5%] hover:bg-[#d1e674]'>View</button>
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
        {questions.map((question, index) => (
          <div key={index} className="flex items-center text-[#2e294e] py-6 border-b border-gray-200">
            <p className='lg:w-[4.75%] md:w-[5%] sm:w-[5%] px-2 text-[14px] whitespace-nowrap overflow-hidden text-ellipsis'>{question.id}</p>
            <p className='lg:w-[10%] md:w-[8%] sm:w-[10%] px-2 text-[14px] font-medium whitespace-nowrap overflow-hidden text-ellipsis'>{question.subject}</p>
            <div className='lg:w-[50%] md:w-[43.5%] sm:w-[42%]'>
              <p className='lg:w-[90%] px-2 text-[14px] whitespace-nowrap overflow-hidden text-ellipsis font-medium'>{question.question}</p>
            </div>
            <p className='lg:w-[12%] md:w-[10%] px-2 text-[14px] font-medium'>{question.grade}</p>
            <p className='lg:w-[12%] md:w-[6%] px-2 text-[14px]'>{question.student}</p>
            <div className='lg:w-[13.5%] md:w-[8%] sm:w-[12%] ml-auto'>
              <p className='lg:w-[50%] md:w-[80%] sm:w-[60%] text-center py-2 text-[14px] font-medium bg-red-400 shadow-md rounded-xl text-white h-[38px] hover:bg-[#d1e674]'>{getTimeLeft(question.timeLeft)}</p>
            </div>
            <button onClick={() => handleView(question)} className='lg:mr-[20px] md:ml-auto lg: w-[10%] text-sm font-semibold bg-[#d8d2ff] shadow-md rounded-xl text-[#2e294e] h-[40px] text-center hover:bg-[#d1e674]'>View</button>
          </div> ))}
      </div>)}
      {/* MODAL */}
      {selectedRow && (
        <QuestionModal row={selectedRow} onClose={closeModal} onAccept={handleAccept}/>
      )}
    </div>
  )
}

export default QuestionRequests

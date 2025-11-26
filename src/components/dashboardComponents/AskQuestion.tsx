import React, { useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ErrorIcon from '@mui/icons-material/Error';
import AvailableTutorsModal from './AvailableTutorsModal';

function AskQuestion() {
  const subjects = [
  "Mathematics",
  "Science",
  "English",
  "Sinhala",
  "ICT",
  "Chemistry",
  "Biology",
  "Physics",
  "Commerce",
  "History",
];

  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Validate fields and open available tutor modal
  const handleClickAskQuestion = () => {
    if (!subject || !topic || !question) {
        setError('Please fill in all fields before submitting.');
        return;
    }
    
    setError('');
    setShowModal(true);
    setSubject('');
    setTopic('');
    setQuestion('');

    console.log(subject, topic, question)
  }

  return (
    <div className='md:w-[78.5vw] sm:w-full bg-[#f2f4fc] rounded-2xl px-[3%] h-[435px] md:mt-[1%] xs:mt-[2%] py-[1%]'>
        <div className='h-[350px]'>
            <div className='flex gap-14'>
                {/* Subject Dropdown */}
                <div className='relative flex flex-col w-[50%]'>
                    <label htmlFor="subject" className='text-[#555] text-text3 font-medium ml-[1%] mb-[1%]'>Subject</label>
                    <select name="subject" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className='appearance-none h-[40px] !bg-white rounded-md px-[3%] border-[1px]'>
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                    <div className="absolute sm:top-[43px] xs:top-[35px] lg:left-[95%] md:left-[92%] sm:left-[95%] xs:left-[85%] text-gray-700 pointer-events-none">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                {/* Topic Field */}
                <div className='flex flex-col w-[50%]'>
                    <label htmlFor="topic" className='text-[#555] text-text3 font-medium ml-[1%] mb-[1%]'>Topic</label>
                    <input type="text" id="topic" name="topic" placeholder="E.g., Algebra" value={topic} onChange={(e) => setTopic(e.target.value)} className='h-[40px] !bg-white rounded-md px-[3%] border-[1px]'/>
                </div>
            </div>
            {/* Question Textarea */}
            <div>
                <textarea name="question" id="question" placeholder='Type your question here...' value={question} onChange={(e) => setQuestion(e.target.value)} className='px-4 py-2 my-[1%] h-[250px] w-full appearance-none resize-none rounded-xl border-[1px]'></textarea>
            </div>
            {error && <div className='flex items-center gap-2 text-[14px] mt-[-1%] text-red-600'>
                    <ErrorIcon className='!text-[18px]'/>
                    <p>{error}</p>
            </div>}
        </div>
        <div className='flex sm:justify-end xs:justify-center gap-4'>
            <div className='flex bg-[#2e294e] hover:bg-[#675cae] px-6 py-4 rounded-full text-white'>
                <AddPhotoAlternateIcon />
                <p>Upload Image</p>
            </div>
            <button onClick={handleClickAskQuestion} className='bg-[#2e294e] hover:bg-[#675cae] px-10 py-4 rounded-full text-white'>Ask Question</button>
        </div>
        {showModal && <AvailableTutorsModal onShowModal={setShowModal}/>}
    </div>
  )
}

export default AskQuestion

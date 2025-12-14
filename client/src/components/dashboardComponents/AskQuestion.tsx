import React, { useState, type FormEvent } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ErrorIcon from '@mui/icons-material/Error';
import AvailableTutorsModal from './AvailableTutorsModal';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

function AskQuestion() {
  const [image, setImage] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const { backendUrl } = useAppContext();

  const subjects = [
  "Mathematics",
  "Science",
  "English Language",
  "English Literature",
  "Sinhala",
  "ICT",
  "Chemistry",
  "Biology",
  "Physics",
  "Commerce",
  "History",
  ];

  const [questionData, setQuestionData] = useState({
    subject: '',
    topic: '',
    question: '',
  })

  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setQuestionData(prev => ({ ...prev, [name]: value}));

    setError('');
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
      if (img) {
        setImage(img);
        setPreviewImg(URL.createObjectURL(img));
      }
  }

  // Validate fields and open available tutor modal
  const handleClickAskQuestion = async (e: FormEvent) => {
    e.preventDefault();

    if (!questionData.subject || !questionData.topic || !questionData.question) {
        setError('Please fill in all fields before submitting.');
        return;
    }

    const formData = new FormData();

    formData.append("subject", questionData.subject);
    formData.append("topic", questionData.topic);
    formData.append("question", questionData.question);

    if (image) formData.append("image", image);

    try {
        const response = await axios.post(`${backendUrl}/api/question/askQuestion`, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });

        if (response.data.success) {
            setShowModal(true);
        }
    } catch (error: any) {
        setError(error.response?.data?.message);
    }
    
  }

  return (
    <div className='md:w-[78.5vw] sm:w-full bg-[#f2f4fc] rounded-2xl px-[3%] min-h-[435px] md:mt-[1%] xs:mt-[2%] py-[1%]'>
        <form>
            <div className='min-h-[350px]'>
                <div className='flex gap-14'>
                    {/* Subject Dropdown */}
                    <div className='relative flex flex-col w-[50%]'>
                        <label htmlFor="subject" className='text-[#555] text-text3 font-medium ml-[1%] mb-[1%]'>Subject</label>
                        <select name="subject" id="subject" value={questionData.subject} onChange={handleInputChange} className='appearance-none h-[40px] !bg-white rounded-md px-[3%] border-[1px]'>
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
                        <input type="text" id="topic" name="topic" placeholder="E.g., Algebra" value={questionData.topic} onChange={handleInputChange} className='h-[40px] !bg-white rounded-md px-[3%] border-[1px]'/>
                    </div>
                </div>
                {/* Question Textarea */}
                <div className={`${previewImg ? 'xs:flex-col justify-center items-center' : 'xs:flex-row justify-between'} flex sm:flex-row sm:justify-between w-full`}>
                    <div>
                        <textarea name="question" id="question" placeholder='Type your question here...' value={questionData.question} onChange={handleInputChange} className={`${previewImg ? 'md:w-[58vw] sm:w-[60vw] xs:w-[91vw]' : 'md:w-[74vw] xs:w-[91vw]'} px-4 py-2 my-[1%] h-[250px] appearance-none resize-none rounded-xl border-[1px]`}></textarea>
                    </div>
                    {previewImg ? <div className='md:w-[20%] xs:w-[40%] h-[250px] rounded-xl border-[1px] sm:my-[0.75%] xs:mt-[1%] xs:mb-[3%]'><img src={previewImg} alt="question image" className='w-full h-full object-cover rounded-xl border-[1px]'/></div> : null}
                </div>
                {error && <div className='flex items-center gap-2 text-[14px] mt-[-1%] text-red-600'>
                        <ErrorIcon className='!text-[18px]'/>
                        <p>{error}</p>
                </div>}
            </div>
            <div className='flex sm:justify-end xs:justify-center gap-4 xs:mb-[3%] sm:mb-0'>
                <div className='bg-[#2e294e] hover:bg-[#675cae] px-6 py-4 rounded-full text-white'>
                    <label htmlFor="img" className='flex'>
                        <AddPhotoAlternateIcon />
                        <p>Upload Image</p>
                        <input
                            type="file"
                            id="img"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </label>
                </div>
                <button type='submit' onClick={handleClickAskQuestion} className='bg-[#2e294e] hover:bg-[#675cae] px-10 py-4 rounded-full text-white'>Ask Question</button>
            </div>
        </form>
        {showModal && <AvailableTutorsModal onShowModal={setShowModal} subject={questionData.subject}/>}
    </div>
  )
}

export default AskQuestion

import { useState } from 'react'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import SignUpForm from '../../components/SignUpForm';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

function StudentSignUpPage() {
  const navigate = useNavigate();
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);
  const [clickedFinish, setClickedFinish] = useState(false);
  const [formData, setFormData] = useState({
    grade: '',
    curriculum: '',
    gender: '',
    institutionOrSchool: '',
  });

  const [errors, setErrors] = useState({
    grade: '',
    curriculum: '',
    gender: '',
    institutionOrSchool: '',
  });

  const selectFields = [
    {
        nameOfInput: 'Grade',
        id: 'grade',
        placeholder: 'Grade 5', 
        ariaLabel: 'Select grade',
        options: ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13']
    },
    {
        nameOfInput: 'Curriculum',
        id: 'curriculum',
        placeholder: 'G.C.E. Ordinary Level (O/L)',
        ariaLabel: 'Select curriculum',
        options: ['G.C.E. Ordinary Level (O/L)', 'G.C.E. Advanced Level (A/L)', 'Cambridge IGCSE', 'Pearson Edexcel IGCSE', 'Cambridge International AS & A Level', 'Pearson Edexcel International AS & A Level']
    },
    {
      nameOfInput: 'Gender',
      id: 'gender',
      placeholder: 'Male',
      ariaLabel: 'Select gender',
      options: ['Male', 'Female', 'Other']
    },
  ];

  const handleClickNext = () => {
    setSignUpClicked(false);
    setNextClicked(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({ ...prev, [name]: value}));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile details', formData);
    setClickedFinish(true);
    navigate('/studentDashboard');
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [id]: "This field is required",
      }));
    }
  }

  const isFormValid = () => {
        const allFieldsValid = selectFields.every(field => formData[field.id as keyof typeof formData]) && formData.institutionOrSchool.trim() !== '';
        return allFieldsValid;
  }

  return (
    <>
        {signUpClicked ? (
          <div className='h-full flex flex-col items-center justify-center'>
            <CheckCircleIcon className='!text-[8vw] text-green-600 mt-[-5%]'/>
            <h1 className='text-center lg:text-[25px] md:text-text1 sm:text-[30px] xs:text-text2 text-[#2e294e] font-semibold'>Your Account has been created!</h1>
            <p className='w-[75%] text-center text-[15px] font-medium text-[#555] md:mb-[5%] xs:mb-[5%]'>Set up your student profile to connect with tutors and get instant help whenever you need it.</p>
            <button onClick={handleClickNext} className='bg-[#2e294e] md:w-[18vw] sm:w-[50vw] xs:w-[70vw] py-[2.5%] font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#5e578a] transition-all duration-300'>Next</button>
          </div>
        ) : nextClicked ? (
          <>
            <form onSubmit={handleFinish}>
                <div className='md:w-[30vw] sm:w-[60vw]'>
                    <h1 className='text-center lg:text-[30px] md:text-text1 sm:text-[30px] xs:text-text2 text-[#2e294e] font-semibold sm:mt-[8%] xs:mt-[8%] mb-[10%]'>Let's set up your profile!</h1>
                    {selectFields.map(field => (
                        <div key={field.id} className='h-[70px] mb-[5px]'>
                            <div key={field.nameOfInput} className='relative flex justify-between items-center gap-[1vw] '>
                                <label htmlFor={field.id} className='text-[#555] text-text3 font-medium'>{field.nameOfInput}</label>
                                <select
                                  name={field.id}
                                  id={field.id}
                                  value={formData[field.id as keyof typeof formData]}
                                  onChange={handleInputChange}
                                  onBlur={handleBlur}
                                  required
                                  className='appearance-none md:w-[18vw] sm:w-[32vw] xs:w-[40vw] h-[40px] !bg-white rounded-md px-[3%] border-[1px] border-[#a7a7a7]'>
                                    <option value="" disabled hidden>Select an option</option>
                                    {field.options.map((option, i) => (
                                                <option key={option} value={option} className='text-text3'>{option}</option>
                                        ))}
                                </select>
                                <div className="absolute lg:left-[95%] md:left-[92%] sm:left-[95%] xs:left-[93%] text-gray-700 pointer-events-none">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                            {errors[field.id as keyof typeof errors] && <div className='flex md:ml-[40%] sm:ml-[47%] xs:ml-[43%] gap-[2px] items-center text-red-600'>
                                <ErrorIcon className='!text-[18px]'/>
                                <p className='text-[13px]'>{errors[field.id as keyof typeof errors]}</p>
                            </div>}
                        </div>                
                    ))}
                    <div>
                        <div className='h-[65px]'>
                          <div className='flex justify-between items-center gap-[1vw]'>
                              <label htmlFor="institutionOrSchool" className='text-[#555] text-text3 font-medium'>  Institution/<br />School</label>
                              <input
                                  type="text"
                                  id='institutionOrSchool'
                                  name='institutionOrSchool'
                                  value={formData.institutionOrSchool}
                                  onChange={handleInputChange}
                                  onBlur={handleBlur}
                                  required
                                  className="md:w-[18vw] sm:w-[32vw] xs:w-[40vw] h-[40px] !bg-white rounded-md px-[3%] border-[1px] border-[#a7a7a7]"/>
                          </div>
                          {errors.institutionOrSchool && <div className='flex md:ml-[40%] sm:ml-[47%] xs:ml-[43%] mt-[-4px] gap-[2px] items-center text-red-600'>
                                  <ErrorIcon className='!text-[18px]'/>
                                  <p className='text-[13px]'>{errors.institutionOrSchool}</p>
                          </div>}
                        </div>
                    </div>
                    <div className='flex justify-between items-center gap-[1vw] xs:mb-[45px]'>
                        <p className='text-[#555] font-medium text-text3'>Upload Profile Picture</p>
                        <AddAPhotoIcon className="!text-[#2e294e] sm:!text-[90px] xs:!text-[5rem] bg-white sm:px-[5%] xs:px-[5%] rounded-full"/>
                    </div>
                    <button type='submit' disabled={!isFormValid()} className='bg-[#2e294e] md:w-[18vw] sm:w-[50vw] xs:w-[70vw] py-[2.5%] md:ml-[20%] sm:ml-[8%] xs:ml-0 font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#5e578a] transition-all duration-300'>Finish</button>
                </div>
            </form>
          </>
        ) : (
        <>
        <h1 className='lg:text-[30px] md:text-text1 sm:text-[30px] xs:text-text2 text-[#2e294e] font-semibold lg:mt-[7%] md:mt-[9%] sm:mt-[5%] sm:mb-[5%] xs:mt-[7%] xs:mb-[5%] md:mb-[3%]'>Sign Up as a Student!</h1>
        <SignUpForm onSignUpClicked={setSignUpClicked}/>
        </>
        )
        }
    </>
  )
}

export default StudentSignUpPage

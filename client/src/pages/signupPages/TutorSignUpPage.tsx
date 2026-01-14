import { useState } from 'react'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import SignUpForm from '../../components/SignUpForm';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import Select from "react-select";


function TutorSignUpPage() {
  const navigate = useNavigate();
  const { backendUrl, setUserData } = useAppContext()

  const [signUpClicked, setSignUpClicked] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    qualification: '',
    experience: '',
    subjects: [],
    bio: '',
  });

  const [errors, setErrors] = useState({
    qualification: "",
    experience: "",
    subjects: "",
    bio: "",
  });

  const qualificationOptions = [
    {value: "Diploma", label: "Diploma"},
    {value: "Bachelor’s Degree", label: "Bachelor’s Degree"},
    {value: "Postgraduate Diploma", label: "Postgraduate Diploma"},
    {value: "Master’s Degree", label: "Master’s Degree"},
    {value: "Doctorate (PhD)", label: "Doctorate (PhD)"},
    {value: "Teaching Certificate", label: "Teaching Certificate"},
  ];

  const experienceOptions = [
    {value: "Less than 1 year", label: "Less than 1 year"},
    {value: "1-3 years", label: "1-3 years"},
    {value: "3-5 years", label: "3-5 years"},
    {value: "5-10 years", label: "5-10 years"},
    {value: "10+ years", label: "10+ years"},
  ];

  const subjectOptions = [
    {value: "Mathematics", label: "Mathematics"},
    {value: "Science", label: "Science"},
    {value: "ICT", label: "ICT"},
    {value: "English Language", label: "English Language"},
    {value: "English Literature", label: "English Literature"},
    {value: "ENV", label: "ENV"},
    {value: "Sinhala", label: "Sinhala"},
    {value: "Tamil", label: "Tamil"},
    {value: "Business Studies", label: "Business Studies"},
    {value: "Economics", label: "Economics"},
    {value: "Accounting", label: "Accounting"},
    {value: "Commerce", label: "Commerce"},
    {value: "History", label: "History"},
    {value: "Geography", label: "Geography"},
    {value: "Social Studies", label: "Social Studies"},
  ];

  const customStyles = {
    multiValue: (provided: any) => ({
      ...provided,
      display: 'flex',
      flex: '0 1 auto',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      display: 'flex',
      flexWrap: 'nowrap',   
      overflow: 'hidden',
    }),
};


  const handleClickNext = () => {
    setSignUpClicked(false);
    setNextClicked(true);
  }

  const handleQualificationChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : "";

    setFormData(prev => ({ ...prev, qualification: value }));
    setErrors(prev => ({ ...prev, qualification: value ? "" : "This field is required"}));
  }

  const handleExperienceChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : "";

    setFormData(prev => ({ ...prev, experience: value }));
    setErrors(prev => ({ ...prev, experience: value ? "" : "This field is required"}));
  }

  const handleSubjectsChange = (selectedOptions: any) => {
    const values = selectedOptions ? selectedOptions.map((subject: any) => subject.value) : [];

    setFormData(prev => ({ ...prev, subjects: values }));
    setErrors(prev => ({ ...prev, subjects: values.length ? "" : "Choose at least one subject"}));
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
      if (img) {
        setProfilePicture(img);
        setPreviewImg(URL.createObjectURL(img));
      }
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = e.target;
    setFormData(prev => ({ ...prev, bio: value}));

    setErrors((prev) => ({ ...prev, bio: value.trim() ? "" : "This field is required" }));
  }

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      qualification: formData.qualification ? "" : "This field is required",
      experience: formData.experience ? "" : "This field is required",
      subjects: formData.subjects.length > 0 ? "" : "Choose at least one subject",
      bio: formData.bio.trim() ? "" : "This field is required",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) return;

    const data = new FormData();

    data.append("qualification", formData.qualification);
    data.append("experience", formData.experience);
    formData.subjects.forEach(subject => {
      data.append("subjects[]", subject);
    });
    data.append("bio", formData.bio)

    if (profilePicture !== null) {
      data.append("profilePicture", profilePicture);
    }
    
    try {
    const res = await axios.post(
      `${backendUrl}/api/auth/setup-profile`,
      data,
      { withCredentials: true, headers: {"Content-Type": "multipart/form-data"}, }
    );

    if (res.data.success) {
      setUserData(res.data.user);
      navigate("/tutorDashboard");
    }

  } catch (error) {
    console.log(error);
  }
}

  return (
    <>
        {signUpClicked ? (
            <div className='h-full flex flex-col items-center justify-center'>
              <CheckCircleIcon className='!text-[8vw] text-green-600 mt-[-5%]'/>
              <h1 className='text-center lg:text-[25px] md:text-text1 sm:text-[30px] xs:text-text2 text-[#2e294e] font-semibold'>Your Account has been created!</h1>
              <p className='w-[75%] text-center text-[15px] font-medium text-[#555] md:mb-[5%] xs:mb-[5%]'>Set up your tutor profile to start connecting with students and offering your lessons.</p>
              <button onClick={handleClickNext} className='bg-[#2e294e] md:w-[18vw] sm:w-[50vw] xs:w-[70vw] py-[2.5%] font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#5e578a] transition-all duration-300'>Next</button>
            </div>
        ) : nextClicked ? (
          <>
            <form onSubmit={handleFinish}>
                <div className='md:w-[30vw] sm:w-[60vw]'>
                    <h1 className='text-center lg:text-[30px] md:text-text1 sm:text-[30px] xs:text-text2 text-[#2e294e] font-semibold sm:mt-[7%] xs:mt-[8%] mb-[6%]'>Let's set up your profile!</h1>
                    <div className='h-[75px]'>
                      <div className='flex justify-between items-start gap-[1vw]'>
                        <label className='text-[#555] text-text3 font-medium'>Qualification</label>
                        <Select
                          options={qualificationOptions}
                          onChange={handleQualificationChange}
                          onBlur={() => {
                                    if (!formData.qualification) {
                                      setErrors(prev => ({ ...prev, qualification: "This field is required" }));
                                    }}}
                          className='md:w-[18vw] sm:w-[32vw] xs:w-[40vw]'/>
                      </div>
                        {errors.qualification && (
                          <div className='flex md:ml-[40%] sm:ml-[47%] xs:ml-[43%] gap-[2px] items-center text-red-600'>
                            <ErrorIcon className='!text-[18px]'/>
                            <p className='text-[13px]'>{errors.qualification}</p>
                          </div>
                        )}
                    </div>
                    <div className='h-[75px]'>
                    <div className='flex justify-between items-start gap-[1vw]'>
                      <label className='text-[#555] text-text3 font-medium'>Experience</label>
                      <Select 
                        options={experienceOptions} 
                        onChange={handleExperienceChange} 
                        onBlur={() => {
                                  if (!formData.experience) {
                                    setErrors(prev => ({ ...prev, experience: "This field is required" }));
                                  }}} 
                        className='md:w-[18vw] sm:w-[32vw] xs:w-[40vw]'/>    
                    </div>                  
                        {errors.experience && (
                        <div className='flex md:ml-[40%] sm:ml-[47%] xs:ml-[43%] gap-[2px] items-center text-red-600'>
                          <ErrorIcon className='!text-[18px]'/>
                          <p className='text-[13px]'>{errors.experience}</p>
                        </div>
                      )}
                    </div>
                    <div className='h-[65px]'>
                    <div className='flex justify-between items-start gap-[1vw]'>
                      <label className='text-[#555] text-text3 font-medium'>Subjects</label>
                      <Select 
                        isMulti 
                        options={subjectOptions} 
                        onChange={handleSubjectsChange} 
                        onBlur={() => {
                                  if (formData.subjects.length === 0) {
                                    setErrors(prev => ({ ...prev, subjects: "This field is required" }));
                                  }}} 
                        className='md:w-[18vw] sm:w-[32vw] xs:w-[40vw]'
                        styles={customStyles}/>
                    </div>
                      {errors.subjects && (
                        <div className='flex md:ml-[40%] sm:ml-[47%] xs:ml-[43%] gap-[2px] items-center text-red-600'>
                          <ErrorIcon className='!text-[18px]'/>
                          <p className='text-[13px]'>{errors.subjects}</p>
                        </div>
                      )}
                    </div>
                    <div className='flex justify-between items-center gap-[1vw] xs:mb-[15px]'>
                      <p className='text-[#555] font-medium text-text3'>Upload Profile Picture</p>
                      <label htmlFor="profilePicture" className="cursor-pointer">
                        <div className='sm:w-[90px] sm:h-[90px] xs:w-[5rem] xs:h-[5rem]'>
                        {previewImg ? (
                            <img
                              src={previewImg}
                              alt="Profile Preview"
                              className="w-full h-full rounded-full object-cover border-[1px] border-[#2e294e]"
                            />
                        ) : (
                          <AddAPhotoIcon className="!text-[#2e294e] sm:!text-[90px] xs:!text-[5rem] bg-white sm:px-[22%] xs:px-[5%] rounded-full"/>
                        )}
                        </div>
                      </label>
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className='h-[150px]'>
                      <div className='flex justify-between items-start gap-[1vw]'>
                          <label htmlFor="bio" className='text-[#555] font-medium text-text3'>About Me</label>
                          <textarea
                              name="bio"
                              id="bio"
                              rows={5}
                              value={formData.bio}
                              onBlur={() => {
                                  if (!formData.bio) {
                                    setErrors(prev => ({ ...prev, bio: "This field is required" }));
                                  }}} 
                              onChange={handleBioChange}
                              placeholder='Tell students about yourself...'
                              className="md:w-[18vw] sm:w-[32vw] xs:w-[40vw] h-[115px] !bg-white rounded-md px-[3%] py-[1%] border-[1px] border-[#dadada] focus:border-blue-500 focus:border-[2px] focus:ring-[1px] focus:ring-blue-200 focus:ring-opacity-50 outline-none appearance-none resize-none"></textarea>
                      </div>
                      {errors.bio && <div className='flex md:ml-[40%] sm:ml-[47%] xs:ml-[43%] gap-[2px] items-center text-red-600'>
                                    <ErrorIcon className='!text-[18px]'/>
                                    <p className='text-[13px]'>{errors.bio}</p>
                      </div>}
                    </div>
                    <button type='submit' className="bg-[#2e294e] md:w-[18vw] sm:w-[50vw] xs:w-[70vw] py-[2.5%] md:ml-[20%] sm:ml-[8%] xs:ml-0 font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#5e578a] transition-all duration-300">Finish</button>
                </div>
            </form>
            </>
        ) : (
        <>
        <h1 className='lg:text-[30px] md:text-text1 sm:text-[30px] xs:text-text2 text-[#2e294e] font-semibold lg:mt-[7%] md:mt-[9%] sm:mt-[5%] sm:mb-[5%] xs:mt-[7%] xs:mb-[5%] md:mb-[3%]'>Sign Up as a Tutor!</h1>
        <SignUpForm onSignUpClicked={setSignUpClicked} role='tutor'/>
        </>
        )
        }
    </>
  )
}

export default TutorSignUpPage

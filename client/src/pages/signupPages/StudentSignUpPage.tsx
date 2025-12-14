import { useState } from 'react'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import SignUpForm from '../../components/SignUpForm';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import Select from "react-select";

function StudentSignUpPage() {
  const { backendUrl, setUserData } = useAppContext()

  const navigate = useNavigate();
  const [signUpClicked, setSignUpClicked] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null); 
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

  const gradeOptions = [
    {value: "Grade 5", label: "Grade 5"},
    {value: "Grade 6", label: "Grade 6"},
    {value: "Grade 7", label: "Grade 7"},
    {value: "Grade 8", label: "Grade 8"},
    {value: "Grade 9", label: "Grade 9"},
    {value: "Grade 10", label: "Grade 10"},
    {value: "Grade 11", label: "Grade 11"},
    {value: "Grade 12", label: "Grade 12"},
    {value: "Grade 13", label: "Grade 13"},
  ];

  const curriculumOptions = [
    {value: "G.C.E. Ordinary Level (O/L)", label: "G.C.E. Ordinary Level (O/L)"},
    {value: "G.C.E. Advanced Level (A/L)", label: "G.C.E. Advanced Level (A/L)"},
    {value: "Cambridge IGCSE", label: "Cambridge IGCSE"},
    {value: "Pearson Edexcel IGCSE", label: "Pearson Edexcel IGCSE"},
    {value: "Cambridge International AS & A Level", label: "Cambridge International AS & A Level"},
    {value: "Pearson Edexcel International AS & A Level", label: "Pearson Edexcel International AS & A Level"},
  ];

  const genderOptions = [
    {value: "Male", label: "Male"},
    {value: "Female", label: "Female"},
  ];

 const handleGradeChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : "";

    setFormData(prev => ({ ...prev, grade: value }));
    setErrors(prev => ({ ...prev, grade: value ? "" : "This field is required"}));
  }

  const handleCurriculumChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : "";

    setFormData(prev => ({ ...prev, curriculum: value }));
    setErrors(prev => ({ ...prev, curriculum: value ? "" : "This field is required"}));
  }

  const handleGenderChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : "";

    setFormData(prev => ({ ...prev, gender: value }));
    setErrors(prev => ({ ...prev, gender: value ? "" : "This field is required"}));
  }

  const handleClickNext = () => {
    setSignUpClicked(false);
    setNextClicked(true);
  }

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({ ...prev, [name]: value}));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
      if (img) {
        setProfilePicture(img);
        setPreviewImg(URL.createObjectURL(img));
      }
  }

  const isFormValid = () => {
        const allFieldsValid = formData.grade && formData.curriculum && formData.gender && formData.institutionOrSchool.trim() !== '';
        return allFieldsValid;
  }

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    data.append("grade", formData.grade);
    data.append("curriculum", formData.curriculum);
    data.append("institutionOrSchool", formData.institutionOrSchool);
    data.append("gender", formData.gender)

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
      setUserData(res.data.user)
      navigate("/studentDashboard");
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
            <p className='w-[75%] text-center text-[15px] font-medium text-[#555] md:mb-[5%] xs:mb-[5%]'>Set up your student profile to connect with tutors and get instant help whenever you need it.</p>
            <button onClick={handleClickNext} className='bg-[#2e294e] md:w-[18vw] sm:w-[50vw] xs:w-[70vw] py-[2.5%] font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#5e578a] transition-all duration-300'>Next</button>
          </div>
        ) : nextClicked ? (
          <>
            <form onSubmit={handleFinish}>
                <div className='md:w-[30vw] sm:w-[60vw]'>
                    <h1 className='text-center lg:text-[30px] md:text-text1 sm:text-[30px] xs:text-text2 text-[#2e294e] font-semibold sm:mt-[10%] xs:mt-[8%] mb-[10%]'>Let's set up your profile!</h1>
                    <div className='h-[75px]'>
                      <div className='flex justify-between items-start gap-[1vw]'>
                        <label className='text-[#555] text-text3 font-medium'>Grade</label>
                        <Select
                          options={gradeOptions}
                          onChange={handleGradeChange}
                          onBlur={() => {
                                    if (!formData.grade) {
                                      setErrors(prev => ({ ...prev, grade: "This field is required" }));
                                    }}}
                          className='md:w-[18vw] sm:w-[32vw] xs:w-[40vw]'/>
                      </div>
                        {errors.grade && (
                          <div className='flex md:ml-[40%] sm:ml-[47%] xs:ml-[43%] gap-[2px] items-center text-red-600'>
                            <ErrorIcon className='!text-[18px]'/>
                            <p className='text-[13px]'>{errors.grade}</p>
                          </div>
                        )}
                    </div>
                    <div className='h-[75px]'>
                      <div className='flex justify-between items-start gap-[1vw]'>
                        <label className='text-[#555] text-text3 font-medium'>Curriculum</label>
                        <Select
                          options={curriculumOptions}
                          onChange={handleCurriculumChange}
                          onBlur={() => {
                                    if (!formData.curriculum) {
                                      setErrors(prev => ({ ...prev, curriculum: "This field is required" }));
                                    }}}
                          className='md:w-[18vw] sm:w-[32vw] xs:w-[40vw]'/>
                      </div>
                        {errors.curriculum && (
                          <div className='flex md:ml-[40%] sm:ml-[47%] xs:ml-[43%] gap-[2px] items-center text-red-600'>
                            <ErrorIcon className='!text-[18px]'/>
                            <p className='text-[13px]'>{errors.curriculum}</p>
                          </div>
                        )}
                    </div>
                    <div className='h-[75px]'>
                      <div className='flex justify-between items-start gap-[1vw]'>
                        <label className='text-[#555] text-text3 font-medium'>Gender</label>
                        <Select
                          options={genderOptions}
                          onChange={handleGenderChange}
                          onBlur={() => {
                                    if (!formData.gender) {
                                      setErrors(prev => ({ ...prev, gender: "This field is required" }));
                                    }}}
                          className='md:w-[18vw] sm:w-[32vw] xs:w-[40vw]'/>
                      </div>
                        {errors.gender && (
                          <div className='flex md:ml-[40%] sm:ml-[47%] xs:ml-[43%] gap-[2px] items-center text-red-600'>
                            <ErrorIcon className='!text-[18px]'/>
                            <p className='text-[13px]'>{errors.gender}</p>
                          </div>
                        )}
                    </div>
                    <div>
                        <div className='h-[65px]'>
                          <div className='flex justify-between items-center gap-[1vw]'>
                              <label htmlFor="institutionOrSchool" className='text-[#555] text-text3 font-medium'>  Institution/<br />School</label>
                              <input
                                  type="text"
                                  id='institutionOrSchool'
                                  name='institutionOrSchool'
                                  value={formData.institutionOrSchool}
                                  onChange={handleSchoolChange}
                                  onBlur={() => {
                                    if (!formData.institutionOrSchool) {
                                      setErrors(prev => ({ ...prev, institutionOrSchool: "This field is required" }));
                                    }}}
                                  required
                                  className="md:w-[18vw] sm:w-[32vw] xs:w-[40vw] h-[40px] !bg-white rounded-md px-[3%] border-[1px] border-[#dadada] focus:border-blue-500 focus:border-[2px] focus:ring-[1px] focus:ring-blue-200 focus:ring-opacity-50 outline-none"/>
                          </div>
                          {errors.institutionOrSchool && <div className='flex md:ml-[40%] sm:ml-[47%] xs:ml-[43%] mt-[-4px] gap-[2px] items-center text-red-600'>
                                  <ErrorIcon className='!text-[18px]'/>
                                  <p className='text-[13px]'>{errors.institutionOrSchool}</p>
                          </div>}
                        </div>
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
                    <button type='submit' disabled={!isFormValid()} className='bg-[#2e294e] md:w-[18vw] sm:w-[50vw] xs:w-[70vw] py-[2.5%] md:ml-[20%] sm:ml-[8%] xs:ml-0 font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#5e578a] transition-all duration-300'>Finish</button>
                </div>
            </form>
          </>
        ) : (
        <>
        <h1 className='lg:text-[30px] md:text-text1 sm:text-[30px] xs:text-text2 text-[#2e294e] font-semibold lg:mt-[7%] md:mt-[9%] sm:mt-[5%] sm:mb-[5%] xs:mt-[7%] xs:mb-[5%] md:mb-[3%]'>Sign Up as a Student!</h1>
        <SignUpForm onSignUpClicked={setSignUpClicked} role='student'/>
        </>
        )
        }
    </>
  )
}

export default StudentSignUpPage

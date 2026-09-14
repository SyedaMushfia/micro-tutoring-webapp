import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useAppContext } from '../../context/AppContext';
import { optimizeImageFile } from '../../utils';

const subjectOptions = [
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Science', label: 'Science' },
  { value: 'ICT', label: 'ICT' },
  { value: 'English Language', label: 'English Language' },
  { value: 'English Literature', label: 'English Literature' },
  { value: 'ENV', label: 'ENV' },
  { value: 'Sinhala', label: 'Sinhala' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Business Studies', label: 'Business Studies' },
  { value: 'Economics', label: 'Economics' },
  { value: 'Accounting', label: 'Accounting' },
  { value: 'Commerce', label: 'Commerce' },
  { value: 'History', label: 'History' },
  { value: 'Geography', label: 'Geography' },
  { value: 'Social Studies', label: 'Social Studies' },
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

function TutorSettings() {
  const { backendUrl, userData, setUserData } = useAppContext();

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    qualification: '',
    experience: '',
    bio: '',
    subjects: [] as string[],
  });

  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!userData) return;

    const tutor = userData.tutor || {};
    setProfileForm({
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      qualification: tutor.qualification || '',
      experience: tutor.experience || '',
      bio: tutor.bio || '',
      subjects: Array.isArray(tutor.subjects) ? tutor.subjects : [],
    });

    if (tutor.profilePicture) {
      setPreviewImage(tutor.profilePicture);
    }
  }, [userData]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubjectChange = (selectedOptions: any) => {
    const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setProfileForm(prev => ({ ...prev, subjects: values }));
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedImage = await optimizeImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
      setProfileImage(optimizedImage);
      setPreviewImage(URL.createObjectURL(optimizedImage));
    } catch (error) {
      console.error('Profile image optimization failed', error);
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    const formData = new FormData();
    formData.append('firstName', profileForm.firstName);
    formData.append('lastName', profileForm.lastName);
    formData.append('qualification', profileForm.qualification);
    formData.append('experience', profileForm.experience);
    formData.append('bio', profileForm.bio);

    profileForm.subjects.forEach((subject) => {
      formData.append('subjects[]', subject);
    });

    if (profileImage) {
      formData.append('profilePicture', profileImage);
    }

    try {
      const response = await axios.put(`${backendUrl}/api/user/profile`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!response.data.success) {
        setProfileError(response.data.message || 'Profile update failed');
        return;
      }

      setUserData(response.data.user);
      setProfileSuccess('Profile updated successfully');
      setProfileImage(null);
    } catch (error: any) {
      setProfileError(error.response?.data?.message || 'Something went wrong while updating your profile');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const response = await axios.put(`${backendUrl}/api/user/password`, passwordForm, {
        withCredentials: true,
      });

      if (!response.data.success) {
        setPasswordError(response.data.message || 'Password update failed');
        return;
      }

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSuccess('Password updated successfully');
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Something went wrong while changing your password');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('This will permanently delete your account. Continue?');
    if (!confirmed) return;

    try {
      const response = await axios.delete(`${backendUrl}/api/user/account`, { withCredentials: true });
      if (!response.data.success) {
        setProfileError(response.data.message || 'Unable to delete account');
        return;
      }

      window.location.href = '/';
    } catch (error: any) {
      setProfileError(error.response?.data?.message || 'Something went wrong while deleting your account');
    }
  };

  return (
    <div className='w-full pt-4 text-[#2e294e]'>
      <div className='grid gap-6 lg:grid-cols-2'>
        <form onSubmit={handleProfileSubmit} className='rounded-2xl bg-[#f5f7ff] p-5 shadow-sm ring-1 ring-[#e5e7eb] md:p-6'>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold'>Profile info</h2>
          </div>

          <div className='mb-5 flex items-center gap-5'>
            <div className='h-20 w-20 overflow-hidden rounded-full border border-[#d8dced] bg-white'>
              {previewImage ? (
                <img src={previewImage} alt='Tutor profile' className='h-full w-full object-cover' />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-[#eaeef9] text-[#2e294e]'>
                  <AddAPhotoIcon />
                </div>
              )}
            </div>
            <label htmlFor='profile-image-upload' className='cursor-pointer rounded-full bg-[#2e294e] px-4 py-2 text-sm font-medium text-white hover:bg-[#5e578a]'>
              Change photo
            </label>
            <input id='profile-image-upload' type='file' accept='image/*' className='hidden' onChange={handleProfileImageChange} />
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='firstName' className='mb-1 block text-sm font-medium'>First name</label>
              <input id='firstName' value={profileForm.firstName} onChange={handleProfileChange} className='w-full rounded-lg border border-[#d9dded] bg-white px-3 py-2 outline-none focus:border-[#2e294e]' />
            </div>

            <div>
              <label htmlFor='lastName' className='mb-1 block text-sm font-medium'>Last name</label>
              <input id='lastName' value={profileForm.lastName} onChange={handleProfileChange} className='w-full rounded-lg border border-[#d9dded] bg-white px-3 py-2 outline-none focus:border-[#2e294e]' />
            </div>
          </div>

          <div className='mt-4'>
            <label className='mb-1 block text-sm font-medium'>Qualification</label>
            <select value={profileForm.qualification} onChange={(e) => setProfileForm(prev => ({ ...prev, qualification: e.target.value }))} className='w-full rounded-lg border border-[#d9dded] bg-white px-3 py-2 outline-none focus:border-[#2e294e]'>
              <option value=''>Select qualification</option>
              <option value='Diploma'>Diploma</option>
              <option value="Bachelor’s Degree">Bachelor’s Degree</option>
              <option value='Postgraduate Diploma'>Postgraduate Diploma</option>
              <option value="Master’s Degree">Master’s Degree</option>
              <option value='Doctorate (PhD)'>Doctorate (PhD)</option>
              <option value='Teaching Certificate'>Teaching Certificate</option>
            </select>
          </div>

          <div className='mt-4'>
            <label className='mb-1 block text-sm font-medium'>Experience</label>
            <select value={profileForm.experience} onChange={(e) => setProfileForm(prev => ({ ...prev, experience: e.target.value }))} className='w-full rounded-lg border border-[#d9dded] bg-white px-3 py-2 outline-none focus:border-[#2e294e]'>
              <option value=''>Select experience</option>
              <option value='Less than 1 year'>Less than 1 year</option>
              <option value='1-3 years'>1-3 years</option>
              <option value='3-5 years'>3-5 years</option>
              <option value='5-10 years'>5-10 years</option>
              <option value='10+ years'>10+ years</option>
            </select>
          </div>

          <div className='mt-4'>
            <label className='mb-1 block text-sm font-medium'>Subjects</label>
            <Select
              isMulti
              options={subjectOptions}
              value={profileForm.subjects.map(subject => ({ value: subject, label: subject }))}
              onChange={handleSubjectChange}
              styles={customStyles}
              className='basic-multi-select'
              classNamePrefix='select'
            />
          </div>

          <div className='mt-4'>
            <label htmlFor='bio' className='mb-1 block text-sm font-medium'>Bio</label>
            <textarea id='bio' rows={5} value={profileForm.bio} onChange={handleProfileChange} className='w-full resize-none rounded-lg border border-[#d9dded] bg-white px-3 py-2 outline-none focus:border-[#2e294e]' />
          </div>

          {profileError && (
            <div className='mt-4 flex items-center gap-2 text-sm text-red-600'>
              <ErrorIcon className='!text-[18px]' />
              <span>{profileError}</span>
            </div>
          )}

          {profileSuccess && (
            <div className='mt-4 flex items-center gap-2 text-sm text-green-600'>
              <CheckCircleIcon className='!text-[18px]' />
              <span>{profileSuccess}</span>
            </div>
          )}

          <button type='submit' className='mt-6 w-full rounded-full bg-[#2e294e] px-4 py-3 font-medium text-white hover:bg-[#5e578a]'>
            Save profile
          </button>
        </form>

        <div className='space-y-6'>
          <form onSubmit={handlePasswordSubmit} className='rounded-2xl bg-[#f5f7ff] p-5 shadow-sm ring-1 ring-[#e5e7eb] md:p-6'>
            <div className='mb-6'>
              <h2 className='text-xl font-semibold'>Change password</h2>
            </div>

            <div className='space-y-4'>
              <div>
                <label htmlFor='currentPassword' className='mb-1 block text-sm font-medium'>Current password</label>
                <input id='currentPassword' type='password' value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} className='w-full rounded-lg border border-[#d9dded] bg-white px-3 py-2 outline-none focus:border-[#2e294e]' />
              </div>

              <div>
                <label htmlFor='newPassword' className='mb-1 block text-sm font-medium'>New password</label>
                <input id='newPassword' type='password' value={passwordForm.newPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} className='w-full rounded-lg border border-[#d9dded] bg-white px-3 py-2 outline-none focus:border-[#2e294e]' />
              </div>

              <div>
                <label htmlFor='confirmPassword' className='mb-1 block text-sm font-medium'>Confirm password</label>
                <input id='confirmPassword' type='password' value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} className='w-full rounded-lg border border-[#d9dded] bg-white px-3 py-2 outline-none focus:border-[#2e294e]' />
              </div>
            </div>

            {passwordError && (
              <div className='mt-4 flex items-center gap-2 text-sm text-red-600'>
                <ErrorIcon className='!text-[18px]' />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className='mt-4 flex items-center gap-2 text-sm text-green-600'>
                <CheckCircleIcon className='!text-[18px]' />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <button type='submit' className='mt-6 w-full rounded-full bg-[#2e294e] px-4 py-3 font-medium text-white hover:bg-[#5e578a]'>
              Update password
            </button>
          </form>

          <div className='rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm md:p-6'>
            <h2 className='text-xl font-semibold text-red-700'>Delete account</h2>
            <p className='mt-2 text-sm text-red-700'>This action is permanent and removes your account and profile data from the app and database.</p>
            <button type='button' onClick={handleDeleteAccount} className='mt-6 w-full rounded-full bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700'>
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorSettings;

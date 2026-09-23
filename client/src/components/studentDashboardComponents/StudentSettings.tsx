import { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { mergeUserProfile, useAppContext } from '../../context/AppContext';
import { optimizeImageFile } from '../../utils';

const gradeOptions = [
  { value: 'Grade 5', label: 'Grade 5' },
  { value: 'Grade 6', label: 'Grade 6' },
  { value: 'Grade 7', label: 'Grade 7' },
  { value: 'Grade 8', label: 'Grade 8' },
  { value: 'Grade 9', label: 'Grade 9' },
  { value: 'Grade 10', label: 'Grade 10' },
  { value: 'Grade 11', label: 'Grade 11' },
  { value: 'Grade 12', label: 'Grade 12' },
  { value: 'Grade 13', label: 'Grade 13' },
];

const curriculumOptions = [
  { value: 'G.C.E. Ordinary Level (O/L)', label: 'G.C.E. Ordinary Level (O/L)' },
  { value: 'G.C.E. Advanced Level (A/L)', label: 'G.C.E. Advanced Level (A/L)' },
  { value: 'Cambridge IGCSE', label: 'Cambridge IGCSE' },
  { value: 'Pearson Edexcel IGCSE', label: 'Pearson Edexcel IGCSE' },
  { value: 'Cambridge International AS & A Level', label: 'Cambridge International AS & A Level' },
  { value: 'Pearson Edexcel International AS & A Level', label: 'Pearson Edexcel International AS & A Level' },
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
];

function StudentSettings() {
  const { backendUrl, userData, setUserData } = useAppContext();

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    curriculum: '',
    gender: '',
    institutionOrSchool: '',
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

    const student = userData.student || {};
    setProfileForm({
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      grade: student.grade || '',
      curriculum: student.curriculum || '',
      gender: student.gender || '',
      institutionOrSchool: student.institutionOrSchool || '',
    });

    if (student.profilePicture) {
      setPreviewImage(student.profilePicture);
    }
  }, [userData]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileForm(prev => ({ ...prev, [id]: value }));
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedImage = await optimizeImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
      const previewUrl = URL.createObjectURL(optimizedImage);
      setProfileImage(optimizedImage);
      setPreviewImage(previewUrl);
      setUserData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          student: {
            ...(prev.student || {}),
            profilePicture: previewUrl,
          },
        };
      });
    } catch (error) {
      console.error('Profile image optimization failed', error);
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(file);
      setPreviewImage(previewUrl);
      setUserData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          student: {
            ...(prev.student || {}),
            profilePicture: previewUrl,
          },
        };
      });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    const formData = new FormData();
    formData.append('firstName', profileForm.firstName);
    formData.append('lastName', profileForm.lastName);
    formData.append('grade', profileForm.grade);
    formData.append('curriculum', profileForm.curriculum);
    formData.append('gender', profileForm.gender);
    formData.append('institutionOrSchool', profileForm.institutionOrSchool);

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

      setUserData((prev: any) => mergeUserProfile(prev, response.data.user));
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
                <img src={previewImage} alt='Student profile' className='h-full w-full object-cover' />
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
            <label className='mb-1 block text-sm font-medium'>Grade</label>
            <Select
              value={gradeOptions.find(option => option.value === profileForm.grade) ? { value: profileForm.grade, label: profileForm.grade } : null}
              options={gradeOptions}
              onChange={(selected) => setProfileForm(prev => ({ ...prev, grade: selected ? selected.value : '' }))}
              classNamePrefix='select'
              placeholder='Select grade'
            />
          </div>

          <div className='mt-4'>
            <label className='mb-1 block text-sm font-medium'>Curriculum</label>
            <Select
              value={curriculumOptions.find(option => option.value === profileForm.curriculum) ? { value: profileForm.curriculum, label: profileForm.curriculum } : null}
              options={curriculumOptions}
              onChange={(selected) => setProfileForm(prev => ({ ...prev, curriculum: selected ? selected.value : '' }))}
              classNamePrefix='select'
              placeholder='Select curriculum'
            />
          </div>

          <div className='mt-4'>
            <label className='mb-1 block text-sm font-medium'>Gender</label>
            <Select
              value={genderOptions.find(option => option.value === profileForm.gender) ? { value: profileForm.gender, label: profileForm.gender } : null}
              options={genderOptions}
              onChange={(selected) => setProfileForm(prev => ({ ...prev, gender: selected ? selected.value : '' }))}
              classNamePrefix='select'
              placeholder='Select gender'
            />
          </div>

          <div className='mt-4'>
            <label htmlFor='institutionOrSchool' className='mb-1 block text-sm font-medium'>Institution / School</label>
            <input id='institutionOrSchool' value={profileForm.institutionOrSchool} onChange={handleProfileChange} className='w-full rounded-lg border border-[#d9dded] bg-white px-3 py-2 outline-none focus:border-[#2e294e]' />
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

export default StudentSettings;

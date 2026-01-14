import React from 'react'
import type { InputField } from '../types';
import { useState } from 'react';
import validator from 'validator';
import ErrorIcon from '@mui/icons-material/Error';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

interface SignUpFormProps {
  onSignUpClicked: React.Dispatch<React.SetStateAction<boolean>>;
  role: "tutor" | "student";
}

function SignUpForm({onSignUpClicked, role}: SignUpFormProps) {
    const { backendUrl, setIsLoggedIn } = useAppContext()
      const [signupError, setSignupError] = useState('');

    const inputFields: InputField[] = [
        {
            nameOfInput: 'First Name',
            id: 'firstName',
            type: 'text',
            minLength: 2,
            ariaLabel: 'First Name',
        },
        {
            nameOfInput: 'Last Name',
            id: 'lastName',
            type: 'text',
            minLength: 2,
            ariaLabel: 'Last Name',
        },
        {
            nameOfInput: 'Email',
            id: 'email',
            type: 'email',
            ariaLabel: 'Email',
        },
        {
            nameOfInput: "Password",
            id: "password",
            type: "password",
            minLength: 8, 
            ariaLabel: "Password",
        },
        {
            nameOfInput: "Confirm Password",
            id: "confirmPassword",
            type: "password",
            minLength: 8,
            ariaLabel: "Confirm Password",
        },
      ]; 
  
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    
      const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
    
        setFormData(prev => (
            {...prev, [id]:  value}
        ))
    
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: ''
        }));

        if (id === 'email') {
            setSignupError('');
        }

      }
    
      const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        let errorMessage = '';

        if (!value.trim()) {
            errorMessage = 'This field is required';
        } else {
            switch (id) {
            case 'firstName':
                if (value.trim().length < 2)
                errorMessage = 'First name should be at least 2 characters';
                break;

            case 'lastName':
                if (value.trim().length < 2)
                errorMessage = 'Last name should be at least 2 characters';
                break;

            case 'email':
                if (!validator.isEmail(value))
                errorMessage = 'Enter a valid email address';
                break;

            case 'password':
                if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1}))
                errorMessage = 'Password must have 8 chars, uppercase, lowercase, & number.';
                break;

            case 'confirmPassword':
                if (value !== formData.password)
                errorMessage = 'Passwords do not match';
                break;
            }
        }

        setErrors(prev => ({
            ...prev,
            [id]: errorMessage
        }));
    };

    
    const isFormValid = (): boolean => {
    let valid = true;
    const newErrors = { ...errors };

    inputFields.forEach(field => {
        const value = formData[field.id as keyof typeof formData];

        if (!value.trim()) {
            newErrors[field.id as keyof typeof errors] = 'This field is required';
            valid = false;
            return;
        }


        switch (field.id) {
            case 'firstName':
                if (!value || value.trim().length < 2) {
                    newErrors.firstName = 'First name should be at least 2 characters';
                    valid = false;
                } else {
                    newErrors.firstName = '';
                }
                break;
            case 'lastName':
                if (!value || value.trim().length < 2) {
                    newErrors.lastName = 'Last name should be at least 2 characters';
                    valid = false;
                } else {
                    newErrors.lastName = '';
                }
                break;
            case 'email':
                if (!validator.isEmail(value)) {
                    newErrors.email = 'Enter a valid email address';
                    valid = false;
                } else {
                    newErrors.email = '';
                }
                break;
            case 'password':
                if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
                    newErrors.password = 'Password must have 8 chars, uppercase, lowercase, & number.';
                    valid = false;
                } else {
                    newErrors.password = '';
                }
                break;
            case 'confirmPassword':
                if (!value || value !== formData.password) {
                    newErrors.confirmPassword = 'Passwords do not match';
                    valid = false;
                } else {
                    newErrors.confirmPassword = '';
                }
                break;
        }
    });

    setErrors(newErrors);
    return valid;
};

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isFormValid()) return;

      try {
        const response = await axios.post(`${backendUrl}/api/auth/register`, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role
        }, { withCredentials: true });

        if (!response.data.success) {
          setSignupError(response.data.message || "Email already exists");
          setIsLoggedIn(false);
          onSignUpClicked(false);
          return;
        }
        
        if (response.data.success) {
          setIsLoggedIn(true);
          onSignUpClicked(true);
        } else {
          alert(response.data.message || "Signup failed");
        }
      } catch (error: any) {
        alert(error.response?.data?.message || "Server error");
      }
    }

  return (
    <form onSubmit={handleSubmit}>
            <div className='h-[390px] md:mb-[80px] sm:mb-[75px] xs:mb-[60px] lg:w-[25vw] md:w-[30vw]'>
                {inputFields.map(field => (
                    <div key={field.id} className='h-[85px] mb-[5px]'>
                    <div key={field.nameOfInput} className='flex flex-col'>
                        <label htmlFor={field.id} className='text-[#555] font-medium'>{field.nameOfInput}<span className='text-red-600'>*</span></label>
                        <input 
                            type={field.type}
                            id={field.id}
                            name={field.id}
                            // required
                            minLength={field.minLength}
                            // aria-required='true'
                            aria-label={field.ariaLabel}
                            className={`h-[40px] !bg-white rounded-md px-[3%] border-[1px] ${errors[field.id as keyof typeof errors] ? 'border-red-600' : 'border-[#a7a7a7]'}`}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            value={formData[field.id as keyof typeof formData]}
                        />
                    </div>
                    {field.id === 'email' && signupError && (
                    <div className='flex gap-[2px] items-center text-red-600'>
                        <ErrorIcon className='!text-[18px]' />
                        <p className='text-[13px]'>{signupError}</p>
                    </div>
                    )}
                    {errors[field.id as keyof typeof errors] && <div className='flex gap-[2px] items-center text-red-600'>
                        <ErrorIcon className='!text-[18px]'/>
                        <p className='text-[13px]'>{errors[field.id as keyof typeof errors]}</p>
                    </div>}
                    </div>
                ))}
            </div>
            <button
                className="bg-[#2e294e] md:w-[18vw] sm:w-[50vw] xs:w-[70vw] py-[10px] lg:ml-[3.5vw] md:ml-[6vw] font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#5e578a] transition-all duration-300">
              Sign Up
            </button>
        </form>
  )
}

export default SignUpForm

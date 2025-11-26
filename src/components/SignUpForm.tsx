import React from 'react'
import type { InputField } from '../types';
import { useState } from 'react';
import { validateEmail } from '../utils';
import ErrorIcon from '@mui/icons-material/Error';

interface SignUpFormProps {
  onSignUpClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

function SignUpForm({onSignUpClicked}: SignUpFormProps) {
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
      }
    
      const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
    
        let errorMessage = '';
    
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
            if (!validateEmail(value))
                errorMessage = 'Enter a valid email address';
            break;
    
            case 'password':
            if (value.trim().length < 8)
                errorMessage = 'Password must have more than 8 characters';
            break;
    
            case 'confirmPassword':
            if (value !== formData.password)
                errorMessage = 'Passwords do not match';
            break;
        }
            
        setErrors(prev => ({
            ...prev,
            [id]: errorMessage,
        }));
      }
    
    const isFormValid = () => {
        const allFieldsValid = inputFields.every(field => formData[field.id as keyof typeof formData] && !errors[field.id as keyof typeof errors]);
        return allFieldsValid;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log('Account created!');
      onSignUpClicked(true);
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
                            required
                            minLength={field.minLength}
                            aria-required='true'
                            aria-label={field.ariaLabel}
                            className={`h-[40px] !bg-white rounded-md px-[3%] border-[1px] ${errors[field.id as keyof typeof errors] ? 'border-red-600' : 'border-[#a7a7a7]'}`}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            value={formData[field.id as keyof typeof formData]}
                        />
                    </div>
                    {errors[field.id as keyof typeof errors] && <div className='flex gap-[2px] items-center text-red-600'>
                        <ErrorIcon className='!text-[18px]'/>
                        <p className='text-[13px]'>{errors[field.id as keyof typeof errors]}</p>
                    </div>}
                    </div>
                ))}
            </div>
            <button
                disabled={!isFormValid()}
                className={`${
                    !isFormValid() ? 'cursor-not-allowed' : 'cursor-pointer'
                } bg-[#2e294e] md:w-[18vw] sm:w-[50vw] xs:w-[70vw] py-[10px] lg:ml-[3.5vw] md:ml-[6vw] font-semibold text-white rounded-full shadow-md hover:shadow-lg hover:bg-[#5e578a] transition-all duration-300`}
            >
              Sign Up
            </button>
        </form>
  )
}

export default SignUpForm

import React from 'react'
import BalanceTopUpForm from './BalanceTopUpForm'
import RechargeHistory from './RechargeHistory'
import { useAppContext } from '../../context/AppContext';
import useViewportWidth from '../../hooks/useViewportWidth';

function StudentWallet() {
  const { userData } = useAppContext();
  const width = useViewportWidth();
  const isTab = width <= 769;

  const questionPrice = 250;

  const noOfQuestionsAllowed = Math.floor((userData?.student?.balance ?? 0) / questionPrice);

  return (
    <div>
        {isTab ? (
            <div>
                <div className=' flex flex-col justify-center bg-[#f2f4fc] shadow-lg w-full h-[200px] sm:px-[8%] xs:px-[10%] py-8 mt-4 rounded-2xl'>
                  <div className=' flex items-start justify-between'>
                    <div>
                        <h1 className='text-[#555] text-text4 tracking-wide'>Available Balance</h1>
                        <h2 className='lg:text-[70px] md:text-[45px] sm:text-[50px] xs:text-[40px] font-semibold text-[#2e294e] tracking-wide'><span className="align-super text-2xl">Rs.</span>{userData?.student?.balance ?? 0}</h2>
                    </div>
                  <div className='md:w-[10vw] sm:w-[20vw] xs:w-[15vw]'>
                    <img src="/credit-card.png" alt="credit card icon" />
                  </div>
                  </div>
                    <h3 className='w-full px-16 py-2 mt-4 text-[#2e294e] text-center bg-[#c5d86d] rounded-full'>{`You can ask up to ${noOfQuestionsAllowed} questions with your current balance.`}</h3>
              </div>
              <BalanceTopUpForm />
              <RechargeHistory />
            </div>) : (
            <div className='flex justify-between'>
            <div>
              <div className=' flex flex-col justify-center bg-[#f2f4fc] shadow-lg w-[42vw] h-[250px] sm:px-[8%] xs:px-[10%] py-8 mt-4 rounded-2xl'>
                  <div className=' flex items-start justify-between'>
                    <div>
                        <h1 className='text-[#555] text-text4 tracking-wide'>Available Balance</h1>
                        <h2 className='lg:text-[70px] md:text-[45px] sm:text-[30px] xs:text-[40px] font-semibold text-[#2e294e] tracking-wide'><span className="align-super text-2xl">Rs.</span>{userData?.student?.balance ?? 0}</h2>
                    </div>
                  <div className='w-[10vw]'>
                    <img src="/credit-card.png" alt="credit card icon" />
                  </div>
                  </div>
                    <h3 className='w-full px-16 py-2 mt-4 text-[#2e294e] text-center bg-[#c5d86d] rounded-full'>{`You can ask up to ${noOfQuestionsAllowed} questions with your current balance.`}</h3>
              </div>
              <RechargeHistory />
            </div>
            <BalanceTopUpForm />
            </div>
        )}
    </div>
  )
}

export default StudentWallet

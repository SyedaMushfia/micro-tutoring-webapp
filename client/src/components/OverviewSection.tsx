import React from 'react'
import PaidIcon from '@mui/icons-material/Paid';
import StarIcon from '@mui/icons-material/Star';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import InfoIcon from '@mui/icons-material/Info';
import type { Role } from '../types';
import QuizIcon from '@mui/icons-material/Quiz';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

interface OverviewSectionProps {
  role: Role;
  earnings?: number;
  spendings?: number;
  questionsCount: number;
}

function OverviewSection({ role, earnings, spendings, questionsCount }: OverviewSectionProps) {
  const tutorCards = [
    {
      name: 'Earnings',
      value: `Rs.${earnings ?? 0}`,
      icon: PaidIcon
    },
    {
      name: 'Ratings',
      value: '4.5',
      icon: StarIcon
    },
    {
      name: 'Answered Questions',
      value: `${questionsCount ?? 0}`,
      icon: QuestionAnswerIcon
    }
  ]

  const studentCards = [
    {
      name: 'Questions Asked',
      value: `${questionsCount ?? 0}`,
      icon: QuizIcon
    },
    {
      name: 'Study Hours',
      value: '20 mins',
      icon: AccessTimeFilledIcon
    },
    {
      name: 'Total Paid',
      value: `Rs.${spendings ?? 0}`,
      icon: PaidIcon
    }
  ]

  // Decide which cards to render based on the role
  const cards = role === "tutor" ? tutorCards : studentCards;

  return (
    <div className='sm:flex sm:flex-row sm:justify-between xs:flex xs:flex-col xs:items-center xs:gap-4 sm:my-[1.5%] xs:my-[4%]'>
      {cards.map(card => (
          <div key={card.name} className='bg-[#f2f4fc] shadow-lg sm:w-[32%] xs:w-[75%] h-[150px] sm:px-[3%] xs:px-[10%] rounded-2xl flex items-center justify-between'>
            <div className='flex flex-col '>
              <h1 className='lg:text-[45px] md:text-[35px] sm:text-[30px] xs:text-[40px] font-semibold text-[#2e294e] tracking-wide'>{card.value}</h1>
              <div className='flex items-center sm:gap-[3%] xs:gap-[1%] lg:w-[12vw] md:w-[15vw] sm:w-[22vw] xs:w-[40vw]'>
                <h3 className='text-[#555] lg:text-[16px] md:text-[14px] sm:text-[14px] xs:text-[16px]'>{card.name}</h3>
                <InfoIcon className='text-[#aaaaaa] sm:!text-[20px] xs:!text-[15px]'/>
              </div>
            </div>
            <div className=''>
              <card.icon className='lg:!text-[80px] md:!text-[60px] sm:!text-[50px] xs:!text-[80px] text-[#c5d86d] md:ml-0 sm:ml-[-20px]'/>
            </div>
          </div>
      ))}
    </div>
  )
}

export default OverviewSection

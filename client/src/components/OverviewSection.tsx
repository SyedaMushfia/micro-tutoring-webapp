import { useEffect, useState } from 'react'
import PaidIcon from '@mui/icons-material/Paid';
import StarIcon from '@mui/icons-material/Star';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import InfoIcon from '@mui/icons-material/Info';
import type { Role } from '../types';
import QuizIcon from '@mui/icons-material/Quiz';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { socket } from '../utils';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

interface OverviewSectionProps {
  role: Role;
  earnings?: number;
  spendings?: number;
  questionsCount: number;
}

function OverviewSection({ role, earnings, spendings, questionsCount }: OverviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [studyMinutes, setStudyMinutes] = useState(0);
  const { backendUrl, userData } = useAppContext();

  useEffect(() => {
    if (role !== "student" || !userData?._id) return;

    const fetchStudyTime = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/session/student/${userData._id}/history`, { withCredentials: true });
        const completedSessions = response.data.filter((session: { status: string }) => session.status === "Completed").length;
        setStudyMinutes(completedSessions * 20);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudyTime();

    const handleSessionEnded = () => {
      setStudyMinutes((current) => current + 20);
    };
    socket.on("session-ended", handleSessionEnded);

    return () => {
      socket.off("session-ended", handleSessionEnded);
    };
  }, [backendUrl, role, userData?._id]);

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes} mins`;
    if (remainingMinutes === 0) return `${hours} hr${hours === 1 ? "" : "s"}`;
    return `${hours} hr${hours === 1 ? "" : "s"} ${remainingMinutes} mins`;
  };

  useEffect(() => {
    if (role !== "tutor") return;

    const fetchRating = async () => {
      try {
        const profile = await axios.get("http://localhost:4000/api/auth/profile", { withCredentials: true });
        const tutorId = profile.data.user?._id;
        if (!tutorId) return;

        const response = await axios.get(`http://localhost:4000/api/reviews/tutor/${tutorId}`, { withCredentials: true });
        if (response.data.success) setRating(response.data.average);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRating();
    const handleRatingSubmitted = (data: { tutorId: string; average: number }) => {
      setRating((current) => data.average ?? current);
    };
    socket.on("rating-submitted", handleRatingSubmitted);
    return () => {
      socket.off("rating-submitted", handleRatingSubmitted);
    };
  }, [role]);

  const tutorCards = [
    {
      name: 'Earnings',
      value: `Rs.${earnings ?? 0}`,
      icon: PaidIcon
    },
    {
      name: 'Ratings',
      value: rating ? rating.toFixed(1) : '0.0',
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
      value: formatStudyTime(studyMinutes),
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

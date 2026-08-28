import { useEffect, useState } from 'react'
import EarningsHistory from './EarningsHistory'
import EarningsChart from './EarningsChart'
import useViewportWidth from '../../hooks/useViewportWidth';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAppContext } from '../../context/AppContext';
import { socket } from '../../utils';
import axios from 'axios';

interface Earning {
  amount: number;
  createdAt: string;
}

function TutorEarnings() {
  const { backendUrl, userData } = useAppContext();
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const width = useViewportWidth();
  const isTab = width <= 769;

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/earnings/history`, { withCredentials: true });
        if (res.data.success) setEarnings(res.data.history);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEarnings();

    const handleSessionEnded = ({ tutorAmountCredited }: { tutorAmountCredited: number }) => {
      setEarnings((previous) => [
        { amount: tutorAmountCredited, createdAt: new Date().toISOString() },
        ...previous,
      ]);
    };

    socket.on("session-ended", handleSessionEnded);
    return () => {
      socket.off("session-ended", handleSessionEnded);
    };
  }, [backendUrl]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const currentMonthTotal = earnings
    .filter((earning) => {
      const date = new Date(earning.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((total, earning) => total + earning.amount, 0);
  const previousMonthTotal = earnings
    .filter((earning) => {
      const date = new Date(earning.createdAt);
      return date.getMonth() === previousMonthDate.getMonth() && date.getFullYear() === previousMonthDate.getFullYear();
    })
    .reduce((total, earning) => total + earning.amount, 0);
  const monthlyChange = previousMonthTotal === 0
    ? (currentMonthTotal > 0 ? 100 : 0)
    : Math.round(((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100);
  const isTrendingUp = monthlyChange >= 0;
  const TrendIcon = isTrendingUp ? TrendingUpIcon : TrendingDownIcon;
  const trendText = `${monthlyChange >= 0 ? '+' : ''}${monthlyChange}% from last month`;

  return (
    <div>
        {isTab ? (
            <div>
                <div className=' flex flex-col justify-center bg-[#f2f4fc] shadow-lg w-full h-[200px] sm:px-[8%] xs:px-[10%] py-8 mt-4 rounded-2xl'>
                  <div className=' flex items-start justify-between'>
                    <div>
                        <h1 className='text-[#555] text-text4 tracking-wide'>Total Earnings</h1>
                        <h2 className='lg:text-[70px] md:text-[45px] sm:text-[50px] xs:text-[40px] font-semibold text-[#2e294e] tracking-wide'><span className="align-super text-2xl">Rs.</span>{userData?.tutor?.earnings}</h2>
                    </div>
                  <div className='md:w-[10vw] sm:w-[20vw] xs:w-[15vw]'>
                    <img src="/credit-card.png" alt="credit card icon" />
                  </div>
                  </div>
                      <h3 className={`w-full px-16 py-2 mt-4 text-[#2e294e] text-center rounded-full ${isTrendingUp ? 'bg-[#c5d86d]' : 'bg-red-200'}`}><TrendIcon />{trendText}</h3>
              </div>
              <EarningsHistory />
                    <EarningsChart earnings={earnings} />
            </div>) : (
            <div className='flex justify-between'>
            <div>
              <div className=' flex flex-col justify-center bg-[#f2f4fc] shadow-lg w-[42vw] h-[250px] sm:px-[8%] xs:px-[10%] py-8 mt-4 rounded-2xl'>
                  <div className=' flex items-start justify-between'>
                    <div>
                        <h1 className='text-[#555] text-text4 tracking-wide'>Total Earnings</h1>
                        <h2 className='lg:text-[70px] md:text-[45px] sm:text-[30px] xs:text-[40px] font-semibold text-[#2e294e] tracking-wide'><span className="align-super text-2xl">Rs.</span>{userData?.tutor.earnings}</h2>
                    </div>
                  <div className='w-[10vw]'>
                    <img src="/credit-card.png" alt="credit card icon" />
                  </div>
                  </div>
                      <h3 className={`w-full px-16 py-2 mt-4 text-[#2e294e] text-center rounded-full ${isTrendingUp ? 'bg-[#c5d86d]' : 'bg-red-200'}`}><TrendIcon />{trendText}</h3>
              </div>
                    <EarningsChart earnings={earnings} />
            </div>
            <EarningsHistory />
            </div>
        )}
    </div>
  )
}

export default TutorEarnings

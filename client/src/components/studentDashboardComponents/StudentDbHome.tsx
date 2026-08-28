import React, { useEffect, useState } from 'react'
import AskQuestion from './AskQuestion'
import OverviewSection from '../OverviewSection'
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';

function StudentDbHome() {
  const { backendUrl, userData } = useAppContext();
  const [totalSpent, setTotalSpent] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);

  // Fetch total spending of student
  useEffect(() => {
    const fetchSpendings = async () => {
      try {
        
        // Call backend to get session history
        const res = await axios.get(`${backendUrl}/api/session/student/${userData?._id}/history`, { withCredentials: true });

        let total = 0

        // Add up amountPaid from each session
        res.data.forEach((session: any) => {
          total += session.amountPaid;
        }
        );

        setTotalSpent(total);
      } catch (err) {
        console.error(err);
      }
    };

    // Only fetch if userData is available
    if (userData?._id) fetchSpendings();
  }, [backendUrl, userData]);


  // Fetch total number of questions asked by student
  useEffect(() => {
    const fetchSessionCount = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/session/count/me`, { withCredentials: true });

        if (res.data.success) {
          setQuestionsCount(res.data.questionsCount);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSessionCount();
  }, []);


  return (
    <>
      <AskQuestion />
      <OverviewSection role='student' spendings={totalSpent} questionsCount={questionsCount}/>
    </>
  )
}

export default StudentDbHome;

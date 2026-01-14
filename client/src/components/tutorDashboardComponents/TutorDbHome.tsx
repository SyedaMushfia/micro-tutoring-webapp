import React, { useEffect, useState } from 'react'
import QuestionRequests from './QuestionRequests';
import OverviewSection from '../OverviewSection';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';

function TutorDbHome() {
  const { userData, backendUrl } = useAppContext();
  const [questionsCount, setQuestionsCount] = useState(0);

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
    <div>
      <OverviewSection role='tutor' earnings={userData?.tutor?.earnings} questionsCount={questionsCount}/>
      <QuestionRequests />
    </div>
  )
}

export default TutorDbHome;

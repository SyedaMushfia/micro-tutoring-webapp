import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';
import { useAppContext } from '../../context/AppContext';
import LazyImage from '../LazyImage';

interface ReviewItem {
  _id: string;
  studentName: string;
  profilePicture?: string;
  rating: number;
  reviewText?: string;
  date: string;
  time: string;
  createdAt: string;
}

function TutorReviews() {
  const { backendUrl, userData } = useAppContext();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userData?._id) return;

      try {
        const response = await axios.get(`${backendUrl}/api/reviews/tutor/${userData._id}`, { withCredentials: true });
        const data = response.data;
        setAverage(data.average || 0);
        setCount(data.count || 0);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Failed to fetch tutor reviews', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [backendUrl, userData?._id]);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl bg-[#f3f5fb] p-4 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-[#2e294e]">Tutor Reviews</h2>
          <p className="text-sm text-[#5d5b75]">Student feedback and ratings</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#2e294e] px-4 py-2 text-white">
          <StarIcon className="!text-lg" />
          <span className="font-semibold">{average.toFixed(1)} ({count})</span>
        </div>
      </div>

      {loading ? (
        <p className="text-[#2e294e]">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl bg-[#f3f5fb] p-8 text-center text-[#4a4666] shadow-sm">
          No reviews have been submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-[#e6e9f4] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f6f7fb]">
                    {review.profilePicture ? (
                      <LazyImage
                        src={review.profilePicture}
                        alt={review.studentName}
                        width={80}
                        height={80}
                        className='h-full w-full rounded-full'
                        placeholderClassName='bg-[#eef1f9]'
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#2e294e] text-sm font-semibold text-white">
                        {review.studentName?.split(' ')[0]?.[0]}{review.studentName?.split(' ')[1]?.[0]}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#2e294e]">{review.studentName}</h3>
                    <p className="text-xs text-[#5d5b75]">{review.date} • {review.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#f5b700]">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon key={index} className={index < review.rating ? '!text-lg' : '!text-lg text-[#dfe3ef]'} />
                  ))}
                </div>
              </div>

              {review.reviewText && (
                <p className="mt-4 rounded-xl bg-[#f6f7fb] p-3 text-sm leading-6 text-[#3d3a56]">{review.reviewText}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TutorReviews;

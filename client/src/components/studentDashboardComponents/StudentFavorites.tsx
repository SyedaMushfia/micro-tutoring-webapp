import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppContext } from '../../context/AppContext';
import LazyImage from '../LazyImage';

interface FavoriteTutor {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  subjects: string[];
}

function StudentFavorites() {
  const { backendUrl, userData } = useAppContext();
  const [favorites, setFavorites] = useState<FavoriteTutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userData?._id) return;

      try {
        const response = await axios.get(`${backendUrl}/api/user/favorites`, { withCredentials: true });
        setFavorites(response.data?.favorites || []);
      } catch (error) {
        console.error('Failed to fetch favorites', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [backendUrl, userData?._id]);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center gap-3">
        <FavoriteIcon className="!text-[28px] text-[#d13b63]" />
        <h2 className="text-2xl font-semibold text-[#2e294e]">Favorite Tutors</h2>
      </div>

      {loading ? (
        <p className="text-[#2e294e]">Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <div className="rounded-2xl bg-[#f3f5fb] p-8 text-center text-[#4a4666] shadow-sm">
          You have not added any favorite tutors yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((tutor) => (
            <div key={tutor._id} className="rounded-2xl border border-[#e6e9f4] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f6f7fb]">
                  {tutor.profilePicture ? (
                    <LazyImage
                      src={tutor.profilePicture}
                      alt={`${tutor.firstName} ${tutor.lastName}`}
                      width={120}
                      height={120}
                      className='h-full w-full rounded-full'
                      placeholderClassName='bg-[#eef1f9]'
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#2e294e] text-lg font-semibold text-white">
                      {tutor.firstName?.[0]}{tutor.lastName?.[0]}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-[#2e294e]">
                    {tutor.firstName} {tutor.lastName}
                  </h3>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {tutor.subjects?.length ? (
                  tutor.subjects.map((subject) => (
                    <span key={subject} className="rounded-full bg-[#ede9fe] px-2.5 py-1 text-xs font-medium text-[#473f6d]">
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[#5d5b75]">No subjects listed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentFavorites;

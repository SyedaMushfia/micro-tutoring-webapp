import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { socket } from "../utils";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userData: any;
  setUserData: (value: any) => void;
  isLoading: boolean;
  notifications: AppNotification[];
  addNotification: (title: string, message: string) => void;
  markNotificationsAsRead: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: ProviderProps) => {
    const backendUrl = 'http://localhost:4000';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const addNotification = (title: string, message: string) => {
      const newNotification: AppNotification = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        message,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, 8));
    };

    const markNotificationsAsRead = () => {
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    };

    useEffect(() => {
      const handleStatusUpdated = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        setUserData((prev: any) => {
          if (!prev || prev._id !== userId) return prev;
          return { ...prev, isOnline };
        });
      };

      socket.on('tutor-status-updated', handleStatusUpdated);
      socket.on('student-status-updated', handleStatusUpdated);

      return () => {
        socket.off('tutor-status-updated', handleStatusUpdated);
        socket.off('student-status-updated', handleStatusUpdated);
      };
    }, []);

    useEffect(() => {
      if (!userData?._id) return;

      const handleQuestionRequest = (data: any) => {
        if (userData?.role !== 'tutor') return;
        addNotification('Incoming student request', `A student asked for help in ${data?.subject || 'your subject'}.`);
      };

      const handleQuestionAccepted = (data: any) => {
        if (userData?.role === 'student') {
          const tutorName = data?.tutorName ? ` by ${data.tutorName}` : '';
          addNotification('Session accepted', `Your session request was accepted${tutorName}. Please join the session now.`);
        }

        if (userData?.role === 'tutor') {
          addNotification('Session started', 'Your tutoring session has started. Please join the session room.');
        }
      };

      const handleSessionEnded = (data: any) => {
        if (userData?.role === 'student') {
          addNotification('Session completed', `Your session has ended and Rs.${data?.studentAmountDeducted ?? 250} was deducted from your wallet.`);
          addNotification('Payment successful', `Payment successful. Rs.${data?.studentAmountDeducted ?? 250} has been processed.`);
        }

        if (userData?.role === 'tutor') {
          addNotification('Session completed', `Your tutoring session has ended and Rs.${data?.tutorAmountCredited ?? 250} was added to your earnings.`);
          addNotification('Payment received', `Payment received. Rs.${data?.tutorAmountCredited ?? 250} was credited to your account.`);
        }
      };

      const handleRatingSubmitted = (data: any) => {
        if (userData?.role !== 'tutor' || data?.tutorId !== userData._id) return;
        addNotification('New review', `You received a new rating of ${data?.average ?? data?.rating ?? '5'} out of 5.`);
      };

      socket.on('question-request', handleQuestionRequest);
      socket.on('question-accepted', handleQuestionAccepted);
      socket.on('session-ended', handleSessionEnded);
      socket.on('rating-submitted', handleRatingSubmitted);

      return () => {
        socket.off('question-request', handleQuestionRequest);
        socket.off('question-accepted', handleQuestionAccepted);
        socket.off('session-ended', handleSessionEnded);
        socket.off('rating-submitted', handleRatingSubmitted);
      };
    }, [userData?._id, userData?.role]);

    /*
      Socket listener for student wallet deduction
      When a session ends, the backend sends the deducted amount.
      The student's balance is updated in real-time.
    */
    useEffect(() => {
        socket.on("session-ended", (data: { studentAmountDeducted: number, tutorAmountCredited: number }) => {
            setUserData((prev: any) => {
            if (!prev?.student) return prev;
            return {
                ...prev,
                student: {
                ...prev.student,
                balance: (prev.student.balance ?? 0) - data.studentAmountDeducted,
                },
            };
            });
        });

        return () => {
            socket.off("session-ended");
        };
    }, []);

    /*
      Socket listener for tutor earnings update
      When a session ends, the tutor's earnings are updated in real-time.
     */
    useEffect(() => {
        socket.on("session-ended", (data: { studentAmountDeducted: number, tutorAmountCredited: number }) => {
            setUserData((prev: any) => {
            if (!prev?.tutor) return prev;
            return {
                ...prev,
                tutor: {
                ...prev.tutor,
                earnings: prev.tutor.earnings + data.tutorAmountCredited,
                },
            };
            });
        });

        return () => {
            socket.off("session-ended");
        };
    }, []);

    /*
      Check if the user is already authenticated when the application loads.
      Send a request to the backend using cookies.
      Update login status and user data based on the response.
     */
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/auth/is-authenticated`, {
                    credentials: 'include',
                });

                const data = await res.json();

                if (data.success) {
                    setUserData(data.user);
                    setIsLoggedIn(true);
                } else {
                    setUserData(null);
                    setIsLoggedIn(false);
                }
            } catch {
                setUserData(null);
                    setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkAuthentication();
    }, [])
    
    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        isLoading,
        notifications,
        addNotification,
        markNotificationsAsRead,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be used inside AppContextProvider");
    }

    return context;
}
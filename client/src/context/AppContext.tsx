import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { socket } from "../utils";

interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userData: any;
  setUserData: (value: any) => void;
  isLoading: boolean
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: ProviderProps) => {
    const backendUrl = 'http://localhost:4000';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
        isLoading
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
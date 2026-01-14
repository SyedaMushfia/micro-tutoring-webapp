import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userData: any;
  setUserData: (value: any) => void;
  isLoading: boolean
//   storeUserData: (value: any) => void;
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
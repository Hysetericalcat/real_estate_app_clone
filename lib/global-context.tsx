import { createContext, useContext } from "react";
import { ReactNode } from "react";

interface User {
    $id: string,
    name: string,
    email: string,
    avatar: string
}

interface GlobalContextType {
    isLoggedIn: boolean,
    user: User | null,
    loading: boolean,
    refetch: () => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

interface childerProps {
    children: ReactNode
}

export const GlobalProvider = ({ children }: childerProps) => {
    // Demo user — no auth required
    const user: User = {
        $id: "demo-user-1",
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=60&w=200&auto=format&fit=crop",
    };
    const loading = false;
    const refetch = () => { };

    const isLoggedIn = true;
    return (
        <GlobalContext.Provider value={{ isLoggedIn, user, loading, refetch }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext)
    if (!context) throw new Error('must used within a global provider')
    return context;
}

export default GlobalProvider;
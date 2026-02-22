'use client';
import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const router = useRouter();

    const [user, setUser] = useState(() => {
        if (typeof window === 'undefined') return null;

        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            return JSON.parse(userData);
        }

        return null;
    });

    const [loading] = useState(false);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
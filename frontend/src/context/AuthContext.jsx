import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('agriUser');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('agriToken') || null;
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Validate or refresh session
        const storedToken = localStorage.getItem('agriToken');
        const storedUser = localStorage.getItem('agriUser');

        if (storedToken && storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                setToken(storedToken);
            } catch (err) {
                console.error('Failed to parse stored user:', err);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, jwtToken) => {
        const normalizedUser = {
            id: userData.id || userData._id || userData.farmerId || userData.customerId || userData.adminId,
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || 'Customer',
            walletAddress: userData.walletAddress || ''
        };

        setUser(normalizedUser);
        setToken(jwtToken || '');

        localStorage.setItem('agriUser', JSON.stringify(normalizedUser));
        if (jwtToken) {
            localStorage.setItem('agriToken', jwtToken);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('agriUser');
        localStorage.removeItem('agriToken');
    };

    const updateUser = (updatedFields) => {
        setUser(prev => {
            const next = { ...prev, ...updatedFields };
            localStorage.setItem('agriUser', JSON.stringify(next));
            return next;
        });
    };

    /**
     * Unified authenticated fetch wrapper
     */
    const apiFetch = async (endpoint, options = {}) => {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const activeToken = token || localStorage.getItem('agriToken');
        if (activeToken) {
            headers['Authorization'] = `Bearer ${activeToken}`;
        }

        const res = await fetch(url, {
            ...options,
            headers
        });

        // Auto logout on 401 Unauthorized if expired
        if (res.status === 401 && activeToken) {
            logout();
        }

        return res;
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: Boolean(user),
            role: user?.role || null,
            loading,
            login,
            logout,
            updateUser,
            apiFetch
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

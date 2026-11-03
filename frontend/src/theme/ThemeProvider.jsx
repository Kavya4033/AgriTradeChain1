import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            const saved = localStorage.getItem('atc-theme');
            if (saved === 'light' || saved === 'dark') {
                return saved;
            }
        } catch (e) {}

        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    // Update document attribute and meta theme-color whenever theme changes
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try {
            const meta = document.getElementById('theme-color-meta');
            if (meta) {
                meta.setAttribute('content', theme === 'dark' ? '#0c140d' : '#f5f7f5');
            }
        } catch (e) {}
    }, [theme]);

    // Follow OS preference live if user has not explicitly chosen
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;

        let hasSavedChoice = false;
        try {
            hasSavedChoice = Boolean(localStorage.getItem('atc-theme'));
        } catch (e) {}

        if (hasSavedChoice) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            try {
                if (!localStorage.getItem('atc-theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            } catch (err) {}
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, []);

    const toggleTheme = () => {
        setTheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            try {
                localStorage.setItem('atc-theme', next);
            } catch (e) {}
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

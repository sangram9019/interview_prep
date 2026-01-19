import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import './Darkmode.css';

const DarkMode = () => {
    // 1. Initialize state from localStorage or default to false
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    useEffect(() => {
        // 2. Apply the class to the body
        if (isDark) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="theme-toggle-btn"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {isDark ? (
                <Sun size={20} className="sun-icon sun" />
            ) : (
                <Moon size={20} className="theme-icon" />
            )}
        </button>
    );
};

export default DarkMode;
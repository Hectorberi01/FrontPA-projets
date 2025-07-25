'use client';

import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
            {theme === 'dark' ? '🌙 Sombre' : '☀️ Clair'}
        </button>
    );
}

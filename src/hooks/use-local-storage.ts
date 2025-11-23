import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // Initialize state with a function to avoid running on every render
    const [storedValue, setStoredValue] = useState<T>(() => {
        // Return initial value during SSR
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    // Update localStorage whenever storedValue changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                console.log(error);
            }
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
}

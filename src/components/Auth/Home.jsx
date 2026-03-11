import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserName = async () => {
            const token = localStorage.getItem('token');
            const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCwDsvQguErZLZzPuUX33gtYeXV8tUUFWg`;

            try {
                const response = await axios.post(url, { idToken: token });
                if (response.data.users?.[0]) {
                    const user = response.data.users[0];
                    setUserName(user.displayName || user.email.split('@')[0]);
                }
            } catch (err) {
                console.error('Error fetching user name:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserName();
    }, []);

    if (loading) {
        return (
            <div className="auth-container" style={{ background: '#0f172a' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    return (
        <div style={{ background: '#0f172a', minHeight: 'calc(100vh - 64px)', color: 'white' }}>
            <main style={{ padding: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Welcome back, {userName}!
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                    Your dashboard is ready. Start tracking your expenses today.
                </p>
            </main>
        </div>
    );
};

export default Home;

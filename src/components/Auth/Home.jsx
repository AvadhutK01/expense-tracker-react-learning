import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [userName, setUserName] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(true);
    const [loading, setLoading] = useState(true);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCwDsvQguErZLZzPuUX33gtYeXV8tUUFWg`;

        try {
            const response = await axios.post(url, { idToken: token });
            if (response.data.users?.[0]) {
                const user = response.data.users[0];
                setUserName(user.displayName || user.email.split('@')[0]);
                setIsEmailVerified(user.emailVerified);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerification = async () => {
        setVerifyLoading(true);
        setMessage({ type: '', text: '' });
        const token = localStorage.getItem('token');
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCwDsvQguErZLZzPuUX33gtYeXV8tUUFWg`;

        try {
            await axios.post(url, {
                requestType: 'VERIFY_EMAIL',
                idToken: token
            });
            setMessage({
                type: 'success',
                text: 'Check your email, you might have received a verification link. Click on it to verify.'
            });
        } catch (err) {
            const errorMsg = err.response?.data?.error?.message || 'Failed to send verification email';
            setMessage({
                type: 'error',
                text: errorMsg.replace(/_/g, ' ')
            });
        } finally {
            setVerifyLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="auth-container" style={{ background: '#0f172a' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    return (
        <div style={{ background: '#0f172a', minHeight: 'calc(100vh - 64px)', color: 'white' }}>
            <main style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Welcome back, {userName}!
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Your dashboard is ready. Start tracking your expenses today.
                </p>

                {message.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        color: message.type === 'success' ? '#4ade80' : '#f87171'
                    }}>
                        {message.text}
                    </div>
                )}

                {!isEmailVerified && !message.text && (
                    <div style={{
                        padding: '2rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        marginTop: '2rem'
                    }}>
                        <h3 style={{ marginTop: 0 }}>Verify Your Email</h3>
                        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                            Your email is not verified yet. Please verify to ensure full access to your account features.
                        </p>
                        <button
                            onClick={handleSendVerification}
                            disabled={verifyLoading}
                            className="auth-button"
                            style={{
                                width: 'auto',
                                padding: '12px 32px',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            {verifyLoading ? (
                                <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                            ) : 'Verify Email ID'}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;

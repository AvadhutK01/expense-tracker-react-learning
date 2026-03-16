import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/authSlice';
import ProfileIcon from '../Profile/ProfileIcon';
import ProfileForm from '../Profile/ProfileForm';
import './Header.css';

const Header = () => {
    const [userData, setUserData] = useState({
        email: '',
        displayName: '',
        photoUrl: '',
    });
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        if (!token) return;

        const url = `${import.meta.env.VITE_AUTH_BASE_URL}:lookup?key=${import.meta.env.VITE_FIREBASE_API_KEY}`;

        try {
            const response = await axios.post(url, { idToken: token });
            if (response.data.users?.[0]) {
                const user = response.data.users[0];
                setUserData({
                    email: user.email,
                    displayName: user.displayName || '',
                    photoUrl: user.photoUrl || '',
                });
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateCompletion = () => {
        let score = 0;
        if (userData.displayName) score += 50;
        if (userData.photoUrl) score += 50;
        return score;
    };

    const handleLogout = () => {
        dispatch(authActions.logout());
        window.location.reload();
    };

    return (
        <header className="app-header">
            <div className="header-brand">
                <h2 className="header-title">ExpenseTracker</h2>
            </div>

            <div className="header-actions">
                {!loading && (
                    <>
                        <ProfileIcon
                            email={userData.email}
                            displayName={userData.displayName}
                            photoUrl={userData.photoUrl}
                            completion={calculateCompletion()}
                            onClick={() => setIsProfileOpen(true)}
                        />
                        <button
                            onClick={handleLogout}
                            className="auth-button logout-btn"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>

            <ProfileForm
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                userData={userData}
                onUpdate={(newDetails) => {
                    setUserData(prev => ({
                        ...prev,
                        displayName: newDetails.displayName || prev.displayName,
                        photoUrl: newDetails.photoUrl || prev.photoUrl
                    }));
                }}
            />
        </header>
    );
};

export default Header;

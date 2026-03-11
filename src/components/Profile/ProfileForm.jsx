import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { User, Image, X, Save, AlertCircle } from 'lucide-react';
import './ProfileForm.css';

const ProfileForm = ({ isOpen, onClose, userData, onUpdate }) => {
    const [displayName, setDisplayName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (isOpen) {
            fetchCurrentData();
        }
    }, [isOpen]);

    const fetchCurrentData = async () => {
        setFetching(true);
        const token = localStorage.getItem('token');
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCwDsvQguErZLZzPuUX33gtYeXV8tUUFWg`;

        try {
            const response = await axios.post(url, { idToken: token });
            if (response.data.users?.[0]) {
                const user = response.data.users[0];
                setDisplayName(user.displayName || '');
                setPhotoUrl(user.photoUrl || '');
            }
        } catch (err) {
            console.error('Error fetching current profile data:', err);
            // Fallback to prop data if API fails
            setDisplayName(userData.displayName || '');
            setPhotoUrl(userData.photoUrl || '');
        } finally {
            setFetching(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCwDsvQguErZLZzPuUX33gtYeXV8tUUFWg`;

        try {
            const response = await axios.post(url, {
                idToken: token,
                displayName,
                photoUrl,
                deleteAttribute: [],
                returnSecureToken: true,
            });

            console.log('Profile updated successfully');
            onUpdate(response.data);
            onClose();
        } catch (err) {
            const message = err.response?.data?.error?.message || 'Failed to update profile';
            setError(message.replace(/_/g, ' '));
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="modal-overlay">
            <div className="profile-modal">
                <div className="modal-header">
                    <h2>Update Profile</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="profile-form">
                    {fetching ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '20px 0' }}>
                            <div className="loading-spinner" style={{ width: '30px', height: '30px' }}></div>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Loading profile data...</p>
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label className="form-label">Display Name</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        className="auth-input"
                                        placeholder="Your Name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Profile Image URL</label>
                                <div className="input-wrapper">
                                    <Image className="input-icon" size={18} />
                                    <input
                                        type="url"
                                        className="auth-input"
                                        placeholder="https://example.com/photo.jpg"
                                        value={photoUrl}
                                        onChange={(e) => setPhotoUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={loading || fetching}>
                            {loading ? (
                                <div className="loading-spinner"></div>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ProfileForm;

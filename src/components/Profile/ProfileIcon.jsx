import React from 'react';
import './ProfileIcon.css';

const ProfileIcon = ({ email, displayName, photoUrl, completion, onClick }) => {
    const getInitials = () => {
        if (displayName) {
            const names = displayName.trim().split(/\s+/);
            if (names.length > 1) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return names[0][0].toUpperCase();
        }
        return email ? email[0].toUpperCase() : '?';
    };

    const initial = getInitials();
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (completion / 100) * circumference;

    return (
        <div className="profile-icon-container" onClick={onClick}>
            <svg className="progress-ring" width="54" height="54">
                <circle
                    className="progress-ring__circle-bg"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="3"
                    fill="transparent"
                    r={radius}
                    cx="27"
                    cy="27"
                />
                <circle
                    className="progress-ring__circle"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset: offset }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="27"
                    cy="27"
                />
            </svg>
            <div className="profile-avatar">
                {photoUrl ? (
                    <img src={photoUrl} alt="Profile" className="avatar-img" />
                ) : (
                    <span className="avatar-initial">{initial}</span>
                )}
            </div>
        </div>
    );
};

export default ProfileIcon;

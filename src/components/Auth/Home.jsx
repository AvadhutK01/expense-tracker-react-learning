import React from 'react';

const Home = () => {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Home Page</h1>
            <p>You are logged in.</p>
            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    window.location.reload();
                }}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Home;

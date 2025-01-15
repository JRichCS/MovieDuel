import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getUserInfo from '../../utilities/decodeJwt';

const HomePage = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        return navigate('/');
    };

    useEffect(() => {
        setUser(getUserInfo());
    }, []);

    if (!user) return (
        <div><h4>Log in to view this page.</h4></div>
    );

    const { id, email, username } = user;

    return (
        <>
            <div className="card-container">
                <div className="card">
                    <h3>Welcome</h3>
                    <p className="username">{username}</p>
                </div>
                <div className="card">
                    <h3>Your userId in MongoDB is</h3>
                    <p className="userId">{id}</p>
                </div>
                <div className="card">
                    <h3>Your email is</h3>
                    <p className="email">{email}</p>
                </div>
            </div>
            <button onClick={(e) => handleClick(e)}>
                Log Out
            </button>
        </>
    );
};

export default HomePage;
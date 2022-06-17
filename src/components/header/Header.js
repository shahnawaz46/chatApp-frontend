import React, { useState, useEffect } from 'react';
import './Header.css';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import ShowProfile from '../showProfile/ShowProfile';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState()
    const [showProfile, setShowProfile] = useState(false)

    const logout = () => {
        sessionStorage.removeItem("chat_user")
        navigate("/login", { replace: true })
    }

    useEffect(() => {
        sessionStorage.getItem("chat_user") && setUser(JSON.parse(sessionStorage.getItem('chat_user')))
    }, [])

    return (
        <>
            <div className="header-div">
                <div className="app-name">
                    <h3>GT</h3>
                    <p><span style={{ fontWeight: '700' }}>Global</span> Talk</p>
                </div>
                <div className="app-navbar">
                    <button onClick={() => alert("this function is not available right now")}>Invite Friends</button>
                    <NotificationsNoneIcon className='header-notification-icon' onClick={() => alert("this function is not available right now")} />
                    <div className="my-name" onClick={() => setShowProfile(true)}>
                        <Avatar src="" />
                        <h4>{user?.name}</h4>
                    </div>
                    <LockOutlinedIcon style={{ cursor: "pointer" }} onClick={logout} />
                </div>
            </div>

            {/* user profile div for showing transition */}
            {
                showProfile &&
                <div className='showprofile-main-div'>
                    <div className="showprofile-div condition">
                        <ShowProfile setShowProfile={setShowProfile} />
                    </div>
                </div>
            }

        </>
    );
};

export default Header;

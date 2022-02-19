import React, { useState, useEffect } from 'react';
import './Header.css';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import { useStore } from '../../context/Context';
import { useNavigate } from 'react-router-dom';
import { userImages } from '../../axios/AxiosInstance';
import ShowProfile from '../showProfile/ShowProfile';

const Header = () => {
    const { state: { loginUser, socket }, dispatch } = useStore()
    const navigate = useNavigate()

    const [showProfile, setShowProfile] = useState(false)

    const logout = () => {
        if (localStorage.getItem("user")) {
            localStorage.removeItem("user")

            socket.emit("user_logout", loginUser._id)

            dispatch({ type: "USER_LOGOUT" })
            navigate("/login", { replace: true })
            return null
        }
    }

    // console.log(loginUser)
    // useEffect(() => {
    //     console.log("header useEffect()");
    // }, [])

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
                        <Avatar src={loginUser.image && userImages(loginUser.image)} />
                        <h4>{loginUser.name}</h4>
                    </div>
                    <LockOutlinedIcon onClick={logout} style={{ cursor: "pointer" }} />
                </div>
            </div>

            {/* user profile div for showing transition */}
            {
                showProfile &&
                <div className='showprofile-main-div'>
                    <div className="showprofile-div condition">
                        <ShowProfile showProfileFnc={setShowProfile} userDetail={loginUser} />
                    </div>
                </div>
            }

        </>
    );
};

export default Header;

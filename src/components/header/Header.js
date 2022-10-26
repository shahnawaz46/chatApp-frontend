import React, { useState } from 'react';
import './Header.css';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import ShowProfile from '../showProfile/ShowProfile';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/Context';
import { IoClose, IoCheckmarkSharp } from 'react-icons/io5';
import { BiCheck } from 'react-icons/bi'

const Header = () => {
    const navigate = useNavigate()
    const { state: { loginUser, socket }, dispatch } = useStore()

    const [showNotification, setShowNotification] = useState()

    const [showProfile, setShowProfile] = useState(false)

    const rejectFriendRequest = (item) => {
        // console.log("reject", item);
        const request = {
            senderId: item.userId,
            receiverId: loginUser._id,
            message: item.message
        }
        socket.emit("reject_friend_request", request)
        // dispatch({type:"FRIEND_REQUEST_REJECT"})
    }

    const acceptFriendRequest = (userId) => {
        const bothIds = { senderId: userId, receiverId: loginUser._id }
        socket.emit("accept_friend_request", bothIds)
    }

    const logout = async () => {
        socket.emit("logout_user", (loginUser._id))

        localStorage.removeItem("chat_user")

        dispatch({ type: "USER_LOGOUT" })

        navigate("/login", { replace: true })
    }


    const shareLink = () => {
        navigator.clipboard.writeText(window.location.origin)

        document.getElementById("message-copied-header").style.display = "flex"

        setTimeout(() => {
            document.getElementById("message-copied-header").style.display = "none"
        }, 1000)
    }

    return (
        <>
            <div className="header-div">
                <div className="app-name">
                    <h3>GT</h3>
                    <p><span style={{ fontWeight: '700' }}>Global</span> Talk</p>
                </div>
                <div className="app-navbar">
                    <button onClick={shareLink} className='invite-btn'>Invite Friends</button>

                    <div id='message-copied-header' className='message-copied' style={{ position: "fixed", left: '50%', transfrom: 'translateX(-50%)' }}>
                        <BiCheck style={{ marginRight: '2px', fontSize: '20px' }} />
                        <span>Copied</span>
                    </div>

                    <div className='header-notification-div'>
                        {
                            loginUser?.notifications?.length > 0 &&
                            <div className='header-empty-div'></div>
                        }
                        <NotificationsNoneIcon className='header-notification-icon' onClick={() => setShowNotification(!showNotification)} />

                        {
                            // showNotification &&
                            <div className={`header-show-notification ${showNotification ? 'show-notification' : 'hide-notification'}`}>
                                {
                                    loginUser?.notifications?.length > 0 ?
                                        loginUser?.notifications.map((item, index) =>
                                            <div key={index} className="header-accept-reject-div">
                                                <p>{item.message} </p>
                                                <div className='header-accept-reject-icon'>
                                                    <IoClose style={{ cursor: 'pointer', border: '1px solid white' }} onClick={() => rejectFriendRequest(item)} />
                                                    <IoCheckmarkSharp style={{ cursor: 'pointer', border: '1px solid white' }} onClick={() => acceptFriendRequest(item.userId)} />
                                                </div>
                                            </div>
                                        )
                                        :
                                        <p style={{ color: 'white', textAlign: 'center' }}>No Notification</p>
                                }
                            </div>
                        }

                    </div>
                    <div className="my-name" onClick={() => setShowProfile(true)}>
                        <Avatar src={loginUser.image && loginUser.image} alt="profile" />
                        <h4>{loginUser?.name}</h4>
                    </div>
                    <LockOutlinedIcon style={{ cursor: "pointer" }} onClick={logout} />
                </div>
            </div>

            {/* user profile div for showing transition */}
            {
                showProfile &&
                <div className='showprofile-main-div'>
                    <div className="showprofile-div condition">
                        <ShowProfile setShowProfile={setShowProfile} info={loginUser} />
                    </div>
                </div>
            }

        </>
    );
};

export default Header;

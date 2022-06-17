import React, { useEffect, useState } from 'react';
import './AllUsers.css'
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom'


const AllUsers = ({ userName }) => {
    const navigate = useNavigate()

    const openChat = (value) => {
        navigate(`/myaccount/user=${value}`)

        return null
    }

    return (
        <div className="alluser-div" id={userName ? "hide-alluser-div" : ""}>
            <h3>Chats</h3>
            <div className="alluser-search-bar">
                <input type="text" placeholder="search for users" />
                <SearchIcon className="alluser-search-icon" />
            </div>
            <div className="alluser-avatars">
                <Avatar src="" style={{ width: '52px', height: "52px", margin: "0px 6px" }} />
            </div>

            <h4>Recents Chats</h4>
            <div className="alluser-list">
                <div className="user-div" onClick={() => openChat("somyaranjan")}>
                    <Avatar src="" />
                    <div className="user-name-message">
                        <div className="user-name">
                            <div className="user-name-and-online">
                                <h4>Somyaranjan</h4>
                                <span>Online</span>
                            </div>
                            <span className='user-unseen-message'>5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AllUsers;
import React, { useEffect, useState, useRef } from 'react';
import './AllUsers.css';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/Context';
import { userImages } from '../../axios/AxiosInstance';


const AllUsers = () => {
    const navigate = useNavigate()
    const { state, dispatch } = useStore()

    const [allUsers, setAllUsers] = useState([])

    const sortNames = (senderName, receiverName) => {
        return [senderName, receiverName].sort().join("-")
    }

    const setDetail = (value) => {
        dispatch({ type: "OPEN_CHAT", payload: value })

        const key = sortNames(state.loginUser.name, value.name)
        if (key in state.allMessages) {
            state.allMessages[key] = state.allMessages[key].map((value) => value.isSeen ? value : { ...value, isSeen: true })
        }

        if (Object.keys(state.selectedUser).length === 0) {
            navigate(`/myaccount/user=${value.name}`)

        } else {
            navigate(`/myaccount/user=${value.name}`, { replace: true })
        }

        return null
    }


    const getUnSeenMessageLength = (receiver) => {
        if (state.selectedUser.name === receiver) return

        const key = sortNames(state.loginUser.name, receiver)

        if (key in state.allMessages) {
            const messagelength = (state.allMessages[key].filter((value) => value.isSeen === false)).length

            return messagelength > 0 ? messagelength : 0

        } else {
            return
        }
    }

    const searchUser = (e) => {
        if (e.target.value === '')
            setAllUsers(state.allUsers)

        else {
            const a = state.allUsers.filter((value) => (value.name).toLowerCase().includes((e.target.value).toLowerCase()))
            setAllUsers(a)
        }
    }

    useEffect(() => {
        setAllUsers(state.allUsers)
    }, [state.allUsers])

    // useEffect(() => {
    //     console.log("allUser useEffect()");
    // }, [])

    return (
        <div className="alluser-div" id={Object.keys(state.selectedUser).length !== 0 ? "hide-alluser-div" : ""}>
            <h3>Chats</h3>
            <div className="alluser-search-bar">
                <input type="text" placeholder="search for users" onChange={searchUser} />
                <SearchIcon className="alluser-search-icon" />
            </div>
            <div className="alluser-avatars">
                {
                    allUsers.length > 0 && allUsers.map((value, index) =>
                        value.name !== state.loginUser.name &&
                        <Avatar src={value.image && userImages(value.image)} style={{ width: '52px', height: "52px", margin: "0px 6px" }} key={index} />
                    )
                }
            </div>
            <h4>Recents Chats</h4>
            <div className="alluser-list">
                {
                    allUsers.length > 0 ?
                        allUsers.map((value, index) =>
                            value.name !== state.loginUser.name &&
                            <div key={index} className="user-div" onClick={() => setDetail(value)}>
                                <Avatar src={value.image && userImages(value.image)} />
                                <div className="user-name-message">
                                    <div className="user-name">
                                        <div className="user-name-and-online">
                                            <h4>{value.name}</h4>
                                            <span>Online</span>
                                        </div>

                                        {
                                            getUnSeenMessageLength(value.name) > 0 &&
                                            <span className='user-unseen-message'>{getUnSeenMessageLength(value.name)}</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                        :
                        <span>No Users</span>
                }
            </div>
        </div >
    );
};

export default AllUsers;

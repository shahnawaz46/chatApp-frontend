import React, { useEffect, useState } from 'react';
import './AllUsers.css';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/Context';
import { MdPersonAddAlt1 } from 'react-icons/md'
import { AxiosInstance } from '../../axios/AxiosInstance'


const AllUsers = ({ userName }) => {
    const navigate = useNavigate()
    const { state: { loginUser, allUsers, socket } } = useStore()

    const [friends, setFriends] = useState([])

    const openChat = (value) => {
        navigate(`/myaccount/user=${value}`)
        return null
    }

    const searchUser = async (e) => {
        const searchData = e.target.value

        if (searchData !== "") {
            const loginUserFilterFriends = loginUser.friends.filter((item) => (item.name).toLowerCase().includes(searchData.toLowerCase()))

            let allSearchUser = []

            if (searchData !== " ") {
                const searchInfo = {
                    query: searchData,
                    id: loginUser._id,
                    friends: loginUser.friends || []
                }
                const res = await AxiosInstance.post('/api/user/search', searchInfo)

                allSearchUser = res.data.allSearchUser.map((item) => ({ ...item, notFriend: true }))
            }

            setFriends([...loginUserFilterFriends, ...allSearchUser]);

        } else {
            setFriends(loginUser.friends)
        }
    }

    const addFriend = (userId) => {
        const request = {
            receiverId: userId,
            senderId: loginUser._id,
            message: `${loginUser.name} send you friend request`
        }
        // console.log(userId);
        socket.emit("friend_request_send", request)
    }

    useEffect(() => {
        loginUser?.friends && setFriends(loginUser.friends)
    }, [loginUser])

    return (
        <div className="alluser-div" id={userName ? "hide-alluser-div" : ""}>
            <h3>Chats</h3>
            <div className="alluser-search-bar">
                <input type="text" placeholder="search for users" onChange={searchUser} />
                <SearchIcon className="alluser-search-icon" />
            </div>
            {/* <div className="alluser-avatars">
                {
                    friends.length > 0 && friends.map((item, index) => <Avatar key={index} src="" style={{ width: '52px', height: "52px", margin: "0px 6px" }} />)
                }
            </div> */}

            <h4>Friends</h4>
            <div className="alluser-list">
                {
                    friends.length > 0 ? friends.map((item, index) => {
                        return (
                            <div key={index} className="user-div" >
                                <Avatar src="" />
                                <div className="user-name-message">
                                    {
                                        !(item?.notFriend) ?
                                            <div className="user-name" onClick={() => openChat("somyaranjan")}>
                                                <div className="user-name-and-online">
                                                    <h4>{item?.name}</h4>
                                                    <span>Online</span>
                                                </div>
                                                {/* <span className='user-unseen-message'>5</span> */}
                                            </div>
                                            :
                                            <div className="user-name">
                                                <div className="user-name-and-online">
                                                    <h4>{item?.name}</h4>
                                                    <span>Not Friend</span>
                                                </div>
                                                <MdPersonAddAlt1 style={{ fontSize: '20px', color: "dimgrey" }} onClick={() => addFriend(item._id)} />
                                            </div>
                                    }
                                </div>
                            </div>
                        )
                    })
                        :
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>No Result found</div>
                }
            </div>
        </div >
    );
};

export default AllUsers;
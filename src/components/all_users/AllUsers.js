import React, { useEffect, useRef, useState } from 'react';
import './AllUsers.css';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/Context';
import { MdPersonAddAlt1, MdCircle, MdCheck } from 'react-icons/md'
import { AxiosInstance, userImages } from '../../axios/AxiosInstance'


const AllUsers = ({ userName }) => {
    const navigate = useNavigate()
    const { state: { loginUser, socket } } = useStore()

    const [friends, setFriends] = useState(loginUser.friends)
    const chatRef = useRef(false)

    // console.log("allUser Comp", friends);

    const openChat = (userId, userName, index) => {
        if (chatRef.current === false) {
            chatRef.current = true
            navigate(`/user=${userName}`, { state: { index, userId } })
        }
        else
            navigate(`/user=${userName}`, { replace: true, state: { index, userId } })


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

                allSearchUser = res.data.allSearchUser.map((item) => {
                    if (item?.notifications?.find((noti) => noti.userId === loginUser._id)) {
                        return { ...item, notFriend: true, requestAlreadySent: true }
                    } else
                        return { ...item, notFriend: true }
                })
            }

            // console.log(allSearchUser);
            setFriends([...loginUserFilterFriends, ...allSearchUser]);

        } else {
            setFriends(loginUser.friends)
        }
    }

    const addFriend = (item, index) => {
        const request = {
            receiverId: item._id,
            senderId: loginUser._id,
            message: `${loginUser.name} send you friend request`
        }
        // console.log(userId);
        socket.emit("friend_request_send", request)

        // const tempfriends = friends means tempFriends is pointing to the friends state
        // const tempfriends = [...friends] means i'm copying the friends list into the tempfriends list
        const tempFriends = [...friends]
        tempFriends[index].requestAlreadySent = true
        setFriends(tempFriends)
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
                                <Avatar src={item.image && userImages(item.image)} />
                                <div className="user-name-message">
                                    {
                                        !(item?.notFriend) ?
                                            <div className="user-name" onClick={() => openChat(item._id, item.name, index)}>
                                                <div className="user-name-and-online" >
                                                    <h4>{item?.name}</h4>
                                                    {
                                                        item?.online ?
                                                            <div className='user-online-icon'>
                                                                <span>Online</span>
                                                                <MdCircle style={{ color: 'green', fontSize: '12px', marginBottom: '-2px' }} />
                                                            </div>
                                                            :
                                                            <div className='user-online-icon'>
                                                                <span>Offline</span>
                                                                {/* <MdCircle style={{ color: 'red', fontSize: '12px' }} /> */}
                                                            </div>
                                                    }
                                                </div>
                                                {/* <span className='user-unseen-message'>5</span> */}
                                            </div>
                                            :
                                            <div className="user-name">
                                                <div className="user-name-and-online">
                                                    <h4 style={{ marginBottom: '5px' }}>{item?.name}</h4>
                                                    <span style={{ fontSize: '15px', margin: '0px 5px' }}>Not Friend</span>
                                                </div>
                                                {
                                                    item.requestAlreadySent ?
                                                        <MdCheck style={{ fontSize: '20px', color: "green" }} />
                                                        : <MdPersonAddAlt1 style={{ fontSize: '20px', color: "dimgrey", cursor: 'pointer' }} onClick={() => addFriend(item, index)} />
                                                }
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

export default React.memo(AllUsers);
import React, { useEffect, useState, useRef } from 'react';
import './MessageSection.css'
import Message from '../messages/Message'
import Avatar from '@mui/material/Avatar';
import { BiMicrophone, BiCamera, BiArrowBack } from 'react-icons/bi';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SendIcon from '@mui/icons-material/Send';
import ShowProfile from '../showProfile/ShowProfile';
import Preview from '../preview/Preview';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Layout from '../layout/Layout';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/Context';
import { userImages } from '../../axios/AxiosInstance';
import { MdContentCopy, MdDeleteOutline } from 'react-icons/md';
import Swal from 'sweetalert2'
import { v4 as uuid } from 'uuid'


const MessageSection = () => {
    const { state: { loginUser, socket, allMessages }, dispatch } = useStore()
    const { userName } = useParams()
    const { state: { index, userId } } = useLocation()
    const navigate = useNavigate()

    const [showProfile, setShowProfile] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const messageRef = useRef(null)
    const scrollBottomRef = useRef(null)

    const [previewImage, setPreviewImage] = useState(false)
    const [showImage, setShowImage] = useState(null)

    const [showEmoji, setShowEmoji] = useState(false)

    const [deleteMessageMenu, setDeleteMessageMenu] = useState(false)
    const [menuPosition, setMenuPosition] = useState({})

    const sendMessage = (imageUrl) => {
        if (messageRef.current.value === "" && !imageUrl)
            return

        const messageDetail = {
            senderId: loginUser._id,
            receiverId: userId,
            message: messageRef.current.value ? messageRef.current.value : null,
            mediaURL: imageUrl ? imageUrl : null,
            time: Date.now(),
            messageId: uuid(),
            receiverSeen: false
        }

        socket.emit("send_message", messageDetail)

        messageRef.current.value = null
        setShowEmoji(false)
    }

    const storeImageInCloudinary = async () => {
        const formData = new FormData()
        formData.append("file", showImage)
        formData.append("upload_preset", "chat-app-images")

        const res = await fetch('https://api.cloudinary.com/v1_1/dpzikxpfn/image/upload', {
            method: 'POST',
            body: formData
        })
        const data = await res.json()

        sendMessage(data.secure_url)

        setPreviewImage(false)
        setShowImage(null)
    }

    const storeImageInState = (e) => {
        if (!(e.target.files[0]))
            return

        setShowImage(e.target.files[0])

        setPreviewImage(true)
    }

    const openUserProfile = () => {
        setSelectedUser(loginUser.friends[index])
        setShowProfile(true)
    }

    const goBack = () => {
        navigate(-1)
    }

    const rightClickForShowMenu = (e, id) => {
        e.preventDefault()

        let pagePosition = {
            top: e.pageY,
            left: e.pageX
        }

        setDeleteMessageMenu(!deleteMessageMenu)

        if (window.innerWidth - e.pageX < 200) {
            pagePosition.left = e.pageX - 140

        } if (window.innerHeight - e.pageY < 170) {
            pagePosition.top = e.pageY - 90
        }

        setMenuPosition({
            id,
            menuPosition: {
                position: 'absolute',
                ...pagePosition
            }
        })
    }

    const deleteMessage = () => {

        setDeleteMessageMenu(false)

        Swal.fire({
            title: 'Do you want to delete this message?',
            text: 'It will be deleted from both sides',
            icon: 'warning',
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#3085d6',
            showCancelButton: true,
            cancelButtonColor: '#d333',
        }).then((result) => {
            if (result.isConfirmed) {

                socket.emit("delete_message", menuPosition.id)

                Swal.fire(
                    'Deleted!',
                    'Your message has been deleted.',
                    'success'
                )
            }
        })
    }

    const closeDeleteMessageMenu = (e) => {
        const menuPosX = menuPosition.menuPosition?.left
        const menuPosY = menuPosition.menuPosition?.top
        if (deleteMessageMenu) {
            if ((e.pageX > menuPosX && e.pageX < menuPosX + 140) && (e.pageY > menuPosY && e.pageY < menuPosY + 90))
                return

            setDeleteMessageMenu(false)
        }
    }

    useEffect(() => {
        window.addEventListener("mousedown", closeDeleteMessageMenu)

        return () => {
            window.removeEventListener("mousedown", closeDeleteMessageMenu)
        }
    }, [deleteMessageMenu])

    useEffect(() => {
        scrollBottomRef?.current?.scrollIntoView({ behaviour: "smooth" })
    }, [allMessages, index])

    return (
        <>
            <Layout>
                <div className="message-section-div" >
                    <div className="messagesection-user">

                        <BiArrowBack className='messagesection-go-back-arrow' onClick={goBack} />

                        {
                            loginUser?.friends?.length > 0 && loginUser?.friends[index].image ?

                                <Avatar src={loginUser?.friends[index].image} style={{ cursor: "pointer" }} alt="profile" />
                                :
                                <Avatar src="" style={{ cursor: "pointer" }} alt="profile" />

                        }
                        <div className="messagesection-user-name" onClick={openUserProfile} >
                            <h4>{userName}</h4>
                            {
                                loginUser?.friends?.length > 0 &&
                                    loginUser?.friends[index]?.online ?
                                    <p>Online</p>
                                    :
                                    <p>Offline</p>
                            }
                        </div>
                        <div className="messagesection-icon-div">
                            <BiCamera className='icon' onClick={() => alert("this function is not available right now")} />
                            <BiMicrophone className='icon' onClick={() => alert("this function is not available right now")} />
                        </div>
                    </div>

                    {/* show message/media list */}
                    <div className={`messagesection-chat ${deleteMessageMenu && 'hide-scroll'}`}>
                        {
                            Object.keys(allMessages).length > 0 &&
                            allMessages[[loginUser._id, userId].sort().join('-')] &&
                            allMessages[[loginUser._id, userId].sort().join('-')].map((msg, index) =>
                                <Message
                                    key={index}
                                    msgDetail={msg}
                                    owner={msg.senderId === loginUser._id && "owner"}
                                    rightClickForShowMenu={rightClickForShowMenu}
                                />
                            )
                        }

                        {/* for show delete/copy message */}
                        <div className={`right-click-modal ${deleteMessageMenu && 'show-delete-menu'}`} style={menuPosition.menuPosition}>
                            <div className='right-click-menu'>
                                <MdContentCopy className='right-click-copy-icon' />
                                <span className='right-click-span'>Copy Text</span>
                            </div>
                            <div className='right-click-menu' onClick={deleteMessage}>
                                <MdDeleteOutline className='right-click-delete-icon' />
                                <span className='right-click-span'>Delete</span>
                            </div>
                        </div>

                        <div id="bottom-reference" ref={scrollBottomRef} />
                    </div>

                    <div className="messagesection-send-message">
                        <div className="messagesection-file-select">
                            <input type="file" accept='image/*' id="input-file-hide" style={{ display: 'none' }} onChange={storeImageInState} />
                            <label htmlFor="input-file-hide">
                                <AddOutlinedIcon className='messagesection-plus-icon' />
                            </label>
                        </div>

                        <input type="text" placeholder="Type your message..." ref={messageRef} />
                        <SentimentSatisfiedOutlinedIcon style={{ cursor: 'pointer' }} onClick={() => setShowEmoji(prev => !prev)} />
                        <SendIcon style={{ marginLeft: "10px", cursor: "pointer" }} onClick={() => sendMessage('')} />
                    </div>
                </div>
            </Layout>


            {/* show emoji after click on button */}
            {
                showEmoji &&
                <Picker onSelect={(e) => messageRef.current.value += e.native} style={{ position: 'absolute', bottom: '75px', right: '24px' }} />
            }

            {/* preview image before send to the user */}
            {
                previewImage &&
                <Preview showImage={showImage} setShowImage={setShowImage} setPreviewImage={setPreviewImage} storeImageInCloudinary={storeImageInCloudinary} />
            }

            {/* user profile div for showing transition */}
            {
                showProfile &&
                <div className='showprofile-main-div'>
                    <div className="showprofile-div condition">
                        <ShowProfile setShowProfile={setShowProfile} info={selectedUser} />
                    </div>
                </div>
            }
        </>
    );
};

export default React.memo(MessageSection);
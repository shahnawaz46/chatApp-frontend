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

    const sendMessage = () => {

        if (messageRef.current.value === "")
            return

        const messageDetail = {
            senderId: loginUser._id,
            receiverId: userId,
            message: messageRef.current.value,
            time: Date.now(),
            receiverSeen: false
        }

        socket.emit("send_message", messageDetail)

        messageRef.current.value = null
    }

    const sendImage = (e) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(e.target.files[0])
        fileReader.onload = function () {
            setShowImage({
                imageName: e.target.files[0].name,
                url: fileReader.result
            })
            setPreviewImage(true)

            // reset the input field, so i can trigger onChange again for same image or file
            e.target.value = ''
        }
        fileReader.onerror = function (error) {
            console.log(error);
            // reset the input field, so i can trigger onChange again for same image or file
            e.target.value = ''
        }

    }

    const openUserProfile = () => {
        setSelectedUser(loginUser.friends[index])
        setShowProfile(true)
    }

    const goBack = () => {
        navigate(-1)
    }

    // console.log(allMessages);

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

                                <Avatar src={userImages(loginUser?.friends[index].image)} style={{ cursor: "pointer" }} alt="profile" />
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

                    <div className="messagesection-chat">
                        {
                            Object.keys(allMessages).length > 0 &&
                            allMessages[[loginUser._id, userId].sort().join('-')] &&
                            allMessages[[loginUser._id, userId].sort().join('-')].map((msg, index) =>
                                <Message key={index} owner={msg.senderId === loginUser._id && "owner"} message={msg.message} time={msg.time} readBy={msg.receiverSeen} />
                            )
                        }

                        <div id="bottom-reference" ref={scrollBottomRef} />
                    </div>

                    <div className="messagesection-send-message">
                        <div className="messagesection-file-select">
                            <input type="file" accept='image/*' id="input-file-hide" style={{ display: 'none' }} onChange={sendImage} />
                            <label htmlFor="input-file-hide">
                                <AddOutlinedIcon className='messagesection-plus-icon' />
                            </label>
                        </div>

                        <input type="text" placeholder="Type your message..." ref={messageRef} />
                        <SentimentSatisfiedOutlinedIcon style={{ cursor: 'pointer' }} onClick={() => setShowEmoji(prev => !prev)} />
                        <SendIcon style={{ marginLeft: "10px", cursor: "pointer" }} onClick={sendMessage} />
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
                <Preview image={showImage} setImage={setPreviewImage} />
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
import React, { useState, useEffect } from 'react';
import './MessageSection.css'
import Message from '../messages/Message'
import Avatar from '@mui/material/Avatar';
import { BiMicrophone, BiCamera, BiArrowBack } from 'react-icons/bi';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SendIcon from '@mui/icons-material/Send';
import ShowProfile from '../showProfile/ShowProfile';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/Context';
import { useRef } from 'react';
import { userImages } from '../../axios/AxiosInstance';
import Preview from '../../preview/Preview';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Layout from '../layout/Layout';


const MessageSection = () => {
    const navigate = useNavigate()
    const { state, dispatch } = useStore()

    const [showProfile, setShowProfile] = useState(false)

    const bottomScrollRef = useRef(null)
    const messageRef = useRef(null)

    const [previewImage, setPreviewImage] = useState(false)
    const [showImage, setShowImage] = useState(null)

    const [showEmoji, setShowEmoji] = useState(false)

    const sortNames = (senderName, receiverName) => {
        return [senderName, receiverName].sort().join("-")
    }

    const sendMessage = () => {
        if (!messageRef.current.value && !showImage) return

        let data = {
            senderName: state.loginUser.name,
            receiverName: state.selectedUser.name,
            message: messageRef.current.value ? messageRef.current.value : null,
            media: showImage ? showImage : null,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSeen: false
        }

        // console.log(data);

        state.socket.emit("send_message", data)

        const key = sortNames(data.senderName, data.receiverName)

        data = { ...data, isSeen: true }

        if (key in state.allMessages) {

            dispatch({ type: "PUSH_MESSAGE", payload: { key, data } })

        } else {
            dispatch({ type: "ADD_MESSAGE", payload: { key, data } })
        }

        messageRef.current.value = null
        setShowImage(false)
        previewImage && setPreviewImage(false)
        showEmoji && setShowEmoji(false)
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

    const goBack = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (Object.keys(state.selectedUser).length === 0) {
            navigate('/', { replace: true })
        }
        console.log("message section")
    }, [])

    useEffect(() => {
        const key = sortNames(state.loginUser.name, state.selectedUser.name)
        if (key in state.allMessages && Object.keys(state.selectedUser).length > 0) {
            bottomScrollRef.current.scrollIntoView({
                // behavior: "smooth",
                block: "end",
            });
        }
    }, [state.allMessages, state.selectedUser])

    // console.log("message");

    return (
        <>
            <Layout>
                <div className="message-section-div" id={Object.keys(state.selectedUser).length === 0 ? "hide-alluser-div" : ""}>
                    <div className="messagesection-user">

                        <BiArrowBack className='messagesection-go-back-arrow' onClick={goBack} />

                        <Avatar src={state.selectedUser.image && userImages(state.selectedUser.image)} onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }} />
                        <div className="messagesection-user-name">
                            <h4>{state.selectedUser.name}</h4>
                            <p>Online</p>
                        </div>
                        <div className="messagesection-icon-div">
                            <BiCamera className='icon' onClick={() => alert("this function is not available right now")} />
                            <BiMicrophone className='icon' onClick={() => alert("this function is not available right now")} />
                        </div>
                    </div>

                    <div className="messagesection-chat">
                        {
                            Object.keys(state.allMessages).length > 0 &&
                            state.allMessages[sortNames(state.loginUser.name, state.selectedUser.name)] &&
                            state.allMessages[sortNames(state.loginUser.name, state.selectedUser.name)].map((value, index) =>
                                <Message key={index} owner={value.senderName === state.loginUser.name && "owner"} message={value.message} time={value.time} media={value.media} />
                            )
                        }
                        <div id="bottom-reference" ref={bottomScrollRef} />
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
                <Preview image={showImage} setImage={setPreviewImage} sendMessage={sendMessage} />
            }

            {/* user profile div for showing transition */}
            {
                showProfile &&
                <div className='showprofile-main-div'>
                    <div className="showprofile-div condition">
                        <ShowProfile showProfileFnc={setShowProfile} userDetail={state.selectedUser} />
                    </div>
                </div>
            }
        </>
    );
};

export default MessageSection;

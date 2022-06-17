import React, { useState } from 'react';
import './MessageSection.css'
import Message from '../messages/Message'
import Avatar from '@mui/material/Avatar';
import { BiMicrophone, BiCamera, BiArrowBack } from 'react-icons/bi';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SendIcon from '@mui/icons-material/Send';
import ShowProfile from '../showProfile/ShowProfile';
import { useRef } from 'react';
import Preview from '../preview/Preview';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Layout from '../layout/Layout';
import { useParams } from 'react-router-dom';


const MessageSection = () => {
    const [showProfile, setShowProfile] = useState(false)
    const { userName } = useParams()
    // console.log(userName);

    const messageRef = useRef(null)

    const [previewImage, setPreviewImage] = useState(false)
    const [showImage, setShowImage] = useState(null)

    const [showEmoji, setShowEmoji] = useState(false)

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

    return (
        <>
            <Layout>
                <div className="message-section-div" >
                    <div className="messagesection-user">

                        <BiArrowBack className='messagesection-go-back-arrow' />

                        <Avatar src="" style={{ cursor: "pointer" }} />
                        <div className="messagesection-user-name" onClick={() => setShowProfile(true)} >
                            <h4>{"somyaranjan"}</h4>
                            <p>Online</p>
                        </div>
                        <div className="messagesection-icon-div">
                            <BiCamera className='icon' onClick={() => alert("this function is not available right now")} />
                            <BiMicrophone className='icon' onClick={() => alert("this function is not available right now")} />
                        </div>
                    </div>

                    <div className="messagesection-chat">
                        <Message owner={"owner"} message={"hello how are you"} time={"12:05"} />
                        <Message message={"hy i am fine"} time={"12:06"} />
                        <div id="bottom-reference" />
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
                        <SendIcon style={{ marginLeft: "10px", cursor: "pointer" }} />
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
                        <ShowProfile setShowProfile={setShowProfile} />
                    </div>
                </div>
            }
        </>
    );
};

export default MessageSection;
import React, { useRef } from 'react';
import './ShowProfile.css';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { AiOutlineEdit } from 'react-icons/ai';
import { AxiosInstance, userImages } from '../../axios/AxiosInstance';
import { useStore } from '../../context/Context';
import { useNavigate } from 'react-router-dom';


const ShowProfile = ({ setShowProfile, info }) => {
    const navigate = useNavigate()

    const { state: { socket, loginUser }, dispatch } = useStore()
    const checkRef = useRef(localStorage.getItem("chat_user"))

    const uploadImage = async (e) => {
        const formData = new FormData()
        formData.append('_id', checkRef.current)
        formData.append("profileImage", e.target.files[0])

        const res = await AxiosInstance.post("/api/user/profile/update", formData)

        dispatch({ type: 'UPDATE_USER', payload: res.data.updatedUser })
    }

    const removeFriend = () => {
        socket.emit("remove_friend", { loginId: loginUser._id, removerId: info._id })

        setShowProfile(false)

        navigate("/", { replace: true })
        return
    }

    // console.log(checkRef);
    return (
        <div className="showprofile-div2">
            <CloseIcon onClick={() => setShowProfile(false)} style={{ cursor: "pointer" }} />
            <div className="showprofile-image-div">
                <div className='showprofile-image'>
                    <Avatar src={info.image ? userImages(info.image) : ""} alt="profile" style={{ width: "200px", height: "200px" }} />
                    {

                        info._id === checkRef.current &&
                        <>
                            <input type="file" id="update-profile" style={{ display: "none" }} accept='.png, .jpeg, .jpg' onChange={uploadImage} />
                            <label htmlFor="update-profile">
                                <AiOutlineEdit className='profile-edit-icon' />
                            </label>
                        </>
                    }
                </div>
                <h3>{info?.name}</h3>
            </div>
            <div className="showprofile-detail">
                <h4>About and Phone Number</h4>
                <p>{info?.about === null ? "_" : info?.about}</p>
                <p>{info?.number}</p>
            </div>

            {
                info?._id !== loginUser._id &&
                <div className='showprofile-remove'>
                    <span onClick={removeFriend}> Remove Friend </span>
                </div>
            }
        </div>
    )
};

export default ShowProfile;

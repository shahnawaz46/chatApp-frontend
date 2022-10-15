import React, { useRef } from 'react';
import './ShowProfile.css';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { AiOutlineEdit } from 'react-icons/ai';
import { AxiosInstance } from '../../axios/AxiosInstance';
import { useStore } from '../../context/Context';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const ShowProfile = ({ setShowProfile, info }) => {
    const navigate = useNavigate()

    const { state: { socket, loginUser }, dispatch } = useStore()

    const checkRef = useRef(localStorage.getItem("chat_user"))

    const uploadImage = async (e) => {
        const formData = new FormData()
        formData.append('file', e.target.files[0])
        formData.append("upload_preset", "profile-images")

        const res = await fetch("https://api.cloudinary.com/v1_1/dpzikxpfn/image/upload", {
            method: "POST",
            body: formData
        })

        const data = await res.json()

        const backendRes = await AxiosInstance.post("/api/user/profile/update", { _id: checkRef.current, imageUrl: data.secure_url })

        dispatch({ type: 'UPDATE_USER', payload: backendRes.data.updatedUser })
    }

    const removeFriend = () => {
        socket.emit("remove_friend", { loginId: loginUser._id, removerId: info._id })

        setShowProfile(false)

        navigate("/", { replace: true })
        return
    }

    const editStatusFnc = () => {
        Swal.fire({
            title: "New Status",
            input: "text",
            confirmButtonText: "save",
            showCancelButton: true,
            cancelButtonText: "cancel",
            inputValidator: (value) => {
                if (!value) {
                    return "field cannot be empty"
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await AxiosInstance.post('/api/user/status/update', { _id: checkRef.current, status: result.value })
                dispatch({ type: 'UPDATE_USER', payload: res.data.updatedUser })
            }
        })
    }

    // console.log(checkRef);
    return (
        <div className="showprofile-div2">
            <CloseIcon onClick={() => setShowProfile(false)} style={{ cursor: "pointer" }} />
            <div className="showprofile-image-div">
                <div className='showprofile-image'>
                    <Avatar src={info.image && info.image} alt="profile" style={{ width: "200px", height: "200px" }} />
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
                <div className='showprofile-status'>
                    <p>{info?.about === null ? "_" : info?.about}</p>
                    {
                        info?._id === loginUser._id &&
                        <AiOutlineEdit className='edit-icon' onClick={editStatusFnc} />
                    }
                </div>
                <div className='showprofile-number'>
                    <p>{info?.number}</p>
                </div>
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

import React, { useEffect } from 'react';
import './ShowProfile.css';
import { useStore } from '../../context/Context';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { AiOutlineEdit } from 'react-icons/ai';
import { AxiosInstance, userImages } from '../../axios/AxiosInstance';


const ShowProfile = ({ showProfileFnc, userDetail }) => {
    const { state: { loginUser, socket }, dispatch } = useStore()

    const uploadProfileImage = async (e) => {
        const form = new FormData()

        form.append("_id", userDetail._id)
        form.append("profileImage", e.target.files[0])

        try {
            const res = await AxiosInstance.post('/api/user/profile/update', form)
            dispatch({ type: "LOGIN_USER", payload: res.data.user })

            socket.emit("upload_image", loginUser._id)


        } catch (error) {
            error.response &&
                console.log(error.response.data)
        }
    }

    useEffect(() => {
        console.log("showProfile useEffect()");
    }, [])

    return (
        <div className="showprofile-div2">
            <CloseIcon onClick={() => showProfileFnc(false)} />
            <div className="showprofile-image-div">
                <div className='showprofile-image'>
                    <Avatar src={userDetail.image && userImages(userDetail.image)} alt="No Images" style={{ width: "200px", height: "200px" }} />
                    {
                        userDetail._id === loginUser._id &&
                        <>
                            <AiOutlineEdit className='profile-edit-icon' />
                            <input type="file" accept='.png, .jpeg, .jpg' className='profile-edit-icon input-size' onChange={uploadProfileImage} />
                        </>
                    }
                </div>
                <h3>{userDetail.name}</h3>
            </div>
            <div className="showprofile-detail">
                <h4>About and Phone Number</h4>
                <p>{userDetail.about}</p>
                <p>+91 {userDetail.number}</p>
                {/* <p>I am here guys</p> */}
            </div>
        </div>
    )
};

export default ShowProfile;

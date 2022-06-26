import React, { useEffect } from 'react';
import './ShowProfile.css';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { AiOutlineEdit } from 'react-icons/ai';


const ShowProfile = ({ setShowProfile, info }) => {

    return (
        <div className="showprofile-div2">
            <CloseIcon onClick={() => setShowProfile(false)} style={{ cursor: "pointer" }} />
            <div className="showprofile-image-div">
                <div className='showprofile-image'>
                    <Avatar src="" alt="No Images" style={{ width: "200px", height: "200px" }} />
                    {
                        <>
                            <AiOutlineEdit className='profile-edit-icon' />
                            <input type="file" accept='.png, .jpeg, .jpg' className='profile-edit-icon input-size' />
                        </>
                    }
                </div>
                <h3>{info?.name}</h3>
            </div>
            <div className="showprofile-detail">
                <h4>About and Phone Number</h4>
                <p>{info?.about === null ? "_" : info?.about}</p>
                <p>{info?.number}</p>
                {/* <p>I am here guys</p> */}
            </div>
        </div>
    )
};

export default ShowProfile;

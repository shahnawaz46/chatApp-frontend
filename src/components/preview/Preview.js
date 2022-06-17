import React from 'react'
import './Preview.css';
import CloseIcon from '@mui/icons-material/Close';

const Preview = ({ image, setImage, sendMessage }) => {

    return (
        <div className="preview-main-div">
            <div className="preview-image-div">
                <div style={{ width: '100%', "marginBottom": '10px' }}>
                    <CloseIcon onClick={() => setImage(false)} style={{ color: 'white', cursor: 'pointer' }} />
                </div>
                <img src={image?.url} alt="" className='preview-image' />
                <button onClick={sendMessage} className='preview-button'>Send</button>
            </div>
        </div>
    )
}

export default Preview
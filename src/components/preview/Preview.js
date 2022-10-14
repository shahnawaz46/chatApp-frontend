import React, { useState } from 'react'
import './Preview.css';
import PreviewLoading from '../../gif_loader/send_loader_1.gif'

const Preview = ({ showImage, setShowImage, setPreviewImage, storeImageInCloudinary }) => {
    const [previewLoading, setPreviewLoading] = useState(false)

    const cancelButtonPres = () => {
        setPreviewImage(false)
        setShowImage(null)
    }

    const storeImage = () => {
        setPreviewLoading(true)
        storeImageInCloudinary()
    }

    return (
        <div className="preview-main-div">
            <div className="preview-image-div">
                {
                    previewLoading &&
                    <div className='preview-loading' id='preview-loader'>
                        <img src={PreviewLoading} alt="preview-loading" style={{width:'80px'}} />
                    </div>
                }
                <img src={URL.createObjectURL(showImage)} alt="" className='preview-image' />
                <div className='preview-buttons-div'>
                    <button onClick={cancelButtonPres} className='preview-button'>Cancel</button>
                    <button onClick={storeImage} className='preview-button'>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Preview
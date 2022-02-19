import React from 'react';
import './Message.css';

const Message = ({ owner, message, time, media }) => {
    // console.log("media", media);
    return (
        <div className={`message-body ${owner}`}>
            {
                media && <img src={media.url} alt="" style={{ width: '120px' }} />
            }

            {
                message &&
                <p className={`message ${owner}`}>
                    {message}
                </p>
            }
            <span className='message-time'>{time}</span>
        </div>
    );
};

export default Message;

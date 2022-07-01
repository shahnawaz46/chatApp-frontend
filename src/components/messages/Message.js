import React from 'react';
import './Message.css';
import { format } from 'timeago.js'
import { BsCheck, BsCheckAll } from 'react-icons/bs';

const Message = ({ owner, message, time, media, readBy }) => {
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
            <div className='message-time-tick'>
                <div className='message-time'>{format(time)}</div>
                <div className={`tick ${owner}`}>{readBy ? <BsCheckAll /> : <BsCheck />}</div>
            </div>
        </div>
    );
};

export default Message;

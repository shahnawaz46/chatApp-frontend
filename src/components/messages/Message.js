import React from 'react';
import './Message.css';
import { format } from 'timeago.js'
import { BsCheck, BsCheckAll } from 'react-icons/bs';


const Message = (props) => {
    const { owner, msgDetail: { messageId, mediaURL, message, time, receiverSeen, senderId, receiverId }, rightClickForShowMenu } = props

    return (
        <div className={`message-body ${owner}`}>
            {
                mediaURL &&
                <a href={mediaURL} download="file" target="_blank" className='message-anchor-tag'>
                    <img src={mediaURL} alt="media" className='message-media' onContextMenu={(e) => rightClickForShowMenu(e, { messageId, receiverId, senderId })} />
                </a>
            }

            {
                message &&
                <div className={`message ${owner}`} onContextMenu={(e) => rightClickForShowMenu(e, { messageId, receiverId, senderId })}>
                    <p>{message}</p>

                    {/* <FiChevronDown style={{ marginLeft: '5px', overflow: "visible" }} onClick={deleteMessage} /> */}

                </div>
            }
            <div className='message-time-tick'>
                <div className='message-time'>{format(time)}</div>
                <div className={`tick ${owner}`}>{receiverSeen ? <BsCheckAll /> : <BsCheck />}</div>
            </div>
        </div>
    );
};

export default Message;

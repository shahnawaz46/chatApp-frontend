import React,{useState} from 'react';
import './Message.css';
import { format } from 'timeago.js'
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import {FiChevronDown} from 'react-icons/fi';

const Message = ({ owner, message, time, media, readBy }) => {
    // console.log("media", media);
    const [deleteMessageMenu, setDeleteMessageMenu] = useState(false)

    const deleteMessage = (e) =>{
        console.log("click");
    }

    return (
        <div className={`message-body ${owner}`}>
            {
                media && <img src={media.url} alt="media" style={{ width: '120px' }} />
            }

            {
                message &&
                <div className={`message ${owner}`} onMouseEnter={()=>setDeleteMessageMenu(true)} onMouseLeave={()=>setDeleteMessageMenu(false)}>
                    <p>{message}</p>
                    {
                        deleteMessageMenu && <FiChevronDown style={{marginLeft:'5px', overflow:"visible"}} onClick={deleteMessage} />
                    }
                </div>
            }
            <div className='message-time-tick'>
                <div className='message-time'>{format(time)}</div>
                <div className={`tick ${owner}`}>{readBy ? <BsCheckAll /> : <BsCheck />}</div>
            </div>
        </div>
    );
};

export default Message;

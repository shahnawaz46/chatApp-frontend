import React, { useEffect } from 'react';
import Header from '../header/Header';
import AllUser from '../all_users/AllUsers';
import { useParams } from 'react-router-dom';
import { useStore } from '../../context/Context';
import loader from '../../gif_loader/loader_3.gif'

const Home = ({ children }) => {
    const { userName } = useParams()
    const { state: { socket, loginUser, allMessages } } = useStore()

    // this useEffect will invoked and call online_user event when user refresh the page
    // and i will get login user data 
    useEffect(() => {
        if (socket && Object.keys(loginUser).length === 0) {
            const userId = sessionStorage.getItem("chat_user")
            socket.emit("online_user", userId)

            socket.emit("retrieve_message", userId)
        }
    }, [socket])

    return (
        <>

            {
                Object.keys(loginUser).length === 0 ?
                    <>
                        {/* <div style={{ width: "100%", height: "0", paddingBottom: "100%", position: "relative" }}>
                   <iframe src="https://giphy.com/embed/xTkcEQACH24SMPxIQg" width="100%" height="100%" style={{ position: "absolute" }} frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
               </div> */}
                        <img src={loader} alt="loader" style={{ position: 'absolute', top: '50%', left: '50%', transform: "translate(-50%,-50%)" }} />
                    </>
                    :
                    <>
                        <Header />
                        <div style={{ display: "flex" }}>
                            <AllUser userName={userName} />
                            {children}
                        </div>
                    </>
            }
        </>
    )
}

export default Home

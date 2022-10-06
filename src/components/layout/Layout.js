import React, { useEffect } from 'react';
import Header from '../header/Header';
import AllUser from '../all_users/AllUsers';
import { useParams } from 'react-router-dom';
import { useStore } from '../../context/Context';
import loader from '../../gif_loader/loader_3.gif'

const Home = ({ children }) => {
    const { userName } = useParams()
    const { state: { socket, loginUser } } = useStore()


    // this useEffect will invoked and call online_user event when user refresh the page
    // and i will get login user data 
    useEffect(() => {
        if (socket && Object.keys(loginUser).length === 0) {
            console.log("layout online_user event");
            const userId = localStorage.getItem("chat_user")
            socket.emit("online_user", userId)

            socket.emit("retrieve_message", userId)
        }
    }, [socket])

    // console.log("Layout comp");

    return (
        <>

            {
                Object.keys(loginUser).length === 0 ?
                    <img src={loader} alt="loader" style={{ position: 'absolute', top: '50%', left: '50%', transform: "translate(-50%,-50%)" }} />
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

export default React.memo(Home)

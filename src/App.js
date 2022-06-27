import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';
import OtpVerification from './components/authentication/OtpVerification';
import InitialMessageSection from './components/InitialMessageSection';
import MessageSection from './components/message_section/MessageSection';
import ProtectedRoute from './components/ProtectedRoute';
import { useStore } from './context/Context';


import io from 'socket.io-client'
const url = 'https://chatapp-server-nodejs.herokuapp.com'
// const url = 'http://localhost:9000'
const socket = io(url)


function App() {
  const { dispatch } = useStore()

  useEffect(() => {
    dispatch({ type: "SOCKET_CONNECTION", payload: socket })
  }, [])

  useEffect(() => {

    socket.on("user_online", (updatedUser) => {
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
    })

    socket.on("friend_request_receive", (updatedUser) => {
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
    })

    socket.on("request_accepted", (updatedUser) => {
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
    })

    socket.on("you_accept_request", (updatedUser) => {
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
    })

    socket.on("friend_remove", ({ updatedUser, key }) => {
      dispatch({ type: 'FRIEND_REMOVE', payload: { updatedUser, key } })
    })

    socket.on("receive_message", ({ key, msg }) => {
      dispatch({ type: 'MESSAGES', payload: { key, msg } })
    })

    socket.on("retrieve_message_client", (messagesObj) => {
      dispatch({ type: 'FETCH_MESSAGE', payload: messagesObj })
    })

  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <InitialMessageSection />
          </ProtectedRoute>
        }
        />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/otp/verification' element={<OtpVerification />} />
        <Route path="/user=:userName" element={<MessageSection />} />
      </Routes>
    </>
  );
}

export default App;

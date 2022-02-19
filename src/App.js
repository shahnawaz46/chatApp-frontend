import React, { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useStore } from './context/Context';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import InitialMessageSection from './components/InitialMessageSection';
import MessageSection from './components/message_section/MessageSection';
import OtpVerification from './components/opt_verification/OtpVerification';
import { createBrowserHistory } from 'history';

// const Home = React.lazy(() => import('./components/Home'));
// const MessageSection = React.lazy(() => import('./components/message_section/MessageSection'))

const socket = io('https://chatapp-server-nodejs.herokuapp.com')
// const socket = io('http://localhost:9000')

function App() {
  const selectedUserRef = useRef()
  const checkMessageRef = useRef()
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const history = createBrowserHistory()

  const sortNames = (senderName, receiverName) => {
    return [senderName, receiverName].sort().join("-")
  }

  useEffect(() => {
    dispatch({ type: "SOCKET_CONNECTION", payload: socket })

    socket.on("all_connected_users", (user) => {
      dispatch({ type: "ALL_USERS", payload: user })
    })

    socket.on("new_message", (data) => {
      const key = sortNames(data.senderName, data.receiverName)

      if (selectedUserRef.current === data.senderName) {
        data.isSeen = true
      }
      // console.log("new message");
      if (key in checkMessageRef.current) {
        dispatch({ type: "PUSH_MESSAGE", payload: { key, data } })

      } else {
        dispatch({ type: "ADD_MESSAGE", payload: { key, data } })
      }

    })
  }, [])

  // console.log(state.allMessages);

  useEffect(() => {
    checkMessageRef.current = state.allMessages

  }, [state.allMessages])

  useEffect(() => {
    if (Object.keys(state.selectedUser).length > 0)
      selectedUserRef.current = state.selectedUser.name

    else if (Object.keys(state.selectedUser).length === 0)
      selectedUserRef.current = null


  }, [state.selectedUser])

  useEffect(() => {
    if (!state.isOnline) {
      const _id = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))._id : null
      socket.emit("all_online_users", _id)
    }

    if (localStorage.getItem("user")) {
      dispatch({ type: "LOGIN_USER", payload: JSON.parse(localStorage.getItem("user")) })
    }

    console.log("app useEffect()");
  }, [])

  return (
    <>
      {/* <React.Suspense fallback={<div style={{ position: "fixed", top: '50%', left: '50%' }}>Loading...</div>} > */}
      < Routes >
        <Route path="/" element={<InitialMessageSection />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/otp/verification' element={<OtpVerification />} />
        <Route path="/myaccount/user=:userName" element={<MessageSection />} />
      </Routes >
      {/* </React.Suspense> */}
    </>
  );
}

export default App;

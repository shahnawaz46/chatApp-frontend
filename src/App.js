import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';
import OtpVerification from './components/authentication/OtpVerification';
import InitialMessageSection from './components/InitialMessageSection';
import MessageSection from './components/message_section/MessageSection';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

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
        <Route path="/myaccount/user=:userName" element={<MessageSection />} />
      </Routes>
    </>
  );
}

export default App;

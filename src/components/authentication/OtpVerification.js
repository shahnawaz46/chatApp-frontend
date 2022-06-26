import React, { useState } from 'react';
import './OtpVerification.css'
import ShowError from '../show_error/ShowError';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AxiosInstance } from '../../axios/AxiosInstance';
import { useStore } from '../../context/Context';

const OtpVerification = () => {
    const { state: { socket } } = useStore()
    const { state } = useLocation()
    const navigate = useNavigate()

    const [otp, setOtp] = useState({})
    const [error, setError] = useState(null)

    // console.log(state);
    const optHanlde = async (e) => {
        e.preventDefault()

        const allOtp = otp.otp1 + otp.otp2 + otp.otp3 + otp.otp4

        if (allOtp.length !== 4)
            setError("OTP is missing")

        else {

            const userInfo = { otp: allOtp, userId: state ? state.userId : "" }

            try {
                const res = await AxiosInstance.post("/api/user/otp/verification", userInfo)

                sessionStorage.setItem("chat_user", res.data.userId)

                socket.emit("online_user", res.data.userId)

                navigate("/", { replace: true })

            } catch (err) {
                err.response &&
                    setError(err.response.data.error)
            }
        }
    }

    const setOtpFnc = (e, index) => {
        if (e.key === " ")
            return

        else if (e.key === "Backspace")
            if (index === 0)
                return

            else if (otp[e.target.name])
                delete otp[e.target.name]

            else
                e.target.form.elements[index - 1].focus()

        else {
            setOtp({ ...otp, [e.target.name]: e.key })
            e.target.form.elements[index + 1].focus()
        }
    }

    if (sessionStorage.getItem("chat_user"))
        return <Navigate to={"/"} replace />

    return (
        <>
            <div className='otpverification-main-div'>
                <div className="otpverification-content-image">
                    <h2>Email Verification</h2>
                    <img src='/email.png' alt="global talk" className='otpverification-image' />
                    <p>
                        Please Enter the 4 Digit Code Sent to Your Mail
                    </p>
                </div>
                <form className='optverification-form' onSubmit={optHanlde}>
                    <input type="text" maxLength={1} name="otp1" required onKeyUp={(e) => setOtpFnc(e, 0)} />
                    <input type="text" maxLength={1} name="otp2" required onKeyUp={(e) => setOtpFnc(e, 1)} />
                    <input type="text" maxLength={1} name="otp3" required onKeyUp={(e) => setOtpFnc(e, 2)} />
                    <input type="text" maxLength={1} name="otp4" required onKeyUp={(e) => setOtpFnc(e, 3)} />
                    <div>
                        <button className='otpverification-button'>Verify</button>
                    </div>
                </form>
            </div>

            {
                error &&
                <ShowError error={error} setError={setError} />
            }
        </>
    );
};

export default OtpVerification;

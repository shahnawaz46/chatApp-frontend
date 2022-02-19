import React, { useState } from 'react';
import './OtpVerification.css';
import { AxiosInstance } from '../../axios/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/Context';
import ShowError from '../show_error/ShowError';

const OtpVerification = () => {
    const [otp, setOtp] = useState({})

    const [error, setError] = useState(null)

    const { state: { socket }, dispatch } = useStore()
    const navigate = useNavigate()

    const optHandle = async (e) => {
        e.preventDefault()

        const allOtp = otp.otp1 + otp.otp2 + otp.otp3 + otp.otp4
        if (allOtp.length !== 4)
            setError('Otp is Missing')

        try {
            const _id = JSON.parse(localStorage.getItem("userId"))
            const data = {
                otp: allOtp,
                userId: _id
            }

            const res = await AxiosInstance.post('/api/user/otp/verification', data)
            console.log(res.data.user);

            dispatch({ type: "LOGIN_USER", payload: res.data.user })
            socket.emit("user_login", res.data.user._id)

            localStorage.setItem("user", JSON.stringify(res.data.user))

            navigate('/', { replace: true })
            return null

        } catch (error) {
            error.response &&
                setError(error.response.data.error)
        }
    }

    const inputHandle = (e, index) => {
        if (e.key === ' ') {
            return

        } else if (e.key === 'Backspace') {
            if (index === 0)
                return

            else if (otp[e.target.name])
                delete otp[e.target.name]

            else
                e.target.form.elements[index - 1].focus()

        } else {
            // console.log("else", [e.target.name], e.target.value);
            setOtp({ ...otp, [e.target.name]: e.target.value })
            e.target.form.elements[index + 1].focus()
        }
    }

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
                <form onSubmit={optHandle} className='optverification-form'>
                    <input type="text" maxLength={1} name="otp1" required onKeyUp={(e) => inputHandle(e, 0)} />
                    <input type="text" maxLength={1} name="otp2" required onKeyUp={(e) => inputHandle(e, 1)} />
                    <input type="text" maxLength={1} name="otp3" required onKeyUp={(e) => inputHandle(e, 2)} />
                    <input type="text" maxLength={1} name="otp4" required onKeyUp={(e) => inputHandle(e, 3)} />
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

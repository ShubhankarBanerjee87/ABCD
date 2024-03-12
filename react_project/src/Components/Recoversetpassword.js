import React, { useEffect, useState } from "react";
import "../CSS/Setpassword.css"
import logo from '../Images/yourCryptoLogo-removebg-preview.png';
import Back from '../Images/87-875958_back-arrow-in-circle-symbol-removebg-preview.png'
import { useNavigate } from "react-router-dom";

function Recoversetpassword() {
    const [password, setPassword] = useState('');
    const [confirPassword, setConfirmPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [showError, setShowError] = useState(false);
    const[isPasswordSaved, setIsPasswordSaved] = useState(false);
    const [isValidLength, setIsValidLength] = useState(false);
    const [haveUpperCase, setHaveUpperCase] = useState(false);
    const [haveLowerCase, setHaveLowerCase] = useState(false);
    const [hasSpecialCharacter, setHasSpecialCharacter] = useState(false);
    const [haveDigit, setHaveDigit] = useState(false);




    const navigate = useNavigate();

    useEffect(() => {
    }, [])


    function getBack() {
        navigate("/recover/recover-passphrase")
    }

    function getNext() {
        console.log(password);
        console.log(confirPassword);

        if(password === '')
        {
            setIsValidPassword(false);
        }

        else if (password === confirPassword && isValidPassword) {
            SaveToLocalStorage();

            setIsPasswordSaved(true);
            // Simulate sliding back after 3 seconds
            setTimeout(() => {
                setIsPasswordSaved(false);
            }, 3000);

            // Simulate navigating to a new page after 5 seconds
            setTimeout(() => {
                navigate('/recover/choose-network');
            }, 4000);


        }
        else {
            setShowError(true);

            setTimeout(() => {
                setShowError(false);
            }, 2000);
        }
    }

    function SaveToLocalStorage() {
        const PasswordDetails = {
            Password: password
        };
        localStorage.setItem('PasswordDetails', JSON.stringify(PasswordDetails));
    }

    const handlePasswordChange = (event) => {
        setIsValidPassword(false)
        const newPassword = event.target.value;
        setPassword(newPassword);
        console.log(password);

        // Check if the new password meets the criteria
        const isValid = validatePassword(newPassword);
        setIsValidPassword(isValid);

        console.log(isValidPassword);

        if (isValid) {
            setIsDisabled(false);
        }

    };


    const handleConfirmPasswordChange = (event) => {
        const newPassword = event.target.value;
        setConfirmPassword(newPassword);
        console.log(confirPassword)
    };


    const validatePassword = (password) => {
        // Define your password criteria here
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

        // Check if all criteria are met
        if (password.length >= minLength) {
            setIsValidLength(true);
        }
        else {
            setIsValidLength(false);
        }
        if (hasUpperCase) {
            setHaveUpperCase(true);
        }
        else {
            setHaveUpperCase(false);
        }
        if (hasLowerCase) {
            setHaveLowerCase(true);
        }
        else {
            setHaveLowerCase(false);
        }
        if (hasSpecialChar) {
            setHasSpecialCharacter(true);
        }
        else {
            setHasSpecialCharacter(false)
        }

        if (hasDigit) {
            setHaveDigit(true);
        }
        else {
            setHaveDigit(false)
        }


        return (
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasDigit &&
            hasSpecialChar
        );
    };


    return (
        <div>
            <div id="notification-box" className={`notification-box ${isPasswordSaved ? 'slide-in opacity' : 'slide-out '}`}>
                <p>Password Saved Successfully</p>
            </div>
            <div className="setPassword-backcard">
                <div><button type="button" className="create-backButton" onClick={getBack} ><img src={Back} alt="back" className="create-backButton" /></button>
                    <div className="progress-bar">
                        <div id="1" className="progress "></div>
                        <div id="2" className="progress progress-on"></div>
                        <div id="3" className="progress "></div>
                    </div>
                </div>

                <div className="logo center-align">
                    <img src={logo} alt='Wallet' className="logoImage policy-tab" />
                </div>

                <div><h2 className="create-center-align">Set Your Password</h2>
                    <div className="password-block">
                        <div className="info-block">
                            <p>Set a password to unlock your wallet each time you use your computer. It can't be used to recover your account</p>
                        </div>
                        <div className="setPassword password-flex ">
                            <label for="password" className=""><b> Password</b></label>
                            <input type="password" value={password} onChange={handlePasswordChange} id="password" className={`password-box center-align`}></input>
                            <ul className={`${isValidPassword ? 'display-none' : ''}`}>
                                <li className={`${isValidLength ? 'display-green' : 'display-red'} font-small`}>Password should contain atleast 8 characters</li>
                                <li className={`${haveUpperCase ? 'display-green' : 'display-red'} font-small`}>Must have atleast 1 capital[A-Z] letter</li>
                                <li className={`${haveLowerCase ? 'display-green' : 'display-red'} font-small`}>Must have atleast 1 lower case[a-z] letter</li>
                                <li className={`${haveDigit ? 'display-green' : 'display-red'} font-small`}>Must contain a digit(0-9)</li>
                                <li className={`${hasSpecialCharacter ? 'display-green' : 'display-red'} font-small`}>Must contain one special character *, @, ?, etc.</li>
                            </ul>
                        </div>
                        <div className="confirmPassword password-flex mt-5">
                            <label for="confirm-password" className=""><b>Verify Password</b></label>
                            <input type="password" value={confirPassword} onChange={handleConfirmPasswordChange} id="confirm-password" className="password-box center-align" disabled={isDisabled}></input>
                            <div className={`${!showError ? 'display-none' : ''} display-red`}>Password not verified</div>
                        </div>
                    </div>
                    <div className="down-buttons">
                        <button type='button' className="btn btn-primary bttn" onClick={getNext} >Next</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Recoversetpassword;
import React, { useState } from "react";
import "../CSS/Recover.css"
import Back from '../Images/87-875958_back-arrow-in-circle-symbol-removebg-preview.png'
import logo from '../Images/yourCryptoLogo-removebg-preview.png';

import { useNavigate } from "react-router-dom";

function Recover() {

    const [formData, setFormData] = useState(Array(12).fill('')); // Initialize an array with 12 empty strings
    const [showRecoverError, setShowRecoverError] = useState(false);
    const [showInputBlankError, setShowInputBlankError] = useState(false);

    const [isRecovered, setIsRecovered] = useState(false);

    const handleChange = (id, value) => {
        const updatedFormData = [...formData];
        updatedFormData[id - 1] = value;
        setFormData(updatedFormData);
    }

    const navigate = useNavigate();

    function getBack() {
        navigate("/ReactWallet")
    }

    function Clear() {
        setFormData(Array(12).fill(''))
    }

    const RecoverAccount = () => {
        const isAnyFieldEmpty = formData.some(value => value.trim() === '');
        if (isAnyFieldEmpty) {
            InputBlankError();
        }

        const combinedString = formData.join(' ');
        // setPassPhrase(combinedString);

        { getAccount(combinedString) }
    }

    function getAccount(passPhrase) {
        // const passPhrase = PassPhrase;
        console.log(passPhrase)
        const url = `http://localhost:3000/account/mnemonic?Mnemonic=${passPhrase}`
        fetch(url, {
            method: 'POST'
        }).then(response => response.json())
            .then(data => {
                console.log(data);

                if (data.message === "Success") {
                    accountRecovered(data.Mnemonic, data.PrivateKey, data.Address);
                }

                else {
                    accountRecoverError();
                }
                // { SaveToLocalStorage(data.Mnemonic, data.PrivateKey, data.Address) }
            });

    }

    const accountRecovered = (mnemonic, privateKey, address) => {
        SaveToLocalStorage(mnemonic, privateKey, address)

        setIsRecovered(true);

        // Simulate sliding back after 3 seconds
        setTimeout(() => {
            setIsRecovered(false);
        }, 3000);

        // Simulate navigating to a new page after 5 seconds
        setTimeout(() => {
            navigate('/recover/set-password');
        }, 4000);
    }

    const accountRecoverError = () => {
        setShowRecoverError(true);

        // Simulate sliding back after 3 seconds
        const timeoutId =setTimeout(() => {
            setShowRecoverError(false);
        }, 3000);

        // Simulate navigating to a new page after 5 seconds
        setTimeout(() => {
            Clear();
        }, 4000);

    }

    const InputBlankError = () => {
        setShowInputBlankError(true);

        // Simulate sliding back after 3 seconds
        setTimeout(() => {
            setShowInputBlankError(false);
        }, 3000);

    }

    function SaveToLocalStorage(Phrase, Privatekey, Address) {
        const AccountDetails = [{
            AccountName: "Account 0",
            Mnemonic: Phrase,
            PrivateKey: Privatekey,
            Address: Address
        }];

        console.log(AccountDetails)
        localStorage.setItem('AccountDetails', JSON.stringify(AccountDetails));
    }


    return (
        <div>
            <div id="recover-confirm-notification-box" className={`recover-confirm-notification-box ${isRecovered ? 'slide-in opacity' : 'slide-out '}`}>
                <p>Account Recovered: Passphrase correct</p>
            </div>

            <div id="recover-error-notification-box" className={`recover-error-notification-box ${showRecoverError ? 'slide-in opacity' : 'slide-out '}`}>
                <p>Failed to Recover Account</p>
            </div>

            <div id="notification-box" className={`error-notification-box ${showInputBlankError ? 'slide-in opacity' : 'slide-out '}`}>
                <p>Please fill all the boxes</p>
            </div>

            <div className="create-backcard">
                <div><button type="button" className="create-backButton" onClick={getBack} ><img src={Back} alt="back" className="create-backButton" /></button>
                    <div className="progress-bar">
                        <div id="1" className="progress progress-on"></div>
                        <div id="2" className="progress "></div>
                        <div id="3" className="progress "></div>
                    </div>
                </div>
                <div className="logo center-align">
                    <img src={logo} alt='Wallet' className="logoImage policy-tab" />
                </div>

                <div className="create-top-align"><h2 className="create-center-align">Recover Your Wallet</h2>
                    <div className="your-passphrase">

                        <p>Please provide your passphrase in the sequential order that you recorded during account creation.</p>
                        <h6>Your passphrase</h6>
                    </div>
                    <div className="wrapper">
                        {Array.from({ length: 12 }, (_, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    className="phrase-input"
                                    required
                                    id={index + 1}
                                    value={formData[index]}
                                    onChange={(e) => handleChange(index + 1, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="recover-down-buttons">
                        <button type='button' className="btn btn-primary recover-bttn" onClick={RecoverAccount} >Recover</button><br />
                        <button type='button' className="btn btn-primary recover-bttn" onClick={Clear}>Clear</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Recover;
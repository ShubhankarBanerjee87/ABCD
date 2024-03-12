import React, { useEffect, useState } from "react";
import "../CSS/Confirmpassphrase.css"
import logo from '../Images/yourCryptoLogo-removebg-preview.png';

import Back from '../Images/87-875958_back-arrow-in-circle-symbol-removebg-preview.png'
import { useNavigate } from "react-router-dom";

function Confirmpassphrase() {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showError, setShowError] = useState(false);
   

    const [allWords, setAllWords] = useState([]);

    const [Phrase, setPhrase] = useState(Array(12).fill(''));

    const [updatePhrase, setUpdatePhrase] = useState(Array(12).fill(''));

    const [randomNumbers, setRandomNumbers] = useState([]);

    const missingWordCount = 4; // Adjust the number of missing words

    const navigate = useNavigate();

    useEffect(() => {
        RetrieveMnemonic();

        generateRandomNumbers();

    }, [])

    useEffect(() => {
        if (randomNumbers.length === missingWordCount) {
            generatePassPhraseToVerify();
        }

    }, [randomNumbers]);


    const generateRandomNumbers = () => {
        const maxAttempts = 50;
        const uniqueRandomNumbers = [];

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const randomNumber = Math.floor(Math.random() * 12) + 1;

            // Check if the generated number is unique
            if (!uniqueRandomNumbers.includes(randomNumber)) {
                uniqueRandomNumbers.push(randomNumber);
            }

            // If we have generated 4 unique numbers, break out of the loop
            if (uniqueRandomNumbers.length === missingWordCount) {
                setRandomNumbers(uniqueRandomNumbers);
                return;
            }

        }
    }

    const isDisabledInput = (id) => {
        if (!(randomNumbers.includes(id))) {
            return true;
        }
        else {
            return false
        }
    }

    const generatePassPhraseToVerify = () => {
        for (let i = 1; i <= 12; i++) {
            if (!(randomNumbers.includes(i))) {
                handleChange(i, allWords[i - 1]);
            }
        }
    }

    const handleChange = (id, value) => {
        setPhrase(prevPhrase => {
            const updatedFormData = [...prevPhrase];
            updatedFormData[id - 1] = value;

            setUpdatePhrase(updatedFormData);
            return updatedFormData;
        });
    }

    function getBack() {
        navigate("/create/pass-phase")
    }

    function RetrieveMnemonic() {
        const Account = JSON.parse(localStorage.getItem('AccountDetails'));
        console.log(Account)
        if (Account) {
            let mnemonic = Account[0].Mnemonic;
            console.log()

            const arr = mnemonic.split(' ');


            setAllWords(arr);
            return
        }
    }


    function getNext() {
        
        const isAnyFieldEmpty = Phrase.some(value => value.trim() === '');
        if (isAnyFieldEmpty) {
            alert("fill all the input boxes")
            return;
        }

        if (checkPassPhrase()) {

            setIsConfirmed(true);

            SaveActiveNetworkToLocalStorage();
            SaveSession();
            ActiveAccount();
            SaveAccountIndex();

            setTimeout(() => {
                setIsConfirmed(false);
            }, 3000);

            // Simulate navigating to a new page after 5 seconds
            setTimeout(() => {
                navigate('/wallet');
            }, 4000);

        }
        else {
            setShowError(true);

            setTimeout(() => {
                setShowError(false);
            }, 3000);


        }
    }

    const checkPassPhrase = () => {
        for (let i = 0; i < Phrase.length; i++) {
            console.log("Inside the loop")
            if (!(Phrase[i] === allWords[i])) {
                console.log(`${i} not matched......`)

                return false
            }
            console.log(`${i} matched`)
        }
        return true;
    }
    

    function SaveActiveNetworkToLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('NetworkDetails'));

        if (Network) {
            let activeNetwork = {
                NetworkName : Network[0].NetworkName,
                Network : Network[0].Network,
                RPC_URL: Network[0].RPC_URL,
                Chain_ID: Network[0].Chain_ID,
                Currency: Network[0].Currency
            }

            localStorage.setItem('ActiveNetwork', JSON.stringify(activeNetwork));
        }
    }

    function SaveSession() {
        localStorage.setItem("isActive",true);
    }

    function ActiveAccount() {
        const Account = JSON.parse(localStorage.getItem('AccountDetails'));
        if(Account){
            localStorage.setItem("ActiveAccount",JSON.stringify(Account[0]));
        }
    }

    function SaveAccountIndex() {
        let AccountIndex = {
            index : 0
        }
        localStorage.setItem("AccountIndex",JSON.stringify(AccountIndex));
    }





    return (
        <div>
            <div id="confirm-notification-box" className={`confirm-notification-box ${isConfirmed ? 'slide-in opacity' : 'slide-out '}`}>
                <p>Passphrase Confirmed</p>
            </div>

            <div id="notification-box" className={`error-notification-box ${showError ? 'slide-in opacity' : 'slide-out '}`}>
                <p>Passphrase Not Confirmed</p>
            </div>



            <div className="create-backcard">
                <div><button type="button" className="create-backButton" onClick={getBack} ><img src={Back} alt="back" className="create-backButton" /></button>
                    <div className="progress-bar">
                        <div id="1" className="progress"></div>
                        <div id="2" className="progress "></div>
                        <div id="3" className="progress "></div>
                        <div id="4" className="progress progress-on"></div>
                    </div>
                </div>

                <div className="logo center-align">
                    <img src={logo} alt='Wallet' className="logoImage policy-tab" />
                </div>

                <div className="create-top-align"><h2 className="create-center-align">Confirm Your Recovery Phrase</h2>
                    <div className="your-passphrase">

                        <p>Please Confirm your passphrase to create your wallet</p>
                        <h6> <b>Confirm passphrase</b></h6>
                    </div>
                    <div className={`wrapper`}>

                        {Phrase.map((item, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    className={`phrase ${isDisabledInput(index + 1) ? "background-color-disabled" : "background-color-notDisabled" }`}
                                    required
                                    id={index + 1}
                                    value={Phrase[index]}
                                    disabled={isDisabledInput(index + 1)}
                                    onChange={(e) => handleChange(index + 1, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="down-buttons">
                        <button type='button' className="btn btn-primary bttn" onClick={getNext}>Next</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Confirmpassphrase;
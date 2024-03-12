import React, { useEffect, useState } from "react";
import copyLogo from '../Images/copy.png'
import { useNavigate } from "react-router-dom";
import closeLogo from '../Images/close.png';
import "../CSS/Windowtoken.css";
import sendLogo from "../Images/send.png"




function Windowtoken() {

    const [Ammout, setAmount] = useState(null);
    const [tokenData, setTokenData] = useState([]);
    const navigate = useNavigate();

    const [activityData, setActivityData] = useState([]);
    const [isActivityActive, setIsActivityActive] = useState(false);

    const [formData, setFormData] = useState({
        receiver: '',
        amount: ''
    });


    const [isTransferring, setIsTransferring] = useState(false);



    useEffect(() => {
        const storedData = localStorage.getItem("TokenDetails");

        if (storedData) {
            const dataArray = JSON.parse(storedData);
            setTokenData(dataArray);
        }

        const activityStoredData = localStorage.getItem("ERC20TokenTransferDetails");

        if (activityStoredData) {
            const dataArray = JSON.parse(activityStoredData);
            setActivityData(dataArray);
        }

        AssignTokenBalance();

    }, [])


    function AssignTokenBalance() {
        let address = RetrieveAccountFromLocalStorage();
        let rpc = RetrieveRPCFromLocalStorage();
        let contractAddress = RetrieveContractAddressFromLocalStorage();
        let contractABI = RetrieveContractAbiFromLocalStorage();
        fetch(`http://localhost:3000/token/balance?RPC=${rpc}&address=${address}&contractAddress=${contractAddress}&contractAbi=${contractABI}`, {
            method: 'POST'
        }).then(response => response.json())
            .then(data => {
                setAmount(data.TokenBalance);
            });
        return;
    }

    function closeWindowTooken() {
        navigate("/wallet")
    }

    function RetrieveContractAddressFromLocalStorage() {
        const index = localStorage.getItem('Index');
        const storedData = localStorage.getItem("TokenDetails");

        if (storedData) {
            const dataArray = JSON.parse(storedData);
            return dataArray[index].Address;
        }
    }

    function RetrieveContractAbiFromLocalStorage() {
        const index = localStorage.getItem('Index');
        const storedData = localStorage.getItem("TokenDetails");

        if (storedData) {
            const dataArray = JSON.parse(storedData);
            return dataArray[index].Abi;
        }
    }

    function RetrieveContractDecimalsFromLocalStorage() {
        const index = localStorage.getItem('Index');
        const storedData = localStorage.getItem("TokenDetails");

        if (storedData) {
            const dataArray = JSON.parse(storedData);
            return dataArray[index].Decimals;
        }
    }

    function RetrieveAccountFromLocalStorage() {
        const Account = JSON.parse(localStorage.getItem('AccountDetails'));

        if (Account) {
            return (
                Account.Address
            )
        }
    }

    function RetrieveNetworkFromLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('NetworkDetails'))

        if (Network) {
            return (
                Network.NetworkName
            )
        }
    }

    function RetrieveRPCFromLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('NetworkDetails'))

        if (Network) {
            return (
                Network.RPC
            )
        }
    }

    function RetrieveSymbolFromLocalStorage() {
        const index = localStorage.getItem('Index');
        const storedData = localStorage.getItem("TokenDetails");

        if (storedData) {
            const dataArray = JSON.parse(storedData);
            return dataArray[index].Symbol;
        }
    }

    function RetrievePrivateKeyFromLocalStorage() {
        const Account = JSON.parse(localStorage.getItem('AccountDetails'));

        if (Account) {
            return (
                Account.PrivateKey
            )
        }
    }


    const closeTransfer = () => {
        const activityStoredData = localStorage.getItem("ERC20TokenTransferDetails");
        AssignTokenBalance();

        if (activityStoredData) {
            const dataArray = JSON.parse(activityStoredData);
            setActivityData(dataArray);
        }

        setIsTransferring(false)
    }

    const TransferToken = () => {
        let rpc = RetrieveRPCFromLocalStorage();
        let receiver = formData.receiver;
        let amount = formData.amount;
        let PrivateKey = RetrievePrivateKeyFromLocalStorage();
        let contract_address = RetrieveContractAddressFromLocalStorage();
        let contract_ABI = RetrieveContractAbiFromLocalStorage();
        let contract_Decimals = RetrieveContractDecimalsFromLocalStorage();

        fetch(`http://localhost:3000/transfer/token?RPC=${rpc}&contractAddress=${contract_address}&contractAbi=${contract_ABI}&Receiver=${receiver}&PrivateKey=${PrivateKey}&Amount=${amount}&Decimals=${contract_Decimals}`, {
            method: 'POST'
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                SaveTransferToLocal(data.TxHash, receiver, amount);
            });
    }


    const SaveTransferToLocal = (txHash, receiver, amount) => {

        const TransferDetails = {
            Receiver: receiver,
            Hash: txHash,
            Ammout: amount,
        }

        const existingData = JSON.parse(localStorage.getItem('ERC20TokenTransferDetails')) || [];

        // Add the new form data to the existing data
        const newData = [...existingData, TransferDetails];

        // Store the updated data back in local storage
        localStorage.setItem('ERC20TokenTransferDetails', JSON.stringify(newData));

        alert(`Transfer Successful`);
        closeTransfer()
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }


    function onCopy() {
        navigator.clipboard.writeText(RetrieveAccountFromLocalStorage())
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch(err => {
                console.error('Error copying to clipboard:', err);
            });
    }

    const SendToken = () => {
        setIsTransferring(true);
        setFormData({receiver : '',amount : ''})
    }

    const handleActivityClick = () => {
        setIsActivityActive(true)
    };


    return (
        <div>
            <div className={`overlay-background ${!isTransferring ? 'display-none' : ''}`}>

                <div className="Transfer-card ">
                    <button type="button" className="token-transfer-close-button" onClick={closeTransfer}><img src={closeLogo} alt="close" className="close" /></button>

                    <div className="transfer-details">
                        <form>
                            <div className="form-floating form-element">
                                <input
                                    id="receiver"
                                    type="text"
                                    name="receiver"
                                    value={formData.receiver}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                                <label for="address" placeholder="Contract Address">Receiver Address</label>
                            </div>

                            <div className="form-floating form-element">
                                <textarea
                                    id="amount"
                                    type="text"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    rows={10}
                                    className="form-control"
                                    required
                                />
                                <label for="abi" placeholder="Contract Abi">Amount </label>
                            </div>
                            <div className="transfer-submit-button">
                                <button type="button" className="transfer-form-submit" onClick={TransferToken}>Transfer</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>

            <button type="button" className="token-close-button" onClick={closeWindowTooken} ><img src={closeLogo} alt="close" className="close" /></button>
            <div className="wallet-backcard">
                <div className="Network">
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <RetrieveNetworkFromLocalStorage />
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a className="dropdown-item" href="#">Change Network</a></li>
                        </ul>
                    </div>
                </div>
                <div className="Address d-flex">
                    <div className="number"><RetrieveAccountFromLocalStorage /></div>
                    <button type="button" className="copy d-flex" onClick={onCopy}>...<img src={copyLogo} alt="copy" className="copyImage" /></button>
                </div>
                <div className="balance">
                    <div className="value">{Ammout}</div>
                    <div className="symbol"><RetrieveSymbolFromLocalStorage /></div>
                </div>
                <div className="Transfer d-flex">
                    <button type="button" className="Send" onClick={SendToken}>Send<img src={sendLogo} alt="Send" className="send-image" /></button>
                </div>
                <hr />
                <div className="tokenWindow-navigation d-flex">
                    <div className='tokenWindow-Activity  navigation-active'  onClick={handleActivityClick}>Activity</div>
                </div>

                <div className='ActivityList'>
                    <div>
                        {activityData.map((activity, index) => (
                            <div key={index} className="Activity-Info d-flex" >
                                <div className="Activity-name"><RetrieveSymbolFromLocalStorage /> Sent</div>
                                <div className="value">{activity.Ammout}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
}

export default Windowtoken;
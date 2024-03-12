import React, { useState } from "react";
import logo from '../Images/background-removebg-preview.png';
import '../CSS/ChangeNetwork.css';
import closeLogo from '../Images/close.png';

import { useNavigate } from "react-router-dom";

function ChangeNetwork() {
    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        Name : '',
        Symbol : '',
        Chainid : '',
        Rpc : '',
    })

    // function createAccount() {
    //     navigate("/create");
    // }

    function ChangeNetworkLocalStorage() {
        const NetworkDetails = {
            NetworkName: formData.Name,
            RPC: formData.Rpc,
            Currency : formData.Symbol
          };
          localStorage.setItem('NetworkDetails', JSON.stringify(NetworkDetails));

          clearImportTokenList();
          clearActivityList();
        }

    // function recoverAccount() {
    //     navigate("/recover-wallet")
    // }

    const clearFormData = () => {
        setFormData({Name : '',Symbol : '', Chainid : '', Rpc : ''})
    }

    const clearImportTokenList = () => {
        localStorage.removeItem("TokenDetails")
    }

    const clearActivityList = () => {
        localStorage.removeItem("TransferDetails")
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const closeNetworkChange = () => {
        navigate("/wallet")
    } 

    const CallChangeNetwork = () => {
        fetch(`http://localhost:3000/change-network?RPC=${formData.Rpc}&ChainId=${formData.Chainid}`, {
            method: 'POST'
        }).then(response => response.json())
            .then(data => {
                if(data.message == "Success") {
                    ChangeNetworkLocalStorage()
                    alert(`Network Changed to ${formData.Name}`)

                    clearFormData();
                    closeNetworkChange();

                }
                else {
                    alert("Network Not Found")
                }
            });


    }

    return (
        <div>
            <div className="change-network-backcard">
            <button type="button" className="transfer-close-button" onClick={closeNetworkChange}><img src={closeLogo} alt="close" className="close" /></button>
            <div className="network-details">
                        <form>
                        <div className="form-floating form-element">
                                <input
                                    id="Name"
                                    type="text"
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                                <label for="Name" placeholder="Network Name">Network Name</label>
                            </div>

                            <div className="form-floating form-element">
                                <input
                                    id="Symbol"
                                    type="text"
                                    name="Symbol"
                                    value={formData.Symbol}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                />
                                <label for="Symbol" placeholder="Symbol">Symbol </label>
                            </div>

                            <div className="form-floating form-element">
                                <input
                                    id="Chainid"
                                    type="text"
                                    name="Chainid"
                                    value={formData.Chainid}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                />
                                <label for="Chainid" placeholder="Chain ID">Chain ID </label>
                            </div>

                            <div className="form-floating form-element">
                                <input
                                    id="RPC"
                                    type="text"
                                    name="Rpc"
                                    value={formData.Rpc}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                                <label for="Rpc" placeholder="RPC URL">RPC URL</label>
                            </div>
                            <div className="transfer-submit-button">
                                <button type="button" className="transfer-form-submit" onClick={CallChangeNetwork}>Change Network</button>
                            </div>
                        </form>

                    </div>

            </div>

        </div>
    );
}

export default ChangeNetwork;
import React, { useEffect, useState } from "react";
import "../CSS/ChooseNetworkChain.css"
import logo from '../Images/yourCryptoLogo-removebg-preview.png';
import Back from '../Images/87-875958_back-arrow-in-circle-symbol-removebg-preview.png'
import { useNavigate } from "react-router-dom";


function Choosenetworkchange() {
    const [selectedMainnetNetworks, setSelectedMainnetNetworks] = useState([]);
    const [selectedTestnetNetworks, setSelectedTestnettNetworks] = useState([]);

    const [showError, setShowError] = useState(false);

    const [isNetworkSaved, setIsNetworkSaved] = useState(false);

    const [allSelectedNetworks, setAllSelectedNetworks] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        if (selectedMainnetNetworks.includes("Ethereum") && !(allSelectedNetworks.some(network => network.NetworkName === "Ethereum"))) {
            console.log("Etherum")

            let networkDetails = {
                NetworkName: "Ethereum",
                Network: "Mainnet",
                RPC_URL: "https://eth-mainnet.g.alchemy.com/v2/pYv0wGX37_Dxm_IX7CYJn2sybrNpldd6",
                Chain_ID: "1",
                Currency: "ETH"
            }
            setAllSelectedNetworks(prevNetworks => [...prevNetworks, networkDetails]);
        }

        if (selectedMainnetNetworks.includes("Polygon") && !(allSelectedNetworks.some(network => network.NetworkName === "Polygon"))) {

            let networkDetails = {
                NetworkName: "Polygon",
                Network: "Mainnet",
                RPC_URL: "https://polygon-mainnet.g.alchemy.com/v2/yXrG2Cko-Eei7ecpolNMVlrQexDI7yu4",
                Chain_ID: "137",
                Currency: "MATIC"
            }

            setAllSelectedNetworks(prevNetworks => [...prevNetworks, networkDetails]);
        }

        if (selectedMainnetNetworks.includes("Avalanche") && !(allSelectedNetworks.some(network => network.NetworkName === "Avalanche"))) {

            let networkDetails = {
                NetworkName: "Avalanche C Chain",
                Network: "Mainnet",
                RPC_URL: "https://rpc.ankr.com/avalanche",
                Chain_ID: "43114",
                Currency: "AVAX"
            }

            setAllSelectedNetworks(prevNetworks => [...prevNetworks, networkDetails]);
        }

        if (selectedMainnetNetworks.includes("Solana") && !(allSelectedNetworks.some(network => network.NetworkName === "Solana"))) {

            let networkDetails = {
                NetworkName: "Solana",
                Network: "Mainnet",
                RPC_URL: "https://api.mainnet-beta.solana.com",
                Chain_ID: "1319911149",
                Currency: "SOL"
            }

            setAllSelectedNetworks(prevNetworks => [...prevNetworks, networkDetails]);
        }

        if (selectedTestnetNetworks.includes("Ethereum-Goerli") && !(allSelectedNetworks.some(network => network.NetworkName === "Ethereum-Goerli"))) {

            let networkDetails = {
                NetworkName: "Ethereum-Goerli",
                Network: "Testnet",
                RPC_URL: "https://rpc.ankr.com/eth_goerli",
                Chain_ID: "5",
                Currency: "ETH"
            }

            setAllSelectedNetworks(prevNetworks => [...prevNetworks, networkDetails]);
        }

        if (selectedTestnetNetworks.includes("Polygon-Mumbai") && !(allSelectedNetworks.some(network => network.NetworkName === "Polygon-Mumbai"))) {

            let networkDetails = {
                NetworkName: "Polygon-Mumbai",
                Network: "Testnet",
                RPC_URL: "https://rpc-mumbai.maticvigil.com",
                Chain_ID: "80001",
                Currency: "MATIC"
            }

            setAllSelectedNetworks(prevNetworks => [...prevNetworks, networkDetails]);
        }

        console.log(allSelectedNetworks);

    }, [selectedMainnetNetworks, selectedTestnetNetworks]);

    function getBack() {
        navigate("/create/set-password")
    }

    function getNext() {

        if (allSelectedNetworks != null && allSelectedNetworks.length > 0) {
            SaveToLocalStorage(allSelectedNetworks)

            SaveActiveNetworkToLocalStorage();
            SaveSession();
            ActiveAccount();
            SaveAccountIndex();

            setIsNetworkSaved(true);

            setTimeout(() => {
                setIsNetworkSaved(false);
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

    function SaveToLocalStorage(Networks) {
        console.log(Networks)
        localStorage.setItem('NetworkDetails', JSON.stringify(allSelectedNetworks));
    }

    const toggleNetworkTestnet = (network) => {
        console.log("Testnet Selected", network)
        // Check if the network is already selected
        if (selectedTestnetNetworks.includes(network)) {
            // Deselect the network
            setSelectedTestnettNetworks(selectedTestnetNetworks.filter((selected) => selected !== network));
        } else {
            // Select the network
            setSelectedTestnettNetworks([...selectedTestnetNetworks, network]);
        }
    };

    const toggleNetworkMainnet = (network) => {
        // Check if the network is already selected
        if (selectedMainnetNetworks.includes(network)) {
            // Deselect the network
            setSelectedMainnetNetworks(selectedMainnetNetworks.filter((selected) => selected !== network));
        } else {
            // Select the network
            setSelectedMainnetNetworks([...selectedMainnetNetworks, network]);
        }
    };

    const isSelectedMainnet = (network) => {
        if (selectedMainnetNetworks.includes(network)) {
            return true;
        }
        else {
            return false;
        }
    }

    const isSelectedTestnet = (network) => {
        if (selectedTestnetNetworks.includes(network)) {
            return true;
        }
        else {
            return false;
        }
    }

    function SaveActiveNetworkToLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('NetworkDetails'));

        if (Network) {
            let activeNetwork = {
                NetworkName: Network[0].NetworkName,
                Network: Network[0].Network,
                RPC_URL: Network[0].RPC_URL,
                Chain_ID: Network[0].Chain_ID,
                Currency: Network[0].Currency
            }

            localStorage.setItem('ActiveNetwork', JSON.stringify(activeNetwork));
        }
    }

    function SaveSession() {
        localStorage.setItem("isActive", true);
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
            <div id="notification-box" className={`notification-box ${isNetworkSaved ? 'slide-in opacity' : 'slide-out '}`}>
                <p>Network Selected Successfully</p>
            </div>

            <div id="notification-box" className={`error-notification-box ${showError ? 'slide-in opacity' : 'slide-out '}`}>
                <p>Choose atleast one Network</p>
            </div>

            <div className="chooseNetwork-backcard">
                <div><button type="button" className="create-backButton" onClick={getBack} ><img src={Back} alt="back" className="create-backButton" /></button>
                    <div className="progress-bar">
                        <div id="1" className="progress "></div>
                        <div id="2" className="progress  "></div>
                        <div id="3" className="progress progress-on"></div>
                    </div>
                </div>

                <div className="logo center-align">
                    <img src={logo} alt='Wallet' className="logoImage policy-tab" />
                </div>

                <div><h2 className="create-center-align">Choose Network</h2>
                    <div className="password-block">
                        <div className="info-block">
                            <p>Choose from the below available networks on which chain you want to operate.</p>
                        </div>

                        <div className="choose-network-pane">
                            <div className="mainnet-available">
                                <div className="mainnet-text create-center-align mb-2"><b>Mainnet Available :</b></div>
                                <div className="row">
                                    <div className={`network-box col ${isSelectedMainnet("Ethereum") ? 'selected' : ''}`} onClick={() => toggleNetworkMainnet("Ethereum")}>
                                        <p>Ethereum</p>
                                    </div>
                                    <div className={`network-box col ${isSelectedMainnet("Polygon") ? 'selected' : ''}`} onClick={() => toggleNetworkMainnet("Polygon")}>
                                        <p>Polygon</p>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className={`network-box col ${isSelectedMainnet("Avalanche") ? 'selected' : ''}`} onClick={() => toggleNetworkMainnet("Avalanche")}>
                                        <p>Avalanche</p>
                                    </div>
                                    <div className={`network-box col ${isSelectedMainnet("Solana") ? 'selected' : ''}`} onClick={() => toggleNetworkMainnet("Solana")}>
                                        <p>Solana</p>
                                    </div>
                                </div>
                            </div>

                            <br />
                            <hr />
                            <br />

                            <div className="testnet-available">
                                <div className="mainnet-text create-center-align mb-2" ><b>Testnet Available :</b></div>
                                <div className="row">
                                    <div className={`network-box col ${isSelectedTestnet("Ethereum-Goerli") ? 'selected' : ''}`} onClick={() => toggleNetworkTestnet("Ethereum-Goerli")}>
                                        <p>Ethereum-Goerli</p>
                                    </div>
                                    <div className={`network-box col ${isSelectedTestnet("Polygon-Mumbai") ? 'selected' : ''}`} onClick={() => toggleNetworkTestnet("Polygon-Mumbai")}>
                                        <p>Polygon-Mumbai</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chooseNetwork-down-buttons">
                    <button type='button' className="btn btn-primary chooseNetwork-bttn" onClick={getNext} >Create Wallet</button>
                </div>

            </div>
        </div>
    );
}

export default Choosenetworkchange;
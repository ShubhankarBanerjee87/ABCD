import React, { useEffect, useState } from "react";
import "./CSS/Wallet_container_header_section.css";
import "./CSS/common.css"


function WalletContainerHeaderSection() {

    // stores all the networks
    const [allNetworksChoosed, setAllNetworkChoosed] = useState([]);
    // stores all the accounts added: default 1 named account 0 
    const [allAccounts, setAllAccounts] = useState([]);

    //Counter to refresh frame after account or network change
    const [changeNetworkClick, setChangeNetworkClick] = useState(1);
    const [changeAccountClick, setChangeAccountClick] = useState(1);


    // Sets the active Network details
    const [activeNetwork, setActiveNetwork] = useState(
        {
            NetworkName: '',
        }
    );
    // Sets the active account details
    const [activeAccount, setActiveAccount] = useState('');


    useEffect(() => {

        const fetchData = () => {
            getAllNetworks();
            getAllAccounts();

            let networkName = RetrieveNetworkFromLocalStorage()
            setActiveNetwork(networkName)


            let accountName = RetrieveAccountDetailsFromLocalStorage();
            setActiveAccount(accountName);
        }

        fetchData();

       

    }, [changeAccountClick, changeNetworkClick]);


    const getAllNetworks = () => {
        const NetworkDetails = JSON.parse(localStorage.getItem('NetworkDetails'));

        if (NetworkDetails) {
            setAllNetworkChoosed(NetworkDetails);
        }
    }

    const getAllAccounts = () => {
        const AccountDetails = JSON.parse(localStorage.getItem('AccountDetails'));

        if (AccountDetails) {
            setAllAccounts(AccountDetails);
        }
    }


    function RetrieveNetworkFromLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('ActiveNetwork'))
        if (Network) {
            return (
                Network
            )
        }
    }

    function RetrieveAccountDetailsFromLocalStorage() {
        const Account = JSON.parse(localStorage.getItem('ActiveAccount'))

        if (Account) {
            return (
                Account
            )
        }
    }

    const RetrieveActiveNetwork = () => {
        const Network = JSON.parse(localStorage.getItem('ActiveNetwork'))
        if (Network) {
            return (
                Network
            )
        }
    }



    // toggle the network change among different networks available
    const toggleNetworkChange = (index) => {
        let activeNetwork = allNetworksChoosed[index];
        localStorage.setItem('ActiveNetwork', JSON.stringify(activeNetwork));

        // setActiveNetwork(allNetworksChoosed[index])

        setChangeNetworkClick(changeNetworkClick + 1);
    }

    const toggleAccountChange = (index) => {
        let activeAccount = allAccounts[index];
        localStorage.setItem('ActiveAccount', JSON.stringify(activeAccount));

        // setActiveNetwork(allAccounts[index])

        setChangeAccountClick(changeAccountClick + 1);
    }

    return (
        <div className="position-top-header">
            <div className="wallet-backcard">
                <div className="top-section">
                    <div className="Network">
                        <div className="dropdown">
                            <div className="btn network-button dropdown-toggle custom-dropdown-toggle" type="button" id="NetworkdropdownMenu" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className="logo-importToken d-flex">
                                    <div className={`importToken-logo static-logo-color`}>{Array.from(activeNetwork.NetworkName)[0]}</div>
                                    <div>{activeNetwork.NetworkName}</div>
                                </div>
                            </div>
                            <ul className="dropdown-menu custom-dropdown-menu" aria-labelledby="NetworkdropdownMenu">
                                {allNetworksChoosed.map((item, index) => (
                                    <li><button className="dropdown-item network-item-button" onClick={() => toggleNetworkChange(index)}>{allNetworksChoosed[index].NetworkName} </button></li>))}
                                <li><a className="dropdown-item network-item-button change-network-item" href="/change-network">Add Network</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="dropdown">
                        <div className="btn account-button dropdown-toggle" type="button" id="AccountdropdownMenu" data-bs-toggle="dropdown" aria-expanded="false">
                            {activeAccount.AccountName}
                        </div>
                        <ul className="dropdown-menu custom-dropdown-menu " aria-labelledby="NetworkdropdownMenu">
                            {allAccounts.map((item, index) => (
                                <li><button className="dropdown-item account-item-button" onClick={() => toggleAccountChange(index)}>{allAccounts[index].AccountName} </button></li>))}
                            <li><a className="dropdown-item account-item-button add-import-item" href="/change-network">Add/Import Account</a></li>
                        </ul>
                    </div>
                    <div className="more-menu" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        </svg>
                    </div>
                </div>
            </div >
        </div>
    );
}

export default WalletContainerHeaderSection;
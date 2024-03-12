import React, { useState, useEffect } from "react";
import "./CSS/Wallet_main_section.css"
import "./CSS/common.css"

import copyLogo from '../../Images/copy.png'



function WalletMainSection() {

    const [Ammout, setAmount] = useState(null);
    //Imported Token Data
    const [tokenData, setTokenData] = useState([]);

    const [dollorAmount, setDollorAmount] = useState(null);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const [showTestnet, setShowTestnet] = useState(false);
    const [showMainnet, setShowMainnet] = useState(false);




    // Stores the Coin price in dollor
    const [showPriceInDollor, setShowPriceInDollor] = useState(false);

    // Sets the active Network details
    const [activeNetwork, setActiveNetwork] = useState(
        {
            NetworkName: '',
        }
    );
    // Sets the active account details
    const [activeAccount, setActiveAccount] = useState('');


    //useEffect
    useEffect(() => {

        const fetchData = async () => {

            const tokenStoredData = localStorage.getItem("Imported_TokenDetails");

            let networkName = RetrieveNetworkFromLocalStorage(); networkName
                .then(result => setActiveNetwork(result))
            

            let accountName = RetrieveAccountDetailsFromLocalStorage();
            setActiveAccount(accountName);


            let activeNetworkDetails = RetrieveActiveNetwork();

            let coinId = getCoinId(activeNetworkDetails.NetworkName, activeNetworkDetails.Currency)

            if (coinId != null) {
                setShowPriceInDollor(true);
                if (activeNetworkDetails.Network === "Mainnet") {
                    setShowMainnet(true);
                }
                else if (activeNetworkDetails.Network === "Testnet") {
                    setShowTestnet(true);
                }

                fetch(`http://localhost:3000/getPriceInDollor?CoinSymbol=${activeNetworkDetails.Currency}&CoinName=${coinId}`, {
                    method: 'GET'
                }).then(response => response.json())
                    .then(data => {
                        let price = findFirstValue(data.priceInDollor);
                        let dollor_balance = price.toFixed(2);
                        setDollorAmount(dollor_balance);
                    }).catch(error => {
                        setDollorAmount(0);
                    });
            }

            if (tokenStoredData) {
                const dataArray = JSON.parse(tokenStoredData);
                let networkName = RetrieveNetworkFromLocalStorage()

                // Filter the data based on the "network" key
                const filteredData = dataArray.filter(item => item.token_network === networkName.NetworkName);
                setTokenData(filteredData);
            }

            let address = RetrieveAccountFromLocalStorage();
            let rpc = RetrieveRPCFromLocalStorage();
            fetch(`http://localhost:3000/mainToken/balance?RPC=${rpc}&address=${address}`, {
                method: 'POST'
            }).then(response => response.json())
                .then(data => {
                    let account_balance = parseFloat(data.balance);
                    account_balance = account_balance.toFixed(2);
                    setAmount(account_balance);
                });
            const userAddress = RetrieveAccountFromLocalStorage();
        }

        fetchData();

    }, [])


    //Function to find the first value 
    const findFirstValue = (jsonObject) => {
        for (const key in jsonObject) {
            if (typeof jsonObject[key] === 'object') {
                const result = this.findFirstValue(jsonObject[key]);
                if (result !== undefined) {
                    return result;
                }
            } else {
                return jsonObject[key];
            }
        }

        return undefined;
    };


    //Amount In USD
    const AmmoutInUSD = () => {
        let usdPrice = Ammout * dollorAmount;
        usdPrice = usdPrice.toFixed(2);
        return usdPrice;
    }

    //On Copy
    function onCopy() {
        navigator.clipboard.writeText(RetrieveAccountFromLocalStorage())
            .then(() => {
                setShowCopiedMessage(true);
                setTimeout(() => {
                    setShowCopiedMessage(false);
                }, 3000);
            })
            .catch(err => {
                console.error('Error copying to clipboard:', err);
            });
    }

    //Retrieve Active Network from local storage
    async function RetrieveNetworkFromLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('ActiveNetwork'))
        if (Network) {
            return (
                Network
            )
        }
    }

    //Retrieve Active Network 
    const RetrieveActiveNetwork = () => {
        const Network = JSON.parse(localStorage.getItem('ActiveNetwork'))
        if (Network) {
            return (
                Network
            )
        }
    }


    //Retrieve Active Account from Local Storage
    function RetrieveAccountDetailsFromLocalStorage() {
        const Account = JSON.parse(localStorage.getItem('ActiveAccount'))

        if (Account) {
            return (
                Account
            )
        }
    }

    //Retrieve RPC from Local Storage
    function RetrieveRPCFromLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('ActiveNetwork'))

        if (Network) {
            return (
                Network.RPC_URL
            )
        }
    }


    //Retrieve account from local storage
    function RetrieveAccountFromLocalStorage() {
        const Account = JSON.parse(localStorage.getItem('ActiveAccount'));

        if (Account) {
            return (
                Account.Address
            )
        }
    }


    //Get Coin ID
    const getCoinId = (networkName, networkSymbol) => {
        if (networkName === "Ethereum" && networkSymbol === "ETH") {
            return 'ethereum'
        }
        else if (networkName === "Polygon" && networkSymbol === "MATIC") {
            return 'matic'
        }
        else if (networkName === "Avalanche" && networkSymbol === "AVAX") {
            return 'avalanche'
        }
        else if (networkName === "Solana" && networkSymbol === "SOL") {
            return 'solana'
        }
        else if (networkName === "Ethereum-Goerli" && networkSymbol === "ETH") {
            return 'ethereum'
        }
        else if (networkName === "Polygon-Mumbai" && networkSymbol === "MATIC") {
            return 'matic'
        }
        else {
            return null;
        }
    }




    return (
        <div className="position-wallet-main-section center-align">
            <div className="wallet-main-section-wallet-backcard">
                <div className="middle-section">
                    <div className="Address d-flex">
                        <div className="number">{activeAccount.Address}</div>
                        <button type="button" className="copy d-flex" onClick={onCopy}>...<img src={copyLogo} alt="copy" className="copyImage" /></button>
                    </div>
                    <div className="balance">
                        <div className="value">{Ammout}</div>
                        <div className="symbol">{activeNetwork.Currency}</div>
                    </div>
                    <div className={`priceInDollor ${showPriceInDollor ? '' : 'display-none'}`}>
                        <div className="value">$<AmmoutInUSD /> USD</div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default WalletMainSection;
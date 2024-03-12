import React, { useEffect, useState } from "react";
import '../CSS/Wallet.css';
import '../CSS/loadingSpinner.css'
import copyLogo from '../Images/copy.png'
import nextLogo from '../Images/next.jpg'
import closeLogo from '../Images/close.png';
//import closeLogo from '../Images/close-removebg-preview.png';
import { useNavigate } from "react-router-dom";
import sendLogo from "../Images/send.png";
import logo from '../Images/yourCryptoLogo-removebg-preview.png';
import noData from "../Images/no_token_nft-removebg-preview.png";




function Wallet() {

    const [Ammout, setAmount] = useState(null);
    //Imported Token Data
    const [tokenData, setTokenData] = useState([]);
    //Imported NFT Data
    const [nftData, setNftData] = useState([]);
    // Activity Data of User
    const [activityData, setActivityData] = useState([]);
    // Copied Message
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    //Sets active animation for token,nft and activity nav tab
    const [isTokensActive, setIsTokensActive] = useState(false);
    const [isActivityActive, setIsActivityActive] = useState(true);
    const [isNFTActive, setIsNFTActive] = useState(false)

    const [isTransferring, setIsTransferring] = useState(false);
    //Opens up the Import Token Window
    const [isImportingToken, setIsImportingToken] = useState(false);

    // stores all the networks
    const [allNetworksChoosed, setAllNetworkChoosed] = useState([]);
    // stores all the accounts added: default 1 named account 0 
    const [allAccounts, setAllAccounts] = useState([]);

    // Stores the Coin price in dollor
    const [showPriceInDollor, setShowPriceInDollor] = useState(false);

    const [showTestnet, setShowTestnet] = useState(false);
    const [showMainnet, setShowMainnet] = useState(false);

    const [dollorAmount, setDollorAmount] = useState(null);

    // Sets the active Network details
    const [activeNetwork, setActiveNetwork] = useState(
        {
            NetworkName: '',
        }
    );
    // Sets the active account details
    const [activeAccount, setActiveAccount] = useState('');
    //Counter to refresh frame after account or network change
    const [changeNetworkClick, setChangeNetworkClick] = useState(1);
    const [changeAccountClick, setChangeAccountClick] = useState(1);

    // For Loading
    const [startLoading, setStartLoading] = useState(false);

    //For random Backround color 
    const [RandomColor, setRandomColor] = useState('')
    const randomBackroundColor = ['random-token-background-color-blue', 'random-token-background-color-yellow', 'random-token-background-color-red', 'random-token-background-color-black', 'random-token-background-color-purple', 'random-token-background-color-grey', 'random-token-background-color-lightblue']

    //Import Token successful message
    const [showImportSuccessfulMessage, setShowImportSuccessfulMessage] = useState(false);

    const [formData, setFormData] = useState({
        receiver: '',
        amount: ''
    });

    // Import token form
    const [importTokenFormData, setImportTokenFormData] = useState({
        contractAddress: '',
        tokenSymbol: '',
        tokenDecimal: '0'
    });
    // Start Importing Click button
    const [importNextClickedOnce, setImportNextClickedOnce] = useState(false);

    // Hook for Sowing Input Error in Import Token Contract Id
    const [inputError, setInputError] = useState(false);
    // Show the Edit Token name lnk button
    const [showTokenNameEdit, setShowTokenNameEdit] = useState(false);
    const [editImportToken, setEditImportToken] = useState(true);
    const [showImportScreen, setShowImportScreen] = useState(false);

    //Duplicate Import Error 
    const [duplicateImportError, setDuplicateImportError] = useState(false);

    const navigate = useNavigate();

    useEffect(async () => {
        const tokenStoredData = localStorage.getItem("Imported_TokenDetails");

        getAllNetworks();
        getAllAccounts();

        let networkName = await RetrieveNetworkFromLocalStorage()
        setActiveNetwork(networkName)

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

        // fetch(`http://localhost:3000/notifications/?userAddress=${userAddress}`).then(response => {
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! Status: ${response.status}`);
        //     }
        //     console.log(response);
        //     return response.json();
        // })
        //     .then(data => {
        //         console.log("this");
        //         console.log(data);
        //         setActivityData(data.result)
        //     });

    }, [changeNetworkClick, changeAccountClick])

    useEffect(() => {
        getRandomBackgroundColor();
    }, [showImportScreen]);

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

    function ImportToken() {
        setIsTransferring(false);
        setIsImportingToken(true);
    }

    const TokenWindow = (index) => {
        localStorage.setItem('Index', index);
        navigate("/token-details")
    }

    const RetrieveActiveNetwork = () => {
        const Network = JSON.parse(localStorage.getItem('ActiveNetwork'))
        if (Network) {
            return (
                Network
            )
        }
    }

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

    function RetrieveAccountFromLocalStorage() {
        const Account = JSON.parse(localStorage.getItem('ActiveAccount'));

        if (Account) {
            return (
                Account.Address
            )
        }
    }

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


    function RetrievePrivateKeyFromLocalStorage() {
        const Account = JSON.parse(localStorage.getItem('AccountDetails'));

        if (Account) {
            return (
                Account.PrivateKey
            )
        }
    }


    async function RetrieveNetworkFromLocalStorage() {
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

    function RetrieveRPCFromLocalStorage() {
        const Network = JSON.parse(localStorage.getItem('ActiveNetwork'))

        if (Network) {
            return (
                Network.RPC_URL
            )
        }
    }

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

    const handleTokensClick = () => {
        setIsActivityActive(false);
        setIsNFTActive(false);
        setIsTokensActive(true);
    };

    const handleActivityClick = () => {
        setIsActivityActive(true);
        setIsNFTActive(false);
        setIsTokensActive(false);
    };

    const handleNFTClick = () => {
        setIsActivityActive(false);
        setIsNFTActive(true);
        setIsTokensActive(false);
    };


    const SendToken = () => {
        setIsTransferring(true);
        setFormData({ receiver: '', amount: '' })

    }

    const closeWindow = () => {
        setIsTransferring(false)
        setIsImportingToken(false);
        setShowImportScreen(false);

        setImportNextClickedOnce(false);

        setImportTokenFormData({
            ["contractAddress"]: '', ["tokenSymbol"]: '', ["tokenDecimal"]: ''
        });

    }

    const closeTransfer = () => {
        const activityStoredData = localStorage.getItem("TransferDetails");

        if (activityStoredData) {
            const dataArray = JSON.parse(activityStoredData);
            setActivityData(dataArray);
        }

        setIsTransferring(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleImportTokenInputChange = (e) => {
        const { name, value } = e.target;
        setImportTokenFormData({
            ...importTokenFormData,
            [name]: value
        });
    }

    const TransferToken = () => {
        let rpc = RetrieveRPCFromLocalStorage();
        let receiver = formData.receiver;
        let amount = formData.amount;
        let PrivateKey = RetrievePrivateKeyFromLocalStorage();

        fetch(`http://localhost:3000/transfer/mainToken?RPC=${rpc}&Receiver=${receiver}&PrivateKey=${PrivateKey}&Amount=${amount}`, {
            method: 'POST'
        }).then(response => response.json())
            .then(data => {
                SaveTransferToLocal(data.TxHash, receiver, amount);
            });
    }

    const SaveTransferToLocal = (txHash, receiver, amount) => {
        const TransferDetails = {
            Receiver: receiver,
            Hash: txHash,
            Ammout: amount,
        }
        const existingData = JSON.parse(localStorage.getItem('TransferDetails')) || [];

        // Add the new form data to the existing data
        const newData = [...existingData, TransferDetails];

        // Store the updated data back in local storage
        localStorage.setItem('TransferDetails', JSON.stringify(newData));

        alert(`Transfer Successful`);
        closeTransfer()
    }

    // get the coin amount in usd by multiplying
    const AmmoutInUSD = () => {
        let usdPrice = Ammout * dollorAmount;
        usdPrice = usdPrice.toFixed(2);
        return usdPrice;
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

    const StartImportingToken = () => {

        if (importTokenFormData.contractAddress.trim() === "") {                    // check if contract address is empty
            setInputError(true);

            setTimeout(() => {
                setInputError(false);
            }, 3000);

        }
        else if (checkIfExists(importTokenFormData.contractAddress)) {              // Check if token is already imported
            setDuplicateImportError(true);

            setTimeout(() => {
                setDuplicateImportError(false);
            }, 3000);

        }
        else {
            //Show Loading
            setStartLoading(true);

            fetch(`http://localhost:3000/importTokenDetails?contractAddress=${importTokenFormData.contractAddress}&RPC_URL=${activeNetwork.RPC_URL}&accountAddress=${activeAccount.Address}`,
                {
                    method: "GET"
                }).then(response => response.json())
                .then(data => {
                    setImportTokenFormData({
                        ...importTokenFormData,
                        ["tokenSymbol"]: data.result.TokenSymbol, ["tokenDecimal"]: data.result.TokenDecimals
                    });
                    localStorage.setItem('TemporaryImportedTokenDetails', JSON.stringify(data.result));
                    setImportNextClickedOnce(true);
                    setShowTokenNameEdit(true);

                    // Remove Loading
                    setStartLoading(false);
                });
        }
    }

    // Check if token is already imported
    function checkIfExists(name) {
        const storedData = localStorage.getItem("Imported_TokenDetails");
        if (storedData) {
            const dataArray = JSON.parse(storedData);

            for (const obj of dataArray) {
                if (obj.token_contract_address === name) {
                    return true;
                }
            }
        }
        return false;
    }

    const GetImportedToken = () => {
        setShowTokenNameEdit(true);
        setShowImportScreen(true);
    }

    const HideImportScreen = () => {
        setShowImportScreen(false);
    }

    //Enable editing of import token name
    const editImportName = () => {
        setEditImportToken(false);
    }

    function getImportTokenBalance() {
        const Details = JSON.parse(localStorage.getItem("TemporaryImportedTokenDetails"));
        if (Details) {
            return Details.TokenBalance;
        }
    }

    function getRandomBackgroundColor() {
        const randomNumber = Math.floor(Math.random() * randomBackroundColor.length) + 1;
        setRandomColor(randomBackroundColor[randomNumber - 1]);
        return (randomBackroundColor[randomNumber - 1])
    }

    const storeImportToken = () => {
        const Details = JSON.parse(localStorage.getItem("TemporaryImportedTokenDetails"));
        if (Details) {
            let ImportedTokenDetails = {
                "token_logo_background_color": RandomColor,
                "token_contract_address": importTokenFormData.contractAddress,
                "token_symbol": importTokenFormData.tokenSymbol,
                "token_decimal": importTokenFormData.tokenDecimal,
                "token_network": activeNetwork.NetworkName,
                "token_balance": Details.TokenBalance
            }

            const existingData = JSON.parse(localStorage.getItem('Imported_TokenDetails')) || [];

            // Add the new form data to the existing data
            const newData = [...existingData, ImportedTokenDetails];

            // Store the updated data back in local storage
            localStorage.setItem('Imported_TokenDetails', JSON.stringify(newData));

            doneImportToken();
        }
    }

    function doneImportToken() {
        localStorage.removeItem("TemporaryImportedTokenDetails");
        closeWindow();

        setShowImportSuccessfulMessage(true);

        setTimeout(() => {
            setShowImportSuccessfulMessage(false);
        }, 3000);

        setTimeout(() => {
            let tokenStoredData = localStorage.getItem("Imported_TokenDetails");

            if (tokenStoredData) {
                const dataArray = JSON.parse(tokenStoredData);
                // Filter the data based on the "network" key
                const filteredData = dataArray.filter(item => item.token_network === activeNetwork.NetworkName);
                setTokenData(filteredData);
            }

        }, 4000);
    }

    return (
        <div>
            <div id="wallet-notification-box" className={`wallet-notification-box color-success ${showImportSuccessfulMessage ? 'slide-in opacity' : 'slide-out '}`}>
                <p>Token Imported Successfully</p>
            </div>

            <div id="wallet-notification-box" className={`wallet-notification-box color-info ${showCopiedMessage ? 'slide-in opacity' : 'slide-out '}`}>
                <p>Copied</p>
            </div>


            <div className={`overlay-background-loading ${startLoading ? " " : "display-none"}`}>
                <div className="centerAlign">
                    <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
            </div>
            <div className="wallet-logo center-align">
                <img src={logo} alt='Wallet' className="wallet-logo-width" />
            </div>
            <div className={`overlay-background ${!isTransferring ? 'display-none' : ''}`}>
                <div className="Transfer-card ">
                    <div className="button-close">
                        <button type="button" className="importToken-close-button" onClick={closeWindow}><img src={closeLogo} alt="close" className="" /></button>
                    </div>

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

            <div className={`overlay-background ${!isImportingToken ? 'display-none' : ''}`}>
                <div className={`importToken-card ${showImportScreen ? "display-none" : ""}`}>
                    <div className="button-close">
                        <button type="button" className="importToken-close-button" onClick={closeWindow}><img src={closeLogo} alt="close" className="" /></button>
                    </div>
                    <div className="importToken-card-body">
                        <div className="importToken-heading">
                            Import Custom Token
                        </div>
                        <div className="importToken-warning-block">
                            <div className="importToken-warning-message">
                                <div className="warning-margin-right"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                </svg></div>
                                <div>
                                    Make sure you trust a token before you import it. Learn how to avoid <a href="#">token scams and security risks.</a>
                                </div>
                            </div>
                        </div>
                        <div className="importToken-form">
                            <form>
                                <div className="mb-3">
                                    <div className="input-text">Token Contract Address</div>
                                    <input
                                        id="contractAddress"
                                        type="text"
                                        name="contractAddress"
                                        value={importTokenFormData.contractAddress}
                                        onChange={handleImportTokenInputChange}
                                        className="form-control"
                                        required
                                    />
                                    <a href="" className="input-text contract-address-link">Token Contract Address?</a>
                                    <div className={`input-error input-text ${inputError ? '' : 'display-none'}`}>Provide the Token Contract Address</div>
                                    <div className={`input-error input-text ${duplicateImportError ? '' : 'display-none'}`}>Token Already Imported</div>
                                </div>

                                <div className={`mb-3 ${importNextClickedOnce ? '' : 'display-none'}`}>
                                    <div className="input-text">Token Symbol <span className={`edit-tokenName ${showTokenNameEdit ? "" : "display-none"}`} onClick={editImportName}>Edit</span></div>
                                    <input
                                        id="tokenSymbol"
                                        type="text"
                                        name="tokenSymbol"
                                        value={importTokenFormData.tokenSymbol}
                                        onChange={handleImportTokenInputChange}
                                        className="form-control"
                                        disabled={editImportToken}
                                    />
                                </div>

                                <div className={`mb-3 ${importNextClickedOnce ? '' : 'display-none'}`}>
                                    <div className="input-text">Token Decimal </div>
                                    <input
                                        id="tokenDecimal"
                                        type="text"
                                        name="tokenDecimal"
                                        value={importTokenFormData.tokenDecimal}
                                        onChange={handleImportTokenInputChange}
                                        className={`form-control`}
                                        disabled
                                    />
                                </div>

                                <div className="importToken-submit-button">
                                    <button type="button" className={`importToken-form-submit ${importNextClickedOnce ? 'display-none' : ''}`} onClick={StartImportingToken}>Next</button>

                                    <button type="button" className={`importToken-form-submit ${importNextClickedOnce ? '' : 'display-none'}`} onClick={GetImportedToken}>Start Importing</button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>

                <div className={`importToken-card ${!showImportScreen ? "display-none" : ""}`}>
                    <div className="button-close">
                        <button type="button" className="importToken-close-button" onClick={closeWindow}><img src={closeLogo} alt="close" className="" /></button>
                    </div>
                    <div className="importToken-card-body">
                        <div className="importToken-heading">
                            Import Custom Token
                        </div>
                        <div className="">
                            <p>Would you like to import these tokens?</p>
                        </div>
                        <div className="importToken-details-row d-flex mb-2">
                            <div className="coloumn text-align-center ">Token</div>
                            <div className="coloumn text-align-center ">Balance</div>
                        </div>
                        <div className="importToken-details-row d-flex mb-4">
                            <div className="importToken-details-row d-flex">
                                <div className={`coloumn coulumn-stick-together-left ${RandomColor}`}>{Array.from(importTokenFormData.tokenSymbol)[0]}</div>
                                <div className="coloumn coulumn-stick-together-right ">{importTokenFormData.tokenSymbol}</div>
                            </div>
                            <div className="coloumn  ">{getImportTokenBalance()}</div>
                        </div>
                        <div className="importToken-details-row d-flex ">
                            <button type="button" className="btn coloumn import-token-confirm-buttons hover-button" onClick={HideImportScreen}>Back</button>
                            <button type="button" className="btn coloumn import-token-confirm-buttons blue-button hover-button" onClick={storeImportToken}>Import</button>
                        </div>

                    </div>
                </div>

            </div>

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
                        <div className="btn account-button dropdown-toggle " type="button" id="AccountdropdownMenu" data-bs-toggle="dropdown" aria-expanded="false">
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
                    <div className="Transfer d-flex">
                        <button type="button" className="Send" onClick={SendToken}>Send<img src={sendLogo} alt="Send" className="send-image" /></button>
                    </div>
                    <hr />
                    <div className="navigation d-flex">
                        <div className={`Tokens ${isTokensActive ? 'navigation-active' : ''}`} onClick={handleTokensClick}  >Tokens</div>
                        <div className={`Activity ${isNFTActive ? 'navigation-active' : ''}`} onClick={handleNFTClick}>NFT</div>
                        <div className={`Activity ${isActivityActive ? 'navigation-active' : ''}`} onClick={handleActivityClick}>Activity</div>
                    </div>
                    <div className="navigation-tab-output">
                        <div className={`ImportedTokens ${!isTokensActive ? 'display-none' : ''}`}>
                            <div className={`noData ${tokenData.length > 0 ? 'display-none' : ''}`}>
                                <div className="noData-image"><img src={noData} alt='NoData' className="" /></div>
                                <div className="noData-text">No Imported Token's to show</div>
                                <div className="noData-link"><a href="#">Lear more</a></div>
                            </div>
                            <div>
                                {tokenData.map((token, index) => (
                                    <div key={index} className="TokenInfo d-flex" onClick={() => TokenWindow(index)}>
                                        <div className="left d-flex">
                                            <div className="logo-importToken ">
                                                <div className={`importToken-logo ${token.token_logo_background_color}`}>{Array.from(token.token_symbol)[0]}</div>
                                            </div>
                                            <div className="importToken-details ">
                                                <div className="token-symbol">{token.token_symbol}</div>
                                                <div>{token.token_balance}</div>

                                            </div>
                                        </div>
                                        <div className="next-logo-div">{token.Symbol}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="importToken">
                                <div className="bottomLine-On-hover">
                                    <a href="#" className="import" onClick={ImportToken}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg> Import Token</a>
                                </div>
                            </div>
                            <div className="importToken">
                                <div className="bottomLine-On-hover">
                                    <a href="/wallet" className="import"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                                    </svg> Refresh List</a>
                                </div>
                            </div>

                        </div>
                        <div className={`NFTList ${!isNFTActive ? 'display-none' : ''}`}>
                            <div className={`noData ${nftData.length > 0 ? 'display-none' : ''}`}>
                                <div className="noData-image"><img src={noData} alt='NoData' className="" /></div>
                                <div className="noData-text">No NFT's Yet</div>
                                <div className="noData-link"><a href="#">Lear more</a></div>
                            </div>
                            {/* <div>
                                {tokenData.map((token, index) => (
                                    <div key={index} className="TokenInfo d-flex" onClick={() => TokenWindow(index)}>
                                        <div>{token.Name}</div>
                                        <div className="next-logo-div">{token.Symbol}
                                            <img className="next" src={nextLogo} alt="Next"></img>
                                        </div>
                                    </div>
                                ))}
                            </div> */}

                            <div className="importToken">
                                <a href="#" className="import" onClick={ImportToken}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                </svg> Import NFT</a>
                            </div>
                            <div className="importToken">
                                <a href="#" className="import" onClick={ImportToken}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                                </svg> Refresh List</a>
                            </div>
                        </div>

                        <div className={`ActivityList ${!isActivityActive ? 'display-none' : ''}`}>
                            <div>
                                {activityData.map((activity, index) => (
                                    <div key={index} className="Activity-Info d-flex" >
                                        <div className="Activity-name">{activity.notification_msg}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-section">
                    <div className="footer-support"><a href="" className="support-link">@support.yourCrypto</a></div>
                </div>
            </div>
        </div>
    );
}

export default Wallet;

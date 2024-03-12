import React, { useEffect, useState } from "react";
import closeLogo from '../Images/close.png';
import '../CSS/Importtoken.css';
import { useNavigate } from "react-router-dom";

function Importtoken() {
  const navigate = useNavigate();

  function Wallet() {
    navigate("/wallet");
  }

  const [formData, setFormData] = useState({
    address: '',
    abi: ''
  });

  // const [TokenName, setTokenName] = useState('');
  // const [TokenSymbol, setTokenSymbol] = useState('');
  // const [TokenBalance, setTokenBalance] = useState('');
  // const [TokenDecimal, setTokenDecimal] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  function RetrieveAccountFromLocalStorage() {
    const Account = JSON.parse(localStorage.getItem('AccountDetails'));

    if (Account) {
      return (
        Account.Address
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

  function checkIfExists(key, name) {
    const storedData = localStorage.getItem(key);
  
    if (storedData) {
      const dataArray = JSON.parse(storedData);
  
      for (const obj of dataArray) {
        if (obj.Address === name) {
          return true;
        }
      }
    }
  
    return false;
  };

   function SaveTokenToLocalStorage(TokenName, TokenSymbol,TokenDecimals) {
    let contractAddress = formData.address;
    let contractABI = formData.abi


    const TokenDetails = {
      Address : contractAddress,
      Abi : contractABI,
      Name : TokenName,
      Symbol : TokenSymbol,
      Decimals : TokenDecimals,
    }

    const existingData = JSON.parse(localStorage.getItem('TokenDetails')) || [];

    // Add the new form data to the existing data
    const newData = [...existingData, TokenDetails];

    // Store the updated data back in local storage
    localStorage.setItem('TokenDetails', JSON.stringify(newData));

    alert(`${TokenName} imported successfully, please close the window to refresh`);
  };

  function TokenFormSubmit() {
    let address = RetrieveAccountFromLocalStorage();
    let rpc = RetrieveRPCFromLocalStorage();
    let contractAddress = formData.address;
    let contractABI = formData.abi

    if(! checkIfExists("TokenDetails",contractAddress)){
    const url = `http://localhost:3000/importToken?RPC=${rpc}&address=${address}&contractAddress=${contractAddress}&contractAbi=${contractABI}`
    fetch(url, {
      method: 'POST'
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        // setTokenName(data.TokenName);
        // setTokenSymbol(data.TokenSymbol);
        // setTokenDecimal(data.TokenDecimals)
        // setTokenBalance(data.TokenBalance)
        {SaveTokenToLocalStorage(data.TokenName, data.TokenSymbol,data.TokenDecimals)}

      });

    }
    else {
      alert(`Token already imported`);
    }
  }

  return (
    <div>
      <button type="button" className="close-button" onClick={Wallet}><img src={closeLogo} alt="close" className="close" /></button>
      <div className="importToken-backcard">
        <h2>Import Token</h2>
        <div className="token-form form-address">
          <form onSubmit={TokenFormSubmit}>
            <div className="form-floating">
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-control"
              />
              <label for="address" placeholder="Contract Address">Contract Address :</label>
            </div>

            <div className="form-floating form-abi">
              <textarea
                id="abi"
                type="text"
                name="abi"
                value={formData.abi}
                onChange={handleInputChange}
                rows={10}
                className="form-control"
                required
              />
              <label for="abi" placeholder="Contract Abi">Contract Abi</label>
            </div>
            <div className="submit-button">
            <button type="button" onClick={TokenFormSubmit} className="form-submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Importtoken;
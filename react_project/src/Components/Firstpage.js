import React, { useState } from "react";
import logo from '../Images/yourCryptoLogo-removebg-preview.png';
import ethereumLogo from "../Images/ethereumLogo.png";
import polygonLogo from "../Images/polygonLo.png";
import avalancheLogo from "../Images/avalancheLogo.png";
import solanaLogo from "../Images/solanaLogo.png";
import '../CSS/Firstpage.css';
import closeLogo from '../Images/close.png';
import { useNavigate } from "react-router-dom";

function Firstpage() {
  const [isCreateInformation, setIsCreateInformation] = useState(false);
  const [isRecoveryInformation, setIsRecoveryInformation] = useState(false);
  const [isCreateChecked, setisCreateChecked] = useState(false);
  const [isRecoveryChecked, setIsRecoveryChecked] = useState(false);
  const [isshowChecked, setIsShowChecked] = useState(false);  
  const [isShowRecoveryChecked, setIsShowRecoveryChecked] = useState(false);


  const navigate = useNavigate();

  function ClearLocalStorage() {
    localStorage.clear()
  }

  const closeTransfer = () => {
    setIsCreateInformation(false)
    setIsRecoveryInformation(false);
    setIsRecoveryChecked(false);
    setisCreateChecked(false);
  }

  const openCreate = () => {
    setIsCreateInformation(true)
  }

  const openRecover = () => {
    setIsRecoveryInformation(true);
  }


  const handleCheckboxChange = (click) => {
    if (click === "Create") {
      setisCreateChecked(!isCreateChecked); // Toggle the checkbox status
    }
    if (click === "Recovery") {
      setIsRecoveryChecked(!isRecoveryChecked);
    }
  };

  const handleAgreeClick = (click) => {
    if (click === "Create") {
      if (!isCreateChecked) {
        setIsShowChecked(true);

         setTimeout(() => {
          setIsShowChecked(false);
        }, 2000);

        setIsShowChecked(true);
      }
      else {
        navigate("/create/set-password")
      }
    }

    if (click === "Recovery") {
      if (!isRecoveryChecked) {
        setIsShowRecoveryChecked(true);

        setTimeout(() => {
          setIsShowRecoveryChecked(false);
        }, 2000);

        setIsShowRecoveryChecked(true);
      }
      else {
        navigate("/recover/recover-passphrase")

      }
    }

  };


  return (
    <div>
      <ClearLocalStorage />
      <div className={`overlay-background ${!isCreateInformation ? 'display-none' : ''}`}>
        <div className="Create-card ">
          <button type="button" className="Create-close-button" onClick={closeTransfer}><img src={closeLogo} alt="close" className="close" /></button>
          <div className="logo center-align">
            <img src={logo} alt='Wallet' className="logoImage policy-tab" />
          </div>
          <div className="center-align"><h5>Terms and Conditions</h5></div>
          <div className="main-policy-text center-align">
            <p>By initiating the recovery process for your wallet on YourCrypto, you acknowledge and agree to be bound by the following terms and conditions: <span className="color-logo">YourCrypto</span>, you agree to be bound by the following terms and conditions</p>
            <ol className="policy-guidelines">
              <li>Users must be at least 18 years old or meet the legal age requirement in their jurisdiction to use <span className="color-logo">YourCrypto</span>'s wallet services.</li>
              <li>You are responsible for maintaining the confidentiality of your wallet credentials. <span className="color-logo">YourCrypto</span> is not liable for any unauthorized access to your account.</li>
              <li>Users are prohibited from using the wallet for any illegal activities or transactions.</li>
              <li>Our Privacy Policy outlines how we collect, use, and protect your personal information. By using our wallet service, you agree to the terms of our Privacy Policy.</li>
              <li>Transactions may be subject to fees, and processing times may vary. <span className="color-logo">YourCrypto</span> reserves the right to impose limits on transaction amounts.</li>
              <li>Any disputes arising from the use of our wallet service will be resolved through arbitration in accordance with <span className="color-logo">YourCrypto</span>'s dispute resolution process.</li>
              <li><span className="color-logo">YourCrypto</span> reserves the right to terminate or suspend your wallet account for violations of these terms and conditions.</li>
              <li><span className="color-logo">YourCrypto</span> may update these terms and conditions from time to time. Continued use of the wallet service after such updates constitutes acceptance of the revised terms.</li>
              <li>For any questions or concerns regarding your wallet account, please contact us at <b>yourCrypto@gmail.com</b>.</li>
            </ol>
            <div className="I-accept center-align">
              <input type="checkbox" checked={isCreateChecked} onChange={() => handleCheckboxChange("Create")} id="I-accept" className=""></input>
              <label for="I-accept" className="I-accept-text">I accept all the terms and conditions</label>
            </div>
            <div className={`warning-message ${!isshowChecked ? 'display-none' : ''} center-align`}>Please agree the conditions before proceeding</div>
            <div className="Accept-button center-align mt-3 mb-3">
              <button type="button" className="btn btn-success" onClick={() => handleAgreeClick("Create")}>Create my wallet</button>
            </div>
          </div>
        </div>
      </div>





      <div className={`overlay-background ${!isRecoveryInformation ? 'display-none' : ''}`}>
        <div className="Create-card ">
          <button type="button" className="Create-close-button" onClick={closeTransfer}><img src={closeLogo} alt="close" className="close" /></button>
          <div className="logo center-align">
            <img src={logo} alt='Wallet' className="logoImage policy-tab" />
          </div>
          <div className="center-align"><h5>Recovery: Terms and Conditions</h5></div>
          <div className="main-policy-text center-align">
            <p>By initiating the recovery process for your wallet on <span className="color-logo">YourCrypto</span>, you acknowledge and agree to be bound by the following terms and conditions:</p>
            <ol className="policy-guidelines">
              <li>Provide accurate information and be ready for identity verification if needed.</li>
              <li>Users must be at least 18 years old or meet the legal age requirement in their jurisdiction for the recovery process.</li>
              <li>Keep recovery information confidential; <span className="color-logo">YourCrypto</span> is not liable for unauthorized access due to mishandling.</li>
              <li>Recovery is only for regaining access to your wallet—no illegal or fraudulent activities are allowed.</li>
              <li>Any disputes will be resolved through arbitration as per <span className="color-logo">YourCrypto</span>'s dispute resolution process.</li>
              <li><span className="color-logo">YourCrypto</span> may terminate or suspend the recovery process for violations.</li>
              <li><span className="color-logo">YourCrypto</span> may update these terms and conditions from time to time. Continued use of the wallet service after such updates constitutes acceptance of the revised terms.</li>
              <li>For any questions or concerns regarding your wallet account, please contact us at <b>yourCrypto@gmail.com</b>.</li>
            </ol>
            <div className="I-accept center-align">
              <input type="checkbox" checked={isRecoveryChecked} onChange={() => handleCheckboxChange("Recovery")} id="I-accept" className=""></input>
              <label for="I-accept" className="I-accept-text">I accept all the terms and conditions</label>
            </div>
            <div className={`warning-message ${!isShowRecoveryChecked ? 'display-none' : ''} center-align`}>Please agree the conditions before proceeding</div>
            <div className="Accept-button center-align mt-3 mb-3">
              <button type="button" className="btn btn-success" onClick={() => handleAgreeClick("Recovery")}>Recover my wallet</button>
            </div>
          </div>
        </div>
      </div>


      <div className="backcard">
        <div className="logo center-align">
          <img src={logo} alt='Wallet' className="logoImage" />
        </div>

        <div className="top-align"><h4 className="center-align">YourCrypto Wallet welcomes you</h4>
        </div>
        <div className="center-align start-guide-text">To start with YourCrypto Wallet, create a new account or import an existing one</div>
        <div className="support-logo center-align">
        <div className="start-guide-text center-align"><b>Supports: </b></div>
          <img src={ethereumLogo} alt='Wallet' className="support-logoImage" />
          <img src={polygonLogo} alt='Wallet' className="support-logoImage" />
          <img src={avalancheLogo} alt='Wallet' className="support-logoImage" />
          <img src={solanaLogo} alt='Wallet' className="support-logoImage" />
        </div>
        <div className="button-container">
          <button type='button' className="btn btn-primary set-button center-align" onClick={openCreate}>Create new account</button><br />
          <button type='button' className="btn btn-primary set-button center-align" onClick={openRecover}>Recover Account</button>
        </div>
      </div>
    </div >
  );
}

export default Firstpage;
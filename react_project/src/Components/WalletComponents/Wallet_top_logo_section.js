import React, { useState } from "react";
import "./CSS/Wallet_top_logo_section.css"
import logo from "../../Images/yourCryptoLogo-removebg-preview.png"


function WalletTopLogosection() {

  return (
    <div>
      <div className="wallet-logo center-align">
        <img src={logo} alt='Wallet' className="wallet-logo-width" />
      </div>
    </div >
  );
}

export default WalletTopLogosection;
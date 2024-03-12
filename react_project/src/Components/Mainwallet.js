import React, { useState , useEffect } from "react";

import Wallettopsection from "./WalletComponents/Wallet_top_logo_section";
import WalletContainerHeaderSection from "./WalletComponents/Wallet_container_header_section";
import WalletMainSection from "./WalletComponents/Wallet_main_section";


function Mainwallet() {
  return (
    <div>
      <Wallettopsection />
      <WalletContainerHeaderSection/>
      <WalletMainSection />
    </div >
  );
}

export default Mainwallet;
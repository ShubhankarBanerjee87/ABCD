import React from "react";
import Firstpage from "./Components/Firstpage";
import Create from "./Components/Create";
import Wallet from "./Components/Wallet";
import Token from "./Components/Importtoken";
import Tokenwindow from "./Components/Windowtoken";
import RecoverWallet from "./Components/Recover"
import ChangeNetwork from "./Components/ChangeNetwork";
import SetPassword from "./Components/Setpassword";
import RecoverSetPassword from "./Components/Recoversetpassword";
import ChooseNetworkChain from "./Components/Choosenetworkchain";
import RecoverChooseNetworkChain from "./Components/Recoverchoosenetworkchain";
import ConfirmPassword from "./Components/Confirmpassphrase";

import Mainwallet from "./Components/Mainwallet";

import { Route,Routes } from "react-router-dom";

function App() {
  return (
    <switch>
    <Routes>
      <Route path = "https://shubhankarbanerjee87.github.io/ABCD" element = {<Firstpage />}/>
      <Route path = "/create/pass-phase" element = {<Create />}/>
      <Route path = "/create/set-password" element = {<SetPassword />}/>
      <Route path = "/recover/set-password" element = {<RecoverSetPassword />}/>
      <Route path = "/create/choose-network" element = {<ChooseNetworkChain />}/>
      <Route path = "/recover/choose-network" element = {<RecoverChooseNetworkChain />}/>
      <Route path = "/create/confirm-passphrase" element = {< ConfirmPassword/>} />
      <Route path="/wallet" element= {<Wallet />} />
      <Route path="/import-token" element= {<Token />} />
      <Route path="/token-details" element= {<Tokenwindow />} />
      <Route path="/recover/recover-passphrase" element = {<RecoverWallet/>} />
      <Route path="/change-network" element = {<ChangeNetwork/>} />

      <Route path="/main-wallet" element = {<Mainwallet/>} />

    </Routes>
    </switch>

  );
}
  
export default App;

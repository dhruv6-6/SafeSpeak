import './App.css';
import {React , useState} from "react";
import TopBar from "./windows/topBar/TopBar";
import ChatArea from "./windows/chatArea/ChatArea";
import LoginNSignup from "./windows/loginNSignup/LoginNSignup";

function App() {
  const[chat , setChat] = useState(0);
  return (
    <div className='mainBody'>
      {
        chat
        ?
          <>
            <TopBar />
            <ChatArea />
          </>
        :
          <LoginNSignup />
      }
      
    </div>
  );
}

export default App;
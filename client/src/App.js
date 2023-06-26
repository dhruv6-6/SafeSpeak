import "./App.css";
import { React, useState } from "react";
import TopBar from "./windows/topBar/TopBar";
import ChatArea from "./windows/chatArea/ChatArea";
import LoginNSignup from "./windows/loginNSignup/LoginNSignup";
import RequestNGroup from "./windows/requestnGroups/RequestNGroup"
import io from "socket.io-client";

var socket = io.connect("http://localhost:3001", {
    cors: {
        origin: "*",
    },
});

function App() {
    const [enter, setEnter] = useState(0);
    const [requests , setRequests] = useState(0);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [publicKey, setPublicKey] = useState("");

    const reqOnClick = ()=>{
        setRequests(1);
        setEnter(0);
    }

    const enterOnClick = ()=>{
        setRequests(0);
        setEnter(1);
    }

    var curUserData = {
        socketID: socket.id,
        username,
        setUsername,
        password,
        setPassword,
        privateKey,
        setPrivateKey,
        publicKey,
        setPublicKey,
    };
    return (
        <div className="mainBody">
            {enter ? (
                <>
                    <TopBar  socket={socket} curUserData={curUserData}  onclick={reqOnClick} state="chat"/>
                    <ChatArea  socket={socket} curUserData={curUserData} />
                </>
            ) : (
                requests
                ?
                <>
                    <TopBar socket={socket} curUserData={curUserData} onclick={enterOnClick} state="req"/>
                    <RequestNGroup socket={socket} curUserData={curUserData}  />
                </>
                :
                <LoginNSignup socket={socket}  curUserData={curUserData} setEnter={setEnter} />
            )}
        </div>
    );
}

export default App;

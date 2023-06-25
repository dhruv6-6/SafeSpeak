import "./App.css";
import { React, useState } from "react";
import TopBar from "./windows/topBar/TopBar";
import ChatArea from "./windows/chatArea/ChatArea";
import LoginNSignup from "./windows/loginNSignup/LoginNSignup";
import io from "socket.io-client";

var socket = io.connect("http://localhost:3001", {
    cors: {
        origin: "*",
    },
});

function App() {
    const [enter, setEnter] = useState(1);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [publicKey, setPublicKey] = useState("");

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
                    <TopBar />
                    <ChatArea />
                </>
            ) : (
                <LoginNSignup socket={socket}  curUserData={curUserData} setEnter={setEnter} />
            )}
        </div>
    );
}

export default App;

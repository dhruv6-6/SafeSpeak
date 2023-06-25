import {React , useEffect , useState} from 'react';

import "./LoginNSignup.css";
import { generateRSAKeys, encrypt, encryptPrivateKey} from "../../helper.js";

const LoginNSignup = (props) => {
    const { socket, curUserData  ,setEnter } = props;
    console.log(curUserData)

    const enter = () => {
        if (curUserData.password && curUserData.username) {
            generateRSAKeys().then(({ publicKey, privateKey }) => {
                curUserData.setPublicKey(publicKey);
                curUserData.setPrivateKey(privateKey);
                encryptPrivateKey(
                    privateKey,
                    curUserData.username + curUserData.password
                ).then((encryptedPrivateKey) => {
                    encrypt(publicKey, curUserData.password).then(
                        (encryptedPassword) => {
                            socket.emit("sign-up-init", {
                                username: curUserData.username,
                                publicKey,
                                encryptedPrivateKey,
                                encryptedPassword,
                                socketID: socket.id,
                            });
                        }
                    );
                });
            });
        }
    };


    useEffect(()=>{
        socket.on("sign-up-complete", data=>{
            setEnter(1);
        })

        return ()=>{
            socket.off("sign-up-complete");
        }
    },[socket])





    return (
        <div className="loginNSignupMainBody">
            <div className="mainBoxLoginArea">
                <div className="welcomeBack">Welcome Back</div>
                <div className="loginNSignupOption">
                    <div className="loginNsignupButtonArea">
                        <div className="slider"></div>
                        <button className="loginButton">Log in</button>
                        <button className="signupButton">Sign up</button>
                    </div>
                </div>
                <div className="userNameLoginPage">
                    <input
                        className="userNameInputBox"
                        placeholder="Username"
                        onChange={(e) => {
                            curUserData.setUsername(e.target.value);
                        }}
                    ></input>
                </div>
                <div className="passwordLoginPage">
                    <input
                        className="passwordInputBox"
                        placeholder="Password"
                        onChange={(e) => {
                            curUserData.setPassword(e.target.value);
                        }}
                    ></input>
                </div>
                <div className="enterLoginPage">
                    <button className="enterButton" onClick={enter}>
                        Enter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginNSignup;

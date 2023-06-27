import { React, useState, useEffect } from "react";
import "./LoginNSignup.css";
import ToggleSwitch from "./toggleSwitch/ToggleSwitch";
import {
    generateRSAKeys,
    encrypt,
    encryptPrivateKey,
    decrypt,
    decryptPrivateKey,
} from "../../helper.js";

const LoginNSignup = (props) => {
    const [login, setLogin] = useState(1);
    const [isLoginError, setIsLoginError] = useState(0);
    const [isSignupError , setIsSignupError] = useState(0);

    const usernameInput=document.getElementsByClassName("userNameInputBox")[0];
    const passwordInput=document.getElementsByClassName("passwordInputBox")[0];
    
    const setCorrect=()=>{
        if(usernameInput && passwordInput){
            if(login===1){
                if(isLoginError){
                    usernameInput.style.backgroundColor = "#FF9E9E";
                    usernameInput.classList.add('your-class');
                    usernameInput.value="";
                    usernameInput.placeholder="Incorrect Username";
                    passwordInput.style.backgroundColor = "#FF9E9E";
                    passwordInput.classList.add('your-class');
                    passwordInput.value="";
                    passwordInput.placeholder="Or Password";
                }
                else{
                    usernameInput.style.backgroundColor = "#F9FCF8";
                    usernameInput.value="";
                    usernameInput.classList.remove('your-class');
                    usernameInput.placeholder="Username";
                    passwordInput.style.backgroundColor = "#F9FCF8";
                    passwordInput.value="";
                    passwordInput.classList.remove('your-class');
                    passwordInput.placeholder="Password";
                }
            }
            else{
                passwordInput.style.backgroundColor = "#F9FCF8";
                passwordInput.value="";
                passwordInput.classList.remove('your-class');
                passwordInput.placeholder="Password";
                if(isSignupError){
                    usernameInput.style.backgroundColor = "#FF9E9E";
                    usernameInput.classList.add('your-class');
                    usernameInput.value="";
                    usernameInput.placeholder="Username taken";
                }
                else{
                    usernameInput.style.backgroundColor = "#F9FCF8";
                    usernameInput.value="";
                    usernameInput.classList.remove('your-class');
                    usernameInput.placeholder="Username";
                }
            }
        }
    }

    const focus = ()=>{
        if(usernameInput && passwordInput){
            if(login===1){
                if(usernameInput.placeholder==="Incorrect Username"){
                    usernameInput.style.backgroundColor = "#F9FCF8";
                    usernameInput.value="";
                    usernameInput.classList.remove('your-class');
                    usernameInput.placeholder="Username";
                    passwordInput.style.backgroundColor = "#F9FCF8";
                    passwordInput.value="";
                    passwordInput.classList.remove('your-class');
                    passwordInput.placeholder="Password";
                    setIsLoginError(0);
                }
            }
            else{
                if(usernameInput.placeholder==="Username taken"){
                    usernameInput.style.backgroundColor = "#F9FCF8";
                    usernameInput.value="";
                    usernameInput.classList.remove('your-class');
                    usernameInput.placeholder="Username";
                    passwordInput.style.backgroundColor = "#F9FCF8";
                    passwordInput.value="";
                    passwordInput.classList.remove('your-class');
                    passwordInput.placeholder="Password";
                    setIsSignupError(0);
                }
            }
        }
    }


    const clicking = () => {
        setLogin(1 ^ login);
    };

    const { socket, curUserData, setEnter } = props;

    const enter = () => {
        console.log(curUserData);

        if (curUserData.password && curUserData.username) {
            if (!login) {
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
            } else {
                console.log("Asking\n" , curUserData.username , curUserData.password);

                socket.emit("login-init", curUserData.username);
            }
        }
    };

    useEffect(() => {
        socket.on("sign-up-complete", (data) => {
            socket.emit("get-duoList", curUserData.username);
            setEnter(1);
        });
        socket.on("login-response", (data) => {
            console.log(data, curUserData);
            decryptPrivateKey(
                data.encryptedPrivateKey,
                curUserData.username + curUserData.password
            ).then((privateKey) => {
                decrypt(privateKey, data.encryptedPassword, 0).then(
                    (password) => {
                        console.log("compare", password, curUserData.password);
                        if (password === curUserData.password) {
                            curUserData.setPublicKey(data.publicKey);
                            curUserData.setPrivateKey(privateKey);

                            socket.emit("login-authenticate", {
                                ...data,
                                socketID: curUserData.socketID,
                            });
                        } else {
                        }
                    }
                );
            });
        });
        socket.on("login-success", (data) => {
            socket.emit("get-duoList", curUserData.username);
            setEnter(1);
        });

        return () => {
            socket.off("sign-up-complete");
            socket.off("login-response");
            socket.off("login-success");
        };
    }, [socket , curUserData.password , curUserData.username]);

    return (
        <div className="loginNSignupMainBody">
            <div className="mainBoxLoginArea">
                    <div className="welcomeBack">Welcome Back</div>
                    <div className="loginNSignupOption">
                        <div className="loginNsignupButtonArea">
                            <ToggleSwitch label="Login" onclick={clicking} />
                        </div>
                    </div>

                    <div className="userNameLoginPage">
                        <input
                            className="userNameInputBox"
                            placeholder="Username"
                            onChange={(e) => {
                                curUserData.setUsername(e.target.value);
                            
                            }}
                            onFocus={()=>{focus()}}
                        ></input>
                    </div>
                    <div className="passwordLoginPage">
                        <input
                            className="passwordInputBox"
                            placeholder="Password"
                            onChange={(e) => {
                                curUserData.setPassword(e.target.value);
                            }}
                            onFocus={()=>{focus()}}
                            type = "password"
                        ></input>
                    </div>
                    <div className="enterLoginPage">
                        {login ? (
                            <button
                                className="enterButton1"

                                onClick={() => {
                                    enter();
                                    setCorrect();
                                }}
                            >
                                Log in
                            </button>
                        ) : (
                            <button
                                className="enterButton2"
                                onClick={() => {
                                    console.log("WHEN CLICKED\n",curUserData)
                                    enter();
                                    setCorrect();
                                }}
                            >
                                Sign up
                            </button>
                        )}
                    </div>
            </div>
        </div>
    );
};

export default LoginNSignup;

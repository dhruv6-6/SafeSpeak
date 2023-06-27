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
    const { socket, curUserData, setEnter } = props;
    const [login, setLogin] = useState(1);
    const [isLoginError, setIsLoginError] = useState(0);
    const [isSignupError , setIsSignupError] = useState(0);

    const usernameInput=document.getElementsByClassName("userNameInputBox")[0];
    const passwordInput=document.getElementsByClassName("passwordInputBox")[0];
    
   

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

    const enter = () => {
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
                socket.emit("login-init", curUserData.username);
            }
        }
    };
    useEffect(()=>{
        const check = ()=>{
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
        check();
       
    }, [isLoginError , isSignupError]);

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
                        if (password === curUserData.password) {
                            curUserData.setPublicKey(data.publicKey);
                            curUserData.setPrivateKey(privateKey);
                            socket.emit("login-authenticate", {
                                ...data,
                                socketID: curUserData.socketID,
                            });
                        }else{
                            setIsLoginError(1);
                        }
                    }
                ).catch(err=>setIsLoginError(1));
            }).catch(err=>setIsLoginError(1));
        });
        socket.on("login-success", (data) => {
            socket.emit("get-duoList", curUserData.username);
            setEnter(1);
        });
        socket.on("username-exist" , data=>{
            setIsSignupError(1);
        })
        return () => {
            socket.off("sign-up-complete");
            socket.off("login-response");
            socket.off("login-success");
            socket.off("username-exist");

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
                                }}
                            >
                                Log in
                            </button>
                        ) : (
                            <button
                                className="enterButton2"
                                onClick={() => {
                                    enter();
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

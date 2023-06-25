import React from "react";
import './LoginNSignup.css';

const LoginNSignup = () => {
    return(
        <div className="loginNSignupMainBody"> 
            <div className="mainBoxLoginArea">
                <div className="welcomeBack">
                    Welcome Back
                </div>
                <div className="loginNSignupOption">
                    <div className="loginNsignupButtonArea">
                        <div className="slider"></div>
                        <button className="loginButton">
                            Log in
                        </button>
                        <button  className="signupButton">
                            Sign up
                        </button>
                    </div>
                </div>
                <div className="userNameLoginPage">
                    <input className="userNameInputBox" placeholder="Username"></input>
                </div>
                <div className="passwordLoginPage">
                    <input className="passwordInputBox" placeholder="Password"></input>
                </div>
                <div className="enterLoginPage">
                    <button  className="enterButton">
                        Enter
                    </button>
                </div>

            </div>
        </div>
    )
}

export default LoginNSignup;
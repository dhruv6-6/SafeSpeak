import {React , useState} from "react";
import './LoginNSignup.css';
import ToggleSwitch from "./toggleSwitch/ToggleSwitch";

const LoginNSignup = () => {
    const [login , setLogin] = useState(1);

    const clicking = () =>{
        setLogin(1^login);
    }

    return(
        <div className="loginNSignupMainBody"> 
            <div className="mainBoxLoginArea">
                <div className="welcomeBack">
                    Welcome Back
                </div>
                <div className="loginNSignupOption">
                    <div className="loginNsignupButtonArea">
                        <ToggleSwitch label="Login" onclick={clicking} />
                    </div>
                </div>
                <div className="userNameLoginPage">
                    <input className="userNameInputBox" placeholder="Username"></input>
                </div>
                <div className="passwordLoginPage">
                    <input className="passwordInputBox" placeholder="Password"></input>
                </div>
                <div className="enterLoginPage">
                    {
                        login?
                        <button  className="enterButton">
                            Log in
                        </button>
                        :
                        <button  className="enterButton">
                            Sign up
                        </button>
                    }
                    
                </div>

            </div>
        </div>
    )
}

export default LoginNSignup;
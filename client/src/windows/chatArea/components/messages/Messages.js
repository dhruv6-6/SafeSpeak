import React from "react";

import './Messages.css';
import Message from "./message/Message";

const Mesages = ({messages , me}) =>{
    return(
        <div className="messagesMainBoxSetting">
            {messages.map((message , i) => <div key = {i}><Message message = {message} me={me}/></div>)}
        </div>
    );
}

export default Mesages;
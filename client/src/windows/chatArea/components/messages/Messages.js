import React from "react";

import './Messages.css';
import Message from "./message/Message";


const scrollToBottom=()=>{
    var objDiv = document.getElementsByClassName("messagesMainBoxSetting")[0];
    if(objDiv){
        objDiv.scrollTop = objDiv.scrollHeight;
    }
}


const Mesages = ({messages , me}) =>{

    return(
        <>
            <div className="messagesMainBoxSetting">
                {messages.map((message , i) => <div key = {i}><Message message = {message} me={me}/></div>)}
            </div>
        </>
    );
}

export default Mesages;
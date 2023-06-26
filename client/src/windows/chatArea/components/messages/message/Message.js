import React from "react";

import './Message.css';


const Message = ({message , me}) =>{
    const formatHour = (input) => {
      if (input > 12) {
        return input - 12;
      }
      return input;
    };
    const formatData = (input) => {
        if (input > 9) {
          return input;
        } else return `0${input}`;
      };

    let isSentByCurrentUser = false;

    const myTrimmedName = me.trim().toLowerCase();
    const hisTrimmedName = message.sender.trim().toLowerCase();
    const hour =  formatData(formatHour(message.time.getHours()))
    const minute =  formatData(message.time.getMinutes())

    if(myTrimmedName===hisTrimmedName){
        isSentByCurrentUser = true;
    }

    return(
        isSentByCurrentUser===false
        ?
            <div className="messageContainers1">
                <div className="messageBoxWithMessageOuter1">      
                    <div className="messageBoxWithMessage myMesage">
                        {message.message}
                    </div>
                </div>
                <div className="timeBoxOuter1">      
                    <div className="timeArea1">
                        {hour+":"+minute}
                    </div>
                </div>
                
            </div>
        :

        <div className="messageContainers1">
            <div className="messageBoxWithMessageOuter2">      
                <div className="messageBoxWithMessage hisMesage">
                        {message.message}
                </div>
            </div>
            <div className="timeArea2">
                {hour+":"+minute}
            </div>
        </div>
    );
}

export default Message;
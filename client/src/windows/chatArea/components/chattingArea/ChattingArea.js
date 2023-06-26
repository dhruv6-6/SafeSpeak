import React from "react";
import './ChattingArea.css';
import icon1 from '../../../../images/userIcons/1.jpg'
import icon2 from '../../../../images/userIcons/2.jpg'
import icon3 from '../../../../images/userIcons/1.jpg'
import icon4 from '../../../../images/userIcons/2.jpg'
import send from "../../../../images/icons/send.png"
import smile from "../../../../images/icons/smile.png"

const ChattingArea  = ({user})=>{
    const iconList = [icon1 , icon2 , icon3 , icon4];

    return(

        <div className="chattingAreaMainBody">
            <div className="userInfoAndIcons">
                <div className="userProfilePictureAboveChat">
                    {
                        user && <img src={iconList[user.img]} className="profilePictureAboveChat"></img>
                    }
                </div>
                <div className="chatAreaIcons">
                </div>
            </div>
            <div className="chatBox">
                    <div className="messageBoxMain">
                    </div>
                    <div className="sendMessageBoxMain">
                        <div className="sendMessageBoxMain_2">
                            <img src={smile} className="smileIcon"></img>
                            <input className="messageInput" placeholder="Type a message"></input>
                            <button className="sendButton">
                                <img src={send} className="sendIcon"></img>
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default ChattingArea;
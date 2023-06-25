import React from "react";
import './ChattingArea.css';
import icon1 from '../../../../images/userIcons/1.jpg'
import icon2 from '../../../../images/userIcons/2.jpg'

const ChattingArea  = ({user})=>{
    const iconList = [icon1 , icon2];

    console.log(user  , user.img);
    return(
        <div className="chattingAreaMainBody">
            <div className="userInfoAndIcons">
                <div className="userProfilePictureAboveChat">
                    <img src={iconList[user.img]} className="profilePictureAboveChat"></img>
                </div>
                <div className="chatAreaIcons">

                </div>
            </div>
            <div className="chatBox"></div>
        </div>
    )
}

export default ChattingArea;
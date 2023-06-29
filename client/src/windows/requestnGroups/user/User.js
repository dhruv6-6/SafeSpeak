import React from "react";
import './User.css'
import userIcons from "../../../images/importImages";
import tick from '../../../images/icons/tick.png'
import cancel from '../../../images/icons/cancel.png'
import plus from '../../../images/icons/plus.png'

const User = (props)=>{
    const {area , name , img  , sendRequest , acceptRequest , rejectRequest} = props;
    return(
        <>
        {
            area=="send"
            ?
            <div className="userIconMainBodyFocus_2">
                <div className="userProfilePicture_2">
                    <img src={userIcons[img]} className="profilePicture_2"></img>
                </div>
                <div className="nameAndInfo_2">
                    <div className="userName_2">
                        <p className="userNameInfo_2 ">{name}</p>
                    </div>
                    <div className="description_2">
                        <p className="descriptionInfo_2"></p>
                        <div className="userLogLine_2"></div>
                    </div>
                </div>
                <div className="acceptReject_2">
                    <button className="plusIconButton_2" onClick={(e)=>{sendRequest(name , img)}} >
                        <img src={plus} className="plusIcon_2"></img>
                    </button>
                </div>
            </div>
            :
            area=="recieve"
            ?
            <div className="userIconMainBodyFocus_1">
                <div className="userProfilePicture_1">
                    <img src={userIcons[img]} className="profilePicture_1"></img>
                </div>
                <div className="nameAndInfo_1">
                    <div className="userName_1">
                        <p className="userNameInfo_1 ">{name}</p>
                    </div>
                    <div className="description_1">
                        <p className="descriptionInfo_1"></p>
                        <div className="userLogLine_1"></div>
                    </div>
                </div>
                <div className="acceptReject_1">
                    <button className="tickIconButton_1" onClick={(e)=>{acceptRequest(name)}}>
                        <img src={tick} className="tickIcon_1"></img>
                    </button>
                    <button className="cancelIconButton_1" onClick={(e)=>rejectRequest(name)}>
                        <img src={cancel} className="cancelIcon_1"></img>
                    </button>
                </div>
            </div>
            :
            <div className="userIconMainBodyFocus_3">
                <div className="userProfilePicture_3">
                    <img src={userIcons[img]} className="profilePicture_3"></img>
                </div>
                <div className="nameAndInfo_3">
                    <div className="userName_3">
                        <p className="userNameInfo_3 ">{name}</p>
                    </div>
                    <div className="description_3">
                        <p className="descriptionInfo_3"></p>
                        <div className="userLogLine_3"></div>
                    </div>
                </div>
            </div>
        }
        </>
        
    )
}

export default User;
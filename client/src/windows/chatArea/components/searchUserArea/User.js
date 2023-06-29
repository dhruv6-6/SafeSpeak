import React from "react";
import './User.css'
import userIcons from "../../../../images/importImages";


const User = ({id , name , img , active , focus , onclick})=>{
    let x = window.matchMedia("(max-width: 650px)");
    return(
        <>
            {
                (focus && !x.matches)
                ?
                <button className="userIconMainBodyFocus darkBackground" onClick={ () => {onclick(id)}}>
                    <div className="userProfilePicture">
                        {
                            active
                            ?
                                <div className="activeOrNot grn"></div>
                            :
                                <div className="activeOrNot red"></div>
                        }
                        <img src={userIcons[img]} className="profilePicture"></img>
                    </div>
                    <div className="nameAndInfo">
                        <div className="userName">
                            <p className="userNameInfo lightText">{name}</p>
                        </div>
                        <div className="description">
                            <p className="descriptionInfo"></p>
                        </div>
                    </div>
                </button>
                :
                    <button className="userIconMainBodyNotFocus" onClick={ () => {onclick(id)}}>
                        <div className="userProfilePicture">
                            {
                                active
                                ?
                                    <div className="activeOrNot grn"></div>
                                :
                                    <div className="activeOrNot red"></div>
                            }
                            <img src={userIcons[img]} className="profilePicture"></img>
                        </div>
                        <div className="nameAndInfo">
                            <div className="userName">
                                <p className="userNameInfo darkText">{name}</p>
                            </div>
                            <div className="description">
                                <p className="descriptionInfo"></p>
                                <div className="userLogLine"></div>
                            </div>
                        </div>
                    </button>
            }
        </>
    )
}

export default User;
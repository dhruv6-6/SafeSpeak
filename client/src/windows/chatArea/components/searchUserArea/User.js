import React from "react";
import './User.css'
import icon1 from '../../../../images/userIcons/1.jpg'
import icon2 from '../../../../images/userIcons/2.jpg'


const User = ({id , name , img , desc , active , focus , onclick})=>{
    const iconList = [icon1 , icon2];
    return(
        <>
            {
                focus
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
                        <img src={iconList[img]} className="profilePicture"></img>
                    </div>
                    <div className="nameAndInfo">
                        <div className="userName">
                            <p className="userNameInfo lightText">{name}</p>
                        </div>
                        <div className="description">
                            <p className="descriptionInfo">{desc}</p>
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
                            <img src={iconList[img]} className="profilePicture"></img>
                        </div>
                        <div className="nameAndInfo">
                            <div className="userName">
                                <p className="userNameInfo darkText">{name}</p>
                            </div>
                            <div className="description">
                                <p className="descriptionInfo">{desc}</p>
                                <div className="userLogLine"></div>
                            </div>
                        </div>
                    </button>
            }
        </>
    )
}

export default User;
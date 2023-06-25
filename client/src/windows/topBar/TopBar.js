import {React , UseState, useState} from "react";
import './TopBar.css'
import TopBarIcons from "./TopBarIcons";

const TopBar = ()=>{
    const [chat , setChat] = useState(1);
    const [friendsAndGroups , setFriendsAndGroups] = useState(0);

    const chatOnClick= ()=>{
        setFriendsAndGroups(0);
        setChat(1);
    }
    const friendsAndGroupsOnClick= ()=>{
        setChat(0);
        setFriendsAndGroups(1);
    }
    const logOutOnClick= ()=>{
        window.location.reload();
    }
    return(
        <div className="topBarMainBody">
            <div className="logo">
                
            </div>
            <div className="topBarIcons">
                <TopBarIcons info="Chat" isSelected = {chat} onClick = {chatOnClick} />
                <TopBarIcons info="Friends and Groups" isSelected = {friendsAndGroups} onClick = {friendsAndGroupsOnClick}/>
                <TopBarIcons info="Logout" isSelected = {0} onClick = {logOutOnClick}/>
            </div>
        </div>
    )
}

export default TopBar;
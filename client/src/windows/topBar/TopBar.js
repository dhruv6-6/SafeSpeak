import {React , UseState, useState} from "react";
import './TopBar.css'
import TopBarIcons from "./TopBarIcons";

const TopBar = (props)=>{
    const {socket, curUserData , onclick , state } = props;
    const [chat , setChat] = useState(1);
    const [friendsAndGroups , setFriendsAndGroups] = useState(0);

    const chatOnClick= ()=>{
        socket.emit("get-duoList" , curUserData.username);
        if(state==="req"){
            onclick();
        }
        setFriendsAndGroups(0);
        setChat(1);
    }
    const friendsAndGroupsOnClick= ()=>{
        socket.emit("get-sentRequestList" , curUserData.username);
        socket.emit("get-recievedRequestList" , curUserData.username);
        socket.emit("search-user-global" , {username:curUserData.username , data:""});
        if(state==="chat"){
            onclick();
        }
        setChat(0);
        setFriendsAndGroups(1);
    }
    const logOutOnClick= ()=>{
        window.location.reload();
    }
    return(
        <div className="topBarMainBodyOuter">
            <TopBarIcons className = "firstIcon" info="Chat" isSelected = {chat} onClick = {chatOnClick} />
            <TopBarIcons info="Friends and Groups" isSelected = {friendsAndGroups} onClick = {friendsAndGroupsOnClick}/>
            <TopBarIcons info="Logout" isSelected = {0} onClick = {logOutOnClick}/>
        </div>
    )
}

export default TopBar;
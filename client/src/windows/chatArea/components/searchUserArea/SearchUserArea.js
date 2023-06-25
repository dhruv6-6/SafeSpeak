import {React , useState} from "react";
import './SearchUserArea.css';
import search from '../../../../images/icons/search.png'
import User from './User';

const SearchUserArea  = ({users , changeUser})=>{

    return(
        <div className="searchUserAreaMainBody">
            <div className="searchBarChatArea">
                <img src={search} className="searchIcon"></img>
                <input className="searchUserInputBox" placeholder="Search"></input>
            </div>
            <div className="userLogDisplay">
                {
                    users.map(user => {
                        return(<User id = {user.id} name={user.name}  img ={user.img}  desc ={user.desc}  active ={user.active} focus ={user.focus} onclick ={changeUser}/>);
                    })
                }
            </div>
        </div>
    )
}

export default SearchUserArea;
import {React , useState , useEffect} from "react";
import './SearchUserArea.css';
import search from '../../../../images/icons/search.png'
import User from './User';

const SearchUserArea  = ({users , changeUser , onchange})=>{

    useEffect(()=>{
        const search1 = document.getElementsByClassName('searchUserInputBox')[0];
        search1.addEventListener('keyup',function(e){
            if (e.which == 13) this.blur();
        });
    } , []);

    return(
        <div className="searchUserAreaMainBody">
            <div className="searchBarChatArea">
                <img src={search} className="searchIcon"></img>
                <input id="searchUserInputBox" className="searchUserInputBox" placeholder="Search" onChange={(e) =>{onchange(e.target.value)}}></input>
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
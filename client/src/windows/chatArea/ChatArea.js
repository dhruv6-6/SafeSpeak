import {React , useState} from "react";
import './ChatArea.css'
import SearchUserArea from './components/searchUserArea/SearchUserArea';
import ChattingArea from './components/chattingArea/ChattingArea';


const ChatArea = ()=>{
    const [currentUser , setCurrentUser] = useState(0);
    const [users , setUsers] = useState([{id:0 ,name:"Armaan" ,img : 0  ,active:1 ,focus : 0}  
                    ,{ id:1 ,name:"Dhruv" ,img : 1  ,active:0 ,focus : 1} 
                    ,{ id:2 ,name:"Ananya" ,img : 1  ,active:1 ,focus : 0}
                    ,{ id:3 ,name:"Sarthak" ,img : 0 ,active:0 ,focus : 0}
                    ,{ id:4 ,name:"Sarthak" ,img : 0 ,active:0 ,focus : 0}
                    ,{ id:5 ,name:"Sarthak" ,img : 0 ,active:0 ,focus : 0}
                    ,{ id:6 ,name:"Sarthak" ,img : 0 ,active:0 ,focus : 0}
                    ,{ id:7 ,name:"Sarthak" ,img : 0 ,active:0 ,focus : 0}
                    ,{ id:8 ,name:"Sarthak" ,img : 0 ,active:0 ,focus : 0}]);
    
    const changeUser = (id) => {
        setUsers(users.map((user) => {
            if(user.id===id){
                setCurrentUser(id);
                return({
                    id: user.id , name:user.name , img :user.img  , active:user.active , focus:1
                })
            }
            else{
                return({
                    id: user.id , name:user.name , img :user.img  , active:user.active , focus:0
                })
            }
        }))

    }

    return(
        <div className="chatAreaMainBody">
            <SearchUserArea users = {users} changeUser = {changeUser}/>
            <ChattingArea user = {users[currentUser]}/>
        </div>
    )
}

export default ChatArea;
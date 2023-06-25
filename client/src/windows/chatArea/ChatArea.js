import {React , useState , useEffect} from "react";
import './ChatArea.css'
import SearchUserArea from './components/searchUserArea/SearchUserArea';
import ChattingArea from './components/chattingArea/ChattingArea';


const ChatArea = (props)=>{
    const {socket ,curUserData} = props;
    const [currentUser , setCurrentUser] = useState(0);
    const [users , setUsers] = useState([{id:0 ,name:"initial" ,img : 0  ,active:1 ,focus : 0}  
                    ]);
    
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

    useEffect(()=>{
        socket.on("recieve-duoList" ,data=>{
            let newUserList = []; let cnt =1;
            console.log(data);
            Object.keys(data).forEach((e)=>{
                newUserList.push({id:cnt ,name:e, img:Math.floor(Math.random() * 2), active:data[e] , focus:(cnt===1)});
                cnt++;
            })
            setUsers(newUserList);
        })
        socket.on("friend-disconnect" , data=>{
            console.log(data, "disconnected\n");
            let newUserList = users.map((e)=>{
                if (e.name===data){
                    e.active=0;
                }
                return e;
            });
            setUsers(newUserList);
        })
        socket.on("friend-connected" , data=>{
            console.log(data, "connected\n");
            let newUserList = users.map((e)=>{
                if (e.name===data){
                    e.active=1;
                }
                return e;
            });
            setUsers(newUserList);
        })
        socket.on("user-disconnected" ,()=>{
            console.log("first trigger\n");
            socket.emit("disconnected" , curUserData.username);
        })

        
    },[socket , curUserData.username , curUserData.password]);

    return(
        <div className="chatAreaMainBody">
            <SearchUserArea users = {users} changeUser = {changeUser}/>
            <ChattingArea user = {users[currentUser]}/>
        </div>
    )
}

export default ChatArea;
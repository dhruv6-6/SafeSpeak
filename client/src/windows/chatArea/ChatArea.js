import {React , useState , useEffect} from "react";
import './ChatArea.css'
import SearchUserArea from './components/searchUserArea/SearchUserArea';
import ChattingArea from './components/chattingArea/ChattingArea';


const ChatArea = (props)=>{
    const {socket ,curUserData} = props;
    const [currentUser , setCurrentUser] = useState(0);
    const [users , setUsers] = useState([]);
    
    const changeUser = (id) => {
        
        setUsers(users.map((user) => {
            if(user.id===id){
                console.log("getting deatils for " , [curUserData.username , user.name]);
                socket.emit("get-chat-details" , [curUserData.username , user.name]);
                setCurrentUser(id);
                return({
                    id: user.id , name:user.name , img :user.img, active:user.active , focus:1
                })
            }
            else{
                return({
                    id: user.id , name:user.name , img :user.img, active:user.active , focus:0
                })
            }
        }))
    }

    useEffect(()=>{
        socket.on("recieve-duoList" ,data=>{
            let newUserList = []; let cnt = 0 ;
            console.log(data);
            Object.keys(data).forEach((e)=>{
                newUserList.push({id:cnt ,name:e, img:data[e][1], active:data[e][0] , focus:0});
                cnt++;
            })
            if (newUserList.length!=0)
            setUsers(newUserList);
        })
        socket.on("friend-disconnected" , data=>{
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
            socket.emit("disconnected" , curUserData.username);
        })

        return ()=>{
            socket.off("recieve-duoList");
            socket.off("friend-disconnected");
            socket.off("friend-connected");
            socket.off("user-disconnected");
        }

        
    },[socket , curUserData.username , curUserData.password , currentUser , users] );

    return(
        <div className="chatAreaMainBody">
            <SearchUserArea users = {users} changeUser = {changeUser}/>
            <ChattingArea user = {users[currentUser]} curUserData={curUserData} socket={socket}/>
        </div>
    )
}

export default ChatArea;
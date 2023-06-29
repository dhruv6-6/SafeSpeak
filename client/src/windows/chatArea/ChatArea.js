import {React , useState , useEffect} from "react";
import './ChatArea.css'
import SearchUserArea from './components/searchUserArea/SearchUserArea';
import ChattingArea from './components/chattingArea/ChattingArea';



const ChatArea = (props)=>{
    const {socket ,curUserData} = props;
    const [currentUser , setCurrentUser] = useState(-1);
    const [users , setUsers] = useState([]);
    const [showUsers , setShowUsers] = useState([]);
    var searchUser = (data)=>{
            let newuser = users.filter((user) => {
                return((user.name).length >= data.length && (user.name).slice(0,data.length)===data);
            })
            setShowUsers(newuser);
        };
    useEffect(()=>{
        searchUser(document.getElementById("searchUserInputBox").value);
    }, [users]);

    const changeUser = (id) => {
        let x = window.matchMedia("(max-width: 650px)");
        let searchdisplay = document.getElementsByClassName("searchUserAreaMainBody")[0];
        let chatareadisplay = document.getElementsByClassName("chattingAreaMainBody")[0];
        
        if(x.matches){
            searchdisplay.style.display = "none";
            chatareadisplay.style.display = "block";
        }
        setShowUsers(showUsers.map((user) => {
            if(user.id===id){
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
        setUsers(users.map((user) => {
            if(user.id===id){
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

            Object.keys(data).forEach((e)=>{
                newUserList.push({id:cnt ,name:e, img:data[e][1], active:data[e][0] , focus:0});
                cnt++;
            })
            if (newUserList.length!=0)
            setUsers(newUserList);  
            setShowUsers(newUserList);
        })
        socket.on("friend-disconnected" , data=>{

            let newUserList = users.map((e)=>{
                if (e.name===data){
                    e.active=0;
                }
                return e;
            });
            setUsers(newUserList);
        })
        socket.on("friend-connected" , data=>{

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
        socket.on("addSingle-duoList" , data=>{
            setUsers([...users , data]);
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
            <SearchUserArea users = {showUsers} changeUser = {changeUser} onchange ={searchUser}/>
            <ChattingArea currentUser = {currentUser} user = {users[currentUser]} curUserData={curUserData} socket={socket}/>
        </div>
    )
}

export default ChatArea;
import {React , useState , useEffect} from "react";
import "./RequestNGroup.css"
import ToggleSwitch from "./toggleSwitch/ToggleSwitch";
import User from "./user/User";
import search from "../../images/icons/search.png"

const RequestNGroup = (props)=>{
    const {socket , curUserData} = props;
    const [globalSearchResult , setGlobalSearchResult] = useState([])  
    const [recievedRequestList , setRecievedRequestList] = useState([]);
    const [sentRequestList , setSentRequestList] = useState([]);


    const sendRequest = (data)=>{
        socket.emit("send-user-request" , [curUserData.username  , data]);
    }
    const userSearch = (data)=>{
        socket.emit("search-user-global" , data);
    }


    useEffect(()=>{
        socket.on("recieve-sentRequestList" , data=>{
            let newSentRequestList = []; let cnt = 1;
            data.forEach((e)=>{
                newSentRequestList.push({id:cnt, name:e[0] , img:e[1] }); cnt++;
            })
                setSentRequestList(newSentRequestList);
        })
        socket.on("recieve-recievedRequestList" , data=>{
            let newRecievedRequestList = []; let cnt = 1;
            data.forEach((e)=>{
                newRecievedRequestList.push({id:cnt, name:e[0] , img:e[1] }); cnt++;
            })
                setRecievedRequestList(newRecievedRequestList);
        })
        socket.on("search-user-global-response", data=>{
            let newGlobalSearchList = []; let cnt = 1;
            data.forEach((e)=>{
                if (e[0]!=curUserData.username)
                    newGlobalSearchList.push({id:cnt, name:e[0] , img:e[1] }); cnt++;
            })
                setGlobalSearchResult(newGlobalSearchList);
        })
        
    },[socket])

    return(
        <div className="requestAreaMainBody">
            <div className="makeFriendsArea">
                <div className="sliderMakeFriends">
                    <ToggleSwitch label={"lul"} />
                </div>
                <div className="searchUserAreaRequests">
                    <div className="addUserBox">
                        <div className="searchBarAddUser">
                            <div className="searchContainer">
                                <img src={search} className="searchIconAddUser"></img>
                                <input className="searchUserInputBoxAddUser" placeholder="Type Username" onChange={(e)=>{
                                    userSearch(e.target.value);
                                }}></input>
                            </div>
                        </div>
                        <div className="userLogDisplayAddUser">
                            {
                                globalSearchResult.map(user => {
                                    return(<User area="send" name={user.name}  img ={user.img} />);
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="requestArea">
                <div className="requestAreaMain">
                    <div className="pendingRequestArea">
                            <div className="recievedRequestMessage">
                                Recieved Request
                            </div>
                            <div className="recievedRequestArea">
                                {
                                    recievedRequestList.map(user => {
                                        return(<User area="recieve" name={user.name}  img ={user.img} />);
                                    })
                                }
                            </div>
                    </div>
                    <div className="acceptRequestArea">
                    <div className="recievedRequestMessage">
                                Pending Request
                            </div>
                            <div className="recievedRequestArea">
                                {
                                    sentRequestList.map(user => {
                                        return(<User area="" name={user.name}  img ={user.img} />);
                                    })
                                }
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestNGroup;
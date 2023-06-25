import {React , useState} from "react";
import "./RequestNGroup.css"
import ToggleSwitch from "./toggleSwitch/ToggleSwitch";
import User from "./user/User";
import search from "../../images/icons/search.png"

const RequestNGroup = ()=>{
    const [users , setUsers] = useState([{ id:0 ,name:"Armaan"  ,img : 0 }  
                                        ,{ id:1 ,name:"Dhruv"   ,img : 1 } 
                                        ,{ id:2 ,name:"Ananya"  ,img : 1 }
                                        ,{ id:3 ,name:"Sarthak" ,img : 2 }
                                        ,{ id:4 ,name:"Sarthak" ,img : 3 }
                                        ,{ id:5 ,name:"Sarthak" ,img : 1 }
                                        ,{ id:6 ,name:"Sarthak" ,img : 3 }
                                        ,{ id:7 ,name:"Sarthak" ,img : 1 }
                                        ,{ id:8 ,name:"Sarthak" ,img : 2 }]);

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
                                <input className="searchUserInputBoxAddUser" placeholder="Type Username"></input>
                            </div>
                        </div>
                        <div className="userLogDisplayAddUser">
                            {
                                users.map(user => {
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
                                    users.map(user => {
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
                                    users.map(user => {
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
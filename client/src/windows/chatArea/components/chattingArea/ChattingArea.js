import { React, useState , useEffect } from "react";
import "./ChattingArea.css";
import icon1 from "../../../../images/userIcons/1.jpg";
import icon2 from "../../../../images/userIcons/2.jpg";
import icon3 from "../../../../images/userIcons/1.jpg";
import icon4 from "../../../../images/userIcons/2.jpg";
import send from "../../../../images/icons/send.png";
import smile from "../../../../images/icons/smile.png";
import Messages from "../messages/Messages";
import {
    decrypt, encrypt,
} from "../../../../helper.js";

const ChattingArea = (props) => {
    const {user , curUserData  , socket} = props;
    const iconList = [icon1, icon2, icon3, icon4];
    const [chatHistory, SetchatHistory] = useState([]);
    const [curChatKey , setCurChatKey]  = useState("");
    function sendMessage(data) {
        if (user!="") {
            encrypt(curChatKey, data).then((encryptedMessage1) => {
                encrypt(curUserData.publicKey, data).then(
                    
                    (encryptedMessage0) => {
                        let tt = new Date();
                        let messageData = {
                            time: tt,
                            sender: curUserData.username,
                            reciever: user.name,
                            message: [encryptedMessage0, encryptedMessage1],
                        };
                        SetchatHistory([
                            ...chatHistory,
                            {
                                time: messageData.time,
                                sender: messageData.sender,
                                message: data,
                            },
                        ]);
                        socket.emit("sending-message", messageData);
                    }
                );
            });
        }
    }
    useEffect(()=>{
        socket.on("recieve-chat-details" ,  async ({publicKey , messageList})=>{
            console.log("I recieved",publicKey , messageList , curUserData.privateKey);
            setCurChatKey(publicKey);
            let newMessageList = [];
            await Promise.all(
                messageList.map(async (e) => {
                    var ne = e;
                    ne.time = new Date(ne.time);
                    ne.message = await decrypt(
                        curUserData.privateKey,
                        e.message,
                        0
                    ).catch(err=>{
                        console.log(err);
                    });
                    newMessageList.push(ne);
                })
            );
            SetchatHistory(newMessageList);
        })
        socket.on("recieve-single-message" , async  data=>{
            console.log(data[0] , user);
            const v = user.name;
            if (data[0].sender===v){
                data[0].time = new Date(data[0].time);
                data[0].message = await decrypt(curUserData.privateKey , data[0].message , 0);
                let newChatHistory = [...chatHistory , data[0]];
                SetchatHistory(newChatHistory);

            }
        })

        return ()=>{
            socket.off("recieve-single-message");
            socket.off("recieve-chat-details");
        }
        
    },[socket , user])
    return (
        <div className="chattingAreaMainBody">
            <div className="userInfoAndIcons">
                <div className="userProfilePictureAboveChat">
                    {user && (
                        <>
                            <img
                                src={iconList[user.img]}
                                className="profilePictureAboveChat"
                            ></img>
                            <div className="nameDisplayChatArea">
                                {user.name}
                            </div>
                        </>
                    )}
                </div>
                <div className="chatAreaIcons"></div>
            </div>
            <div className="chatBox">
                <div className="messageBoxMain">
                    {user && <Messages messages={chatHistory} me={user.name} />}
                </div>
                <div className="sendMessageBoxMain">
                    <div className="sendMessageBoxMain_2">
                        <img src={smile} className="smileIcon"></img>
                        <input
                            className="messageInput" id="messageInputMain"
                            placeholder="Type a message"
                            onKeyDown={(e)=>{
                                if (e.keyCode==13){
                                    sendMessage(document.getElementById("messageInputMain").value);
                                    e.target.value = "";
                                }
                            }}  
                        ></input>
                        <button className="sendButton" onClick={(e)=>{
                            sendMessage(document.getElementById("messageInputMain").value);
                            document.getElementById("messageInputMain").value = "";
                        }}>
                            <img src={send} className="sendIcon"></img>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChattingArea;

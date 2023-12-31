import { React, useState, useEffect } from "react";
import "./ChattingArea.css";
import back from "../../../../images/icons/back.png";
import send from "../../../../images/icons/send.png";
import smile from "../../../../images/icons/smile.png";
import Messages from "../messages/Messages";
import { decrypt, encrypt } from "../../../../helper.js";
import userIcons from "../../../../images/importImages";
import EmojiPicker from "emoji-picker-react";

const ChattingArea = (props) => {
    const { user, curUserData, socket, currentUser } = props;
    const [chatHistory, SetchatHistory] = useState([]);
    const [curChatKey, setCurChatKey] = useState("");
    const [emojiPicker, setEmojiPicker] = useState(0);
    var objDiv = document.getElementsByClassName("messagesMainBoxSetting")[0];

    const processOutsideClick = (e)=>{
        if(emojiPicker){
            const flyoutEl = document.getElementsByClassName("emojiPicker")[0];
            let targetEl = e.target;    
            if(targetEl !== flyoutEl) {
                flyoutEl.style.display="none";
            }    
        }
    }


    const goBackToSearch = () => {
        let x = window.matchMedia("(max-width: 650px)");
        let searchdisplay = document.getElementsByClassName(
            "searchUserAreaMainBody"
        )[0];
        let chatareadisplay = document.getElementsByClassName(
            "chattingAreaMainBody"
        )[0];
        if (x.matches) {
            searchdisplay.style.display = "block";
            chatareadisplay.style.display = "none";
        }
    };
    const scrollToBottom = () => {
        if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    };

    useEffect(() => {
        SetchatHistory([]);
    }, [currentUser]);

    useEffect(() => {
        if (
            chatHistory.length != 0 &&
            chatHistory[chatHistory.length - 1].sender === curUserData.username
        ) {
            scrollToBottom();
        }
    }, [chatHistory]);

    function sendMessage(data) {
        if (user != "") {
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
    useEffect(() => {
        socket.on(
            "recieve-chat-details",
            async ({ publicKey, messageList }) => {
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
                        ).catch((err) => {});
                        newMessageList.push(ne);
                    })
                );
                SetchatHistory(newMessageList);
            }
        );
        socket.on("recieve-single-message", async (data) => {
            const v = user.name;
            if (data[0].sender === v) {
                data[0].time = new Date(data[0].time);
                data[0].message = await decrypt(
                    curUserData.privateKey,
                    data[0].message,
                    0
                );
                let newChatHistory = [...chatHistory, data[0]];
                SetchatHistory(newChatHistory);
            }
        });

        return () => {
            socket.off("recieve-single-message");
            socket.off("recieve-chat-details");
        };
    }, [socket, user, chatHistory]);
    return (
        <>
            <div className="chattingAreaMainBody">
                <div className="userInfoAndIcons">
                    <div className="userProfilePictureAboveChat">
                        <button className="backButton" onClick={goBackToSearch}>
                            <img src={back} className="backButtonImage"></img>
                        </button>
                        {user && (
                            <>
                                <img
                                    src={userIcons[user.img]}
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
                <div className="chatBox" >
                    <div className="messageBoxMain" onMouseDown={processOutsideClick}>
                        {user && (
                            <Messages messages={chatHistory} me={user.name} />
                        )}
                    </div>
                    {emojiPicker ? (
                        <div className="emojiPicker" >
                            <EmojiPicker
                                height="100%"
                                width="100%"
                                onEmojiClick={(e) => {
                                    document.getElementById("messageInputMain").value =
                                        document.getElementById("messageInputMain")
                                            .value + e.emoji;
                                    setEmojiPicker(0);
                                }}
                                emojiStyle="google"
                                theme={"white"}
                            />
                        </div>      
                    ) 
                    : 
                    <>
                    </>
                    }
                    <div className="sendMessageBoxMain">
                        <div className="sendMessageBoxMain_2">
                            <img
                                src={smile}
                                className="smileIcon"
                                onMouseDown={(e) => {
                                    setEmojiPicker(1 ^ emojiPicker);
                                }}
                            ></img>
                            <input
                                className="messageInput"
                                id="messageInputMain"
                                placeholder="Type a message"
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                        sendMessage(
                                            document.getElementById(
                                                "messageInputMain"
                                            ).value
                                        );
                                        e.target.value = "";
                                    }
                                }}
                            ></input>
                            <button
                                className="sendButton"
                                onClick={(e) => {
                                    sendMessage(
                                        document.getElementById(
                                            "messageInputMain"
                                        ).value
                                    );
                                    document.getElementById(
                                        "messageInputMain"
                                    ).value = "";
                                }}
                            >
                                <img src={send} className="sendIcon"></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default ChattingArea;

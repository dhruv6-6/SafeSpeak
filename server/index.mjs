import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v1 as uuidv1 } from 'uuid';

import {
    dbConnect,
    addUserData,
    getUserData,
} from "./database/userFunctions.mjs";
import {
    addRoomData,
    getRoomData,
} from "./database/roomFunction.mjs";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

let socketUsername = {};
app.get("/", (req, res) => {
    res.send("running server well and good");
});

io.on("connection", function (socket) {
    console.log(socket.id + " connected!"); 
    socket.on("sign-up-init", async (data) => {
        let f = 1;
        await getUserData({ username: data.username }).then((res) => {
            if (res.length != 0) {
                f = 0;
                socket.emit("username-exist", data);
            }
        });
        if (f === 1) {
            socketUsername[socket.id] = data.username;
            var expData = data;
            expData["rooms"] = {};
            expData["duos"] = {};
            expData["avatar"] = Math.floor(Math.random() * 2);
            await addUserData(expData);
            socket.emit("sign-up-complete", data);
        }
    });
    socket.on("login-init", async (username) => {
        getUserData({ username: username }).then((res) => {
            if (res.length == 0) {
                socket.emit("user-not-found", {});
            } else {
                socket.emit("login-response", {
                    username: res[0].username,
                    publicKey: res[0].publicKey,
                    encryptedPrivateKey: res[0].encryptedPrivateKey,
                    encryptedPassword: res[0].encryptedPassword
                });
            }
        });
    });
    socket.on("login-authenticate" , async (data)=>{
        socketUsername[socket.id] = data.username;
        getUserData({username:data.username}).then(async res=>{
            var expData=  res[0];
            expData.socketID = data.socketID;
            await addUserData(expData);
        })
        socket.emit("login-success" ,data);
    })
    socket.on("search-user-global" , async (data)=>{
        var expData = [ ];
        await getUserData({}).then(res=>{
            res.forEach((e)=>{
                if (e.username.length >= data.length && e.username.substring(0 , data.length)==data){
                    expData.push([e.username , e.avatar]);
                }
            })
        })
        socket.emit("search-user-global-response" , expData);
    })
    socket.on("send-user-request" , async (data)=>{
        var expData;
        await getUserData({username:data.sender}).then(res=>{
            expData = res[0];
        })
        if (("sentRequests" in expData)===false)
            expData["sentRequests"] = [];
        
        
        expData["sentRequests"] = [ data.reciever  , ...expData["sentRequests"] ];
        await addUserData(expData);
        
        
        await getUserData({username:data.reciever}).then(res=>{
            expData = res[0];
        })
        if (("recievedRequests" in expData)===false)
            expData["recievedRequests"] = [];
        
        
        expData["recievedRequests"] = [ data.sender  , ...expData["recievedRequests"] ];
        await addUserData(expData);
    

    })
    socket.on("get-sentRequestList" , async (data)=>{
        let expData = [];
        getUserData({username:data}).then(async res=>{
            await Promise.all(
                res[0].sentRequests.map(async e=>{
                await getUserData({username:e}).then(res2=>{
                    expData.push([e , res2[0].avatar]);
                })
                return {};
            }));
            socket.emit("recieve-recievedRequestList" ,expData);
        })
    })
    socket.on("get-recievedRequestList" , async (data)=>{
        let expData = [];
        getUserData({username:data}).then(async res=>{
            await Promise.all(
                res[0].recievedRequests.map(async e=>{
                await getUserData({username:e}).then(res2=>{
                    expData.push([e , res2[0].avatar]);
                })
                return {};
            }));
            socket.emit("recieve-recievedRequestList" ,expData);
        })
    })
    socket.on("accept-request", async (data)=>{
        var expData ;
        await getUserData({username:data[0]}).then(res=>{
            expData = res[0];
        })

        expData.sentRequests = expData.sentRequests.filter((e)=>{
            return e!=data[1];            
        })
        expData.recievedRequests = expData.recievedRequests.filter((e)=>{
            return e!=data[1];
        })
        expData.duos[data[1]] =  uuidv1();
        await addUserData(expData);
        await addRoomData({roomID:expData.duos[data[1]] , messages:[] , participants:data})



        await getUserData({username:data[1]}).then(res=>{
            expData = res[0];
        })

        expData.sentRequests = expData.sentRequests.filter((e)=>{
            return e!=data[0];            
        })
        expData.recievedRequests = expData.recievedRequests.filter((e)=>{
            return e!=data[0];
        })
        expData.duos[data[0]] =  uuidv1();
        await addUserData(expData);
        await addRoomData({roomID:expData.duos[data[0]] , messages:[] , participants:data})

    })
    socket.on("get-duoList" , async (data)=>{
        var expData = null;
        var active = Array.from(io.sockets.sockets.keys());

        await getUserData({username:data}).then(res=>{
            if (res.length!=0)
                expData = res[0].duos;
        })
        if (expData!=null){
            await Promise.all(
                Object.keys(expData).map(async e=>{
                await getUserData({username:e}).then(res=>{
                    expData[e] = [active.includes(res[0].socketID) , res[0].avatar];  
                    io.to(res[0].socketID).emit("friend-connected" , data);
                })
                return {name:e ,img:expData[e][1] , active:expData[e][0]};
            }));
        }
        if (expData!=null){
            socket.emit("recieve-duoList" , expData);
        }
        
    })
    socket.on("get-chat-details" , async (data)=>{
        let key , chats, chatid;
        await getUserData({username:data[1]}).then((res)=>{
            key = res[0].publicKey;
        })
        await getUserData({username:data[0]}).then((res)=>{
            chatid = res[0].duos[data[1]];
        })
        await getRoomData({roomID:chatid}).then((res)=>{
            chats = res[0].messages;
        })
        socket.emit("recieve-chat-details" , {publicKey:key , messageList:chats});
    })
    socket.on("sending-message",  async (data)=>{
        await getUserData({username:data.sender}).then(res=>{
            console.log(Array.from(io.sockets.sockets.keys()));
            getRoomData({roomID: res[0]["duos"][data.reciever]}).then(async res2=>{
                let newD = res2[0];
                newD["messages"] = [...newD["messages"] , { time:data.time, sender:data.sender , message:data.message[0]}];
                await addRoomData(newD);

            })
        })
        await getUserData({username:data.reciever}).then(res=>{
            
            console.log("sending to him" , res[0].socketID);
            getRoomData({roomID: res[0].duos[data.sender]}).then(async res2=>{
                let newD = res2[0];
                newD["messages"] = [...newD["messages"] , { time:data.time, sender:data.sender , message:data.message[1]}];
                await addRoomData(newD);
                io.to(res[0].socketID).emit("recieve-single-message" ,[{ time:data.time, sender:data.sender , message:data.message[1]}] );

            })
        })

    })
   
    socket.on("disconnect",  ()=> {
        console.log("sending data\n");
        if (Object.keys(socketUsername).includes(socket.id)){
            getUserData({username:socketUsername[socket.id]}).then(res=>{
                Object.keys(res[0].duos).forEach((e)=>{
                    getUserData({username:e}).then(res2=>{
                        console.log("sending to:" , res2[0].socketID);
                        io.to(res2[0].socketID).emit("friend-disconnected" , socketUsername[socket.id]);
                    })
                })
            })
        }
        console.log("exiting:", socket.id);
    });
});

async function start() {
    await dbConnect();
    server.listen(3001, () => {
        console.log("listening on *:3001");
    });
}
start();

import mongoose from "mongoose";
import { roomSchema } from "./models/room.mjs";
const mongoURI = process.env.MONGODB_URI; 

const dbConnect = async function () {
    await mongoose
        .connect(
            mongoURI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
};
const addRoomData = async function (data) {
    const options = { upsert: true, new: true };

    return roomSchema.findOneAndUpdate({ roomID: data.roomID }, data, options)
    .exec()
    .then((dbRes) => {
      return dbRes;
    })
    .catch((err) => {
      throw err;
    });
};

const getRoomData = async function (data) {
    let Rdata = null,
        Rerr = null;
    await roomSchema
        .find(data)
        .then((dbRes) => {
            Rdata = dbRes;
        })
        .catch((err) => {
            Rerr = err;
        });
    return new Promise((resolve, reject) => {
        if (Rerr == null) {
            resolve(Rdata);
        } else {
            reject(Rerr);
        }
    });
};

export { dbConnect, addRoomData, getRoomData };

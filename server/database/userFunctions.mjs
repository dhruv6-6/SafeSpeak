import mongoose from "mongoose";
import { userSchema } from "./models/user.mjs";
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

const addUserData = async function (data) {
    const options = { upsert: true, new: true };
  
  return userSchema.findOneAndUpdate({ username: data.username }, data, options)
    .exec()
    .then((dbRes) => {
      return dbRes;
    })
    .catch((err) => {
      throw err;
    });
};

const getUserData = async function (data) {
    let Rdata,
        Rerr = null;
    await userSchema
        .find(data)
        .then((dbRes) => {
            Rdata = dbRes;
        })
        .catch((err) => {
            Rerr = err;
        });
    return new Promise((resolve, reject) => {
        if (Rerr == null) resolve(Rdata);
        else reject(Rerr);
    });
};
export { dbConnect, addUserData, getUserData };

import { connectDB } from "../config/db.js";
import {User, AuthProvider, Chat, Label} from "../models/Models.js"

async function startServer(){
  await connectDB();
  checkAll();
}
startServer();

async function checkAll(){
  const users = await User.find();
  const providers = await AuthProvider.find();
  const chats = await Chat.find();
  const labels = await Label.find();

  console.log("users: ", users);
  console.log("providers: ", providers);
  console.log("chats: ", chats);
  console.log("labels: ", labels);

}
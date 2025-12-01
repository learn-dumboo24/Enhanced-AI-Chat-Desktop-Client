import { Schema, model, Types } from "mongoose";

interface IChat {
    role: string;
    prompt: string;
    labelId: Types.ObjectId;

    parentId ?: Types.ObjectId;

    userId : Types.ObjectId;
    createdAt: Date
    updatedAt: Date
}

const chatSchema = new Schema<IChat>({
    role: { type: String, required: true }, // role is user or assistant
    prompt: { type: String, required: true },
    labelId: { type: Schema.Types.ObjectId, ref: "Label",required: true },
    parentId: { type: Schema.Types.ObjectId, ref:"Chat" },
    userId: { type: Schema.Types.ObjectId, ref:"User",required: true},
},
{timestamps:true}
)

export const Chat = model<IChat>("Chat",chatSchema);


// model Chat {
//   chatId String @id @default(auto()) @map("_id") @db.ObjectId
//   role String // user or assistant
//   text String 
//   chatLabel String @db.ObjectId

//   parentId String? @db.ObjectId

//   userId String @db.ObjectId
//   user User @relation(fields: [userId], references: [userId])
  
//   createdAt DateTime @default(now())
// }
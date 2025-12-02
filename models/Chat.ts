import { Schema, model, Types } from "mongoose";

interface IChat {
    role: string;
    text: string;
    labelId: Types.ObjectId;

    parentId ?: Types.ObjectId;

    userId : Types.ObjectId;
    createdAt: Date
    updatedAt: Date
}

const chatSchema = new Schema<IChat>({
    role: { type: String, required: true }, // role is user or assistant
    text: { type: String, required: true },
    labelId: { type: Schema.Types.ObjectId, ref: "Label",required: true },
    parentId: { type: Schema.Types.ObjectId, ref:"Chat" },
    userId: { type: Schema.Types.ObjectId, ref:"User",required: true},
},
{timestamps:true}
)

export const Chat = model<IChat>("chats",chatSchema);



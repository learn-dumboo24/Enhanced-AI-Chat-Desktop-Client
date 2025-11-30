import { Schema, model, Types } from "mongoose";

interface IUser {
    name?: string;
    email: string;
    password: string;
    profilePic?: string;

    createdAt: Date;
    updatedAt: Date;

    authProviders: Types.ObjectId[];
    chats: Types.ObjectId[];
    labels: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String, required:true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    authProviders: [{type: Schema.Types.ObjectId, ref: "AuthProvider"}],
    chats: [{type: Schema.Types.ObjectId, ref:"Chat"}],
    labels: [{type: Schema.Types.ObjectId, ref:"Label"}] 
},
{timestamps: true}
)

export const User = model<IUser>("User",userSchema);
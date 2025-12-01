import { Schema, model, Types } from "mongoose";

interface ILabel {
    userId: Types.ObjectId;
    title: string;
    createdAt: Date;
}

const labelSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref:"User", required:true},
    title: { type: String, required: true },
},{timestamps:true})

export const Label = model<ILabel>("Label",labelSchema);



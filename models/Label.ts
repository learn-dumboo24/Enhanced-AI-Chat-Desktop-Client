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


// model Label{
//   labelId String @id @default(auto()) @map("_id") @db.ObjectId

//   userId String @db.ObjectId
//   user User @relation(fields: [userId], references: [userId])

//   title String 
//   createdAt DateTime @default(now())
// }
import {Schema, model, Types} from "mongoose";

interface IAuthProvider {
    provider: string;
    providerId?: string;
    accessToken?: string;
    refreshToken?: string;

    userId: Types.ObjectId;

    tokenExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AuthProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String , required: true },
    providerId: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },

    userId: { type: Schema.Types.ObjectId, ref: "User" , required: true},
    tokenExpiresAt: { type: Date } 
},
{timestamps:true}
)

export const AuthProvider = model<IAuthProvider>("authproviders", AuthProviderSchema);

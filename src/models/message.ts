import mongoose from "mongoose";
import { MessageAttrs, MessageDoc } from "./interfaces/message";

interface MessageModel extends mongoose.Model<MessageDoc> {
    build(attrs: MessageAttrs): MessageDoc;
};

const messageSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    body:{
        type:String,
        required: true
    },
    deleted:{
        type: Boolean,
        default:false
    }
}, {timestamps:true})

messageSchema.statics.build = (attrs: MessageAttrs)=>{
    return new Message(attrs);
};
const Message = mongoose.model<MessageDoc, MessageModel>("Message", messageSchema);
export { Message };
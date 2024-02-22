import mongoose from "mongoose";
import { CommentAttrs, CommentDoc } from "./interfaces/comment";

interface CommentModel extends mongoose.Model<CommentDoc> {
    build(attrs: CommentAttrs): CommentDoc;
}

const commentSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    body:{
        type: String,
        required: true
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    disLikes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
}, {timestamps: true});

commentSchema.statics.build = (attrs: CommentAttrs)=>{
    return new Comment(attrs);
};
const Comment= mongoose.model<CommentDoc, CommentModel>("Comment", commentSchema);
export { Comment};
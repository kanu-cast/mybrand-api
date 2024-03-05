import mongoose from "mongoose";
import { BlogAttrs, BlogDoc } from "./interfaces/blog";

interface BlogModel extends mongoose.Model<BlogDoc> {
    build(attrs: BlogAttrs): BlogDoc;
};

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    imageObj:{},
    body:{
        type: String,
        required: true
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    archived:{
        type:Boolean,
        default: false
    },
    deleted:{
        type:Boolean,
        default: false
    }
}, {timestamps: true});

export const blogBuildFunction = blogSchema.statics.build = (attrs: BlogAttrs)=>{
    return new Blog(attrs);
};
const Blog = mongoose.model<BlogDoc, BlogModel>("Blog", blogSchema);
export { Blog };
const {Schema,model}=require('mongoose');
const UrlSchema=new Schema({
    urlCode:String,
    originalUrl:String,
    shortUrl:String,
},{timestamps:true});
module.exports=model('Url',UrlSchema);
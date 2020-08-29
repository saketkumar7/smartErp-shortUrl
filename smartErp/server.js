const express=require('express');
const {PORT,MONGO_URL}=require("./Config");
const {connect} =require('mongoose');
const validUrl=require("valid-url");
const shortId=require("shortid");
const {BASE_URL}=require("./Config");

const Url=require("./Model/Url");  
const app=express();

connect(MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(err) throw err;
    console.log("Database is connected");
  }
);

app.use(express.json({extended:false}));


app.post("/shortId",async(req,res)=>{
    let {originalUrl}=req.body;
    if(!validUrl.isUri(BASE_URL)){
        return res.status(401).json('invalid url');
    }

    let urlCode=shortId.generate();

    if(validUrl.isUri(originalUrl)){
        try{
            let url = await Url.findOne({originalUrl});
            console.log(url);
            if(url){
                res.json(url)
            } else{
                const shortUrl=BASE_URL + "/" + urlCode;
                url=new Url({
                    originalUrl,
                    shortUrl,
                    urlCode,
                    date:new Date(),  
                });
                await url.save();
                res.json(url)
            }
        }  catch(err) {
            console.log(err);
            res.status(500).json('server error');
        }
    } else{
        res.status(401).json('invalid url');
    }
})

app.get('/:code', async(req,res)=>{
    try{
        let url=await Url.findOne({urlCode:req.params.code});
    if(url){
        return res.redirect(url.originalUrl)
    } else{
        return res.status(404).json("no url found");
    }
    }catch(err){
        res.status(500).json('server error');
    }
})

app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log("server listening on port " + PORT);
})

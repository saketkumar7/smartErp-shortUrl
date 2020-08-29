require('dotenv').config();
module.exports={
    PORT:process.env.PORT,
    BASE_URL:process.env.BASE_URL,
    MONGO_URL:process.env.MONGO_URL,
};
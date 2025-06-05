require('dotenv').config(); 
const express= require('express')
const cors= require('cors');
const mongoose = require('mongoose');

const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

app.use(cors({
  origin: 'https://resume-analyzer-front-final.onrender.com',
}));



app.use(express.json());

app.use('/api',resumeRoutes);




app.use((err,req,res, next)=>{
    console.log('Error Handler',err);
    if(err.code=='LIMIT_FILE_SIZE'){
        return res.status(400).json({error:'File too large.'});
    }
    if(err.message && err.message.includes('Invalid file type')){
        return res.status(400).json({error:err.message});
    }
    res.status(500).json({errors:'Inernal Server Error'});
});

const PORT=process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

if(MONGO_URI){
    mongoose
    .connect(MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>{
        console.log('Connected to MongoDB');
        app.listen(PORT,()=>{
            console.log(`Server running on ${PORT}`);
        });
    })
    .catch((err)=>{
        console.log('MongoDB connection error:',err);
        process.exit(1);
    });
}
else{
    app.listen(PORT,()=>{
        console.log(`No MongoDB URI provided. Server running on ${PORT}`);
    });
}

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const resumeController = require('../controllers/resumeController');

const UPLOAD_DIR=process.env.UPLOAD_DIR || 'uploads';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 2*1024*1024;

const ALLOWED_MIMES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];



const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, UPLOAD_DIR);
    },
    filename:(req, file, cb)=>{
        const timestamp = Date.now();
        const originalName = path.basename(file.originalname, path.extname(file.originalname));
        const extension = path.extname(file.originalname);
        cb(null, `${originalName}-${timestamp}${extension}`);
    },
});




const fileFilter = (req, file,cb)=>{
    if (ALLOWED_MIMES.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('Invalid file type. Onlye PDF and DOCX are allowed.'), false);
    }
};

const upload = multer({
    storage,
    limits:{ fileSize: MAX_FILE_SIZE},
    fileFilter,
});






router.post('/upload',upload.single('resume'), resumeController.uploadResume);

module.exports=router;
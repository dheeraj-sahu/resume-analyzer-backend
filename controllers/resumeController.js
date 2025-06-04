const fs= require('fs');
const parserService = require('../services/parserService');
const Resume = require('../models/Resume');


exports.uploadResume = async (req, res, next)=>{
    try{
        if(!req.file){
            return res.status(400).json({errors:'No file uploaded or invalid file type'});
             console.log('→ [uploadResume] Multer gave req.file =', req.file);

        }
        const filePath = req.file.path;
        const mimeType = req.file.mimetype;

        const parsedData = await parserService.parseResume(filePath, mimeType);

        if(process.env.MONGO_URI){
            const resumeDoc = new Resume({
                filename: req.file.filename,
                parsedFields: parsedData,
                uploadDate: new Date(),
            });
            await resumeDoc.save();
        }
        fs.unlink(filePath, (err)=>{
            if(err) console.error('Error deleting temp file:', err);
        });

        return res.status(200).json({success: true, data: parsedData});
    } catch(error){
        console.log('Error in uploadResume:', error);
        next(error);
    }
};
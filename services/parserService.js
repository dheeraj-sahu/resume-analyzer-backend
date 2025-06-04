const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth')
const pdfParse = require('pdf-parse');


const {
    extractName,
    extractEmail,
    extractPhone,
    extractSkills,
    extractExperience,
    extractEducation,
} = require('../utils/extractors');




exports.parseResume = async (filePath, mimeType) => {
  const ext = path.extname(filePath).toLowerCase();
  console.log('→ [parseResume] filePath =', filePath);
  console.log('→ [parseResume] detected extension =', ext);
  console.log('→ [parseResume] MIME type =', mimeType);

  let rawText = '';

  if (mimeType && mimeType.trim().toLowerCase() === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    rawText = data.text;
  } else if (
    mimeType &&
    mimeType.trim().toLowerCase() === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    rawText = result.value;
  } else {
    throw new Error(`Unsupported file type for parsing: ${mimeType}`);
  }




  
  const name = extractName(rawText);
  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);
  const skills = extractSkills(rawText);
  const experience = extractExperience(rawText);
  const education = extractEducation(rawText);

  return {
    name,
    email,
    phone,
    skills,
    experience,
    education,
  };
};

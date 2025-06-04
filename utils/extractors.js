const NAME_REGEX = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?(?:\d{10}|\d{5}[-.\s]?\d{5})/g;

const SKILL_KEYWORDS = [
  'JavaScript', 'TypeScript', 'Node.js', 'Express', 'React', 'Angular', 'Vue',
  'MongoDB', 'MySQL', 'PostgreSQL', 'Python', 'Django', 'Flask', 'Java', 'Spring',
  'C++', 'C#', '.NET', 'HTML', 'CSS', 'Tailwind', 'AWS', 'Azure', 'Docker',
  'Kubernetes', 'Machine Learning', 'Data Analysis', 'Git', 'Linux', 'REST', 'GraphQL',
];

const EXPERIENCE_KEYWORDS = [
  'experience', 'work experience', 'professional experience', 'employment',
  'career history', 'job history', 'internship', 'projects',
];

const JOB_TITLE_KEYWORDS = [
  'manager', 'engineer', 'developer', 'analyst', 'consultant', 'designer',
  'teacher', 'nurse', 'doctor', 'assistant', 'technician', 'supervisor',
  'specialist', 'coordinator', 'director', 'executive', 'officer', 'intern',
];

const EDUCATION_KEYWORDS = [
  'education', 'educational qualification', 'academic qualifications',
  'academic background', 'degrees', 'certifications', 'courses', 'school',
  'university', 'college',
];

const DEGREE_KEYWORDS = [
  'bachelor', 'master', 'doctor', 'phd', 'mba', 'mtech', 'btech', 'diploma', 'certificate',
  'high school', 'secondary school', 'intermediate',
];


exports.extractName = (text) => {
  const lines = text.split(/\r?\n/).map(line => line.trim());
  for (const line of lines) {
    if (!line) continue;
    const match = line.match(NAME_REGEX);
    if (match) return match[0];
    return line;
  }
  return '';
};


exports.extractEmail = (text) => {
  const matches = text.match(EMAIL_REGEX);
  return matches && matches.length > 0 ? matches[0] : '';
};


exports.extractPhone = (text) => {
  const matches = text.match(PHONE_REGEX);
  return matches && matches.length > 0 ? matches[0] : '';
};

exports.extractSkills = (text) => {
  const found = new Set();
  const lowerText = text.toLowerCase();
  for (const skill of SKILL_KEYWORDS) {
    if (lowerText.includes(skill.toLowerCase())) {
      found.add(skill);
    }
  }
  return Array.from(found);
};


function extractSectionByKeywords(lines, startKeywords, stopKeywords = []) {
  let capture = false;
  let sectionLines = [];

  for (const line of lines) {
    if (!capture) {
      if (startKeywords.some(kw => line.toLowerCase().includes(kw.toLowerCase()))) {
        capture = true;
        sectionLines.push(line);
      }
    } else {
      if (stopKeywords.some(kw => line.toLowerCase().includes(kw.toLowerCase()))) {
        break; 
      }
      sectionLines.push(line);
    }
  }

  return sectionLines.join('\n').trim();
}


exports.extractExperience = (text) => {
  const lines = text.split('\n').map(line => line.trim());
  const experienceSection = extractSectionByKeywords(lines, EXPERIENCE_KEYWORDS);
  if (!experienceSection) return [];

  const expLines = experienceSection.split('\n').filter(Boolean);
  const experiences = [];

  for (const line of expLines) {
    if (JOB_TITLE_KEYWORDS.some(jt => new RegExp(`\\b${jt}\\b`, 'i').test(line))) {
      experiences.push(line);
    }
  }

  let result = experiences.length ? experiences.join('; ') : experienceSection;

  return result
    .replace(/([a-z])([A-Z])/g, '$1 $2') 
    .replace(/;\s*/g, '; ')             
    .replace(/\s{2,}/g, ' ')            
    .trim()
    .split(/;\s*/g)                     
    .map(item => item.replace(/\s{2,}/g, ' ').trim()) 
    .filter(Boolean);
};


/**
 * extractEducation(text)
 * - Extracts Education section and returns lines containing degree keywords.
 * - Returns concatenated string or full section if none matched.
 */
exports.extractEducation = (text) => {
  const lines = text.split('\n').map(line => line.trim());
  const educationSection = extractSectionByKeywords(lines, EDUCATION_KEYWORDS);
  if (!educationSection) return [];

  const eduLines = educationSection.split('\n').filter(Boolean);
  const educationDetails = [];

  for (const line of eduLines) {
    if (DEGREE_KEYWORDS.some(deg => new RegExp(`\\b${deg}\\b`, 'i').test(line))) {
      educationDetails.push(line);
    }
  }

  let result = educationDetails.length ? educationDetails.join('; ') : educationSection;

  return result
    .replace(/([a-z])([A-Z])/g, '$1 $2') // e.g. "ScienceCGPA" -> "Science CGPA"
    .replace(/\)\s*\[/g, '); [')        // fix misplaced brackets
    .replace(/;\s*/g, '; ')             // uniform spacing after ;
    .replace(/\s{2,}/g, ' ')            // clean multiple spaces
    .trim()
    .split(/;\s*/g)                     // split into individual education entries
    .map(item => item.replace(/\s{2,}/g, ' ').trim()) // final cleanup
    .filter(Boolean);
};

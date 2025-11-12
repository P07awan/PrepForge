import { useState } from 'react';
import { FileText, Download, ArrowLeft, Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award, Code, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  link: string;
}

interface Achievement {
  title: string;
  description: string;
  date: string;
}

export default function ResumeMakerPage() {
  const navigate = useNavigate();
  const [template, setTemplate] = useState<'modern' | 'professional' | 'creative' | 'minimal'>('modern');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    summary: '',
    skills: '',
    experiences: [{ company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }] as Experience[],
    education: [{ institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }] as Education[],
    projects: [{ name: '', description: '', technologies: '', link: '' }] as Project[],
    certifications: [{ name: '', issuer: '', date: '', link: '' }] as Certification[],
    achievements: [{ title: '', description: '', date: '' }] as Achievement[]
  });

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...formData.experiences];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, experiences: updated });
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, education: updated });
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...formData.projects];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, projects: updated });
  };

  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    const updated = [...formData.certifications];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, certifications: updated });
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: any) => {
    const updated = [...formData.achievements];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, achievements: updated });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }]
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }]
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', technologies: '', link: '' }]
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: '', issuer: '', date: '', link: '' }]
    });
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, { title: '', description: '', date: '' }]
    });
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((_, i) => i !== index)
    });
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  const removeCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index)
    });
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    });
  };

  // Modern Template - Blue/Purple Gradient
  const ModernTemplate = () => (
    <div className="bg-white p-6 text-[10px] leading-tight">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 -m-6 mb-3 rounded-t-lg">
        <h1 className="text-xl font-bold">{formData.firstName || 'John'} {formData.lastName || 'Doe'}</h1>
        {formData.summary && <p className="mt-1 text-blue-100 text-[9px]">{formData.summary}</p>}
        <div className="mt-2 flex flex-wrap gap-2 text-[8px]">
          {formData.email && (
            <div className="flex items-center gap-0.5">
              <Mail className="w-2.5 h-2.5" /> {formData.email}
            </div>
          )}
          {formData.phone && (
            <div className="flex items-center gap-0.5">
              <Phone className="w-2.5 h-2.5" /> {formData.phone}
            </div>
          )}
          {formData.location && (
            <div className="flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" /> {formData.location}
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      {formData.skills && (
        <div className="mb-3">
          <h2 className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1">
            <Code className="w-3 h-3" /> SKILLS
          </h2>
          <div className="flex flex-wrap gap-1">
            {formData.skills.split(',').map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[8px] font-medium">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {formData.experiences.some(exp => exp.company) && (
        <div className="mb-3">
          <h2 className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> EXPERIENCE
          </h2>
          {formData.experiences.filter(exp => exp.company).map((exp, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-[10px]">{exp.position}</h3>
                  <p className="text-gray-600 text-[9px]">{exp.company} • {exp.location}</p>
                </div>
                <span className="text-[8px] text-gray-500">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description && <p className="mt-0.5 text-gray-700 text-[9px]">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {formData.education.some(edu => edu.institution) && (
        <div className="mb-3">
          <h2 className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> EDUCATION
          </h2>
          {formData.education.filter(edu => edu.institution).map((edu, idx) => (
            <div key={idx} className="mb-1.5">
              <h3 className="font-bold text-[10px]">{edu.degree} in {edu.field}</h3>
              <p className="text-gray-600 text-[9px]">{edu.institution} • {edu.startDate} - {edu.endDate}</p>
              {edu.gpa && <p className="text-[8px] text-gray-600">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {formData.projects.some(proj => proj.name) && (
        <div className="mb-2">
          <h2 className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1">
            <Code className="w-3 h-3" /> PROJECTS
          </h2>
          {formData.projects.filter(proj => proj.name).map((proj, idx) => (
            <div key={idx} className="mb-1.5">
              <h3 className="font-bold text-[10px]">{proj.name}</h3>
              {proj.description && <p className="text-gray-700 text-[9px]">{proj.description}</p>}
              {proj.technologies && <p className="text-[8px] text-gray-600 mt-0.5">Tech: {proj.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {formData.achievements.some(ach => ach.title) && (
        <div className="mb-2">
          <h2 className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1">
            <Award className="w-3 h-3" /> ACHIEVEMENTS
          </h2>
          {formData.achievements.filter(ach => ach.title).map((ach, idx) => (
            <div key={idx} className="mb-1.5">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-[10px]">{ach.title}</h3>
                {ach.date && <span className="text-[8px] text-gray-500">{ach.date}</span>}
              </div>
              {ach.description && <p className="text-gray-700 text-[9px]">{ach.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Professional Template - Classic Black/White
  const ProfessionalTemplate = () => (
    <div className="bg-white p-6 text-[10px]">
      {/* Header */}
      <div className="text-center border-b-4 border-gray-800 pb-3 mb-3">
        <h1 className="text-2xl font-bold text-gray-900">{formData.firstName || 'John'} {formData.lastName || 'Doe'}</h1>
        <div className="mt-1 flex justify-center flex-wrap gap-2 text-[8px] text-gray-600">
          {formData.email && <span className="flex items-center gap-0.5"><Mail className="w-2.5 h-2.5" /> {formData.email}</span>}
          {formData.phone && <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" /> {formData.phone}</span>}
          {formData.location && <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {formData.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {formData.summary && (
        <div className="mb-3">
          <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-300 pb-0.5 mb-1">PROFESSIONAL SUMMARY</h2>
          <p className="text-gray-700 text-[9px]">{formData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {formData.experiences.some(exp => exp.company) && (
        <div className="mb-3">
          <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-300 pb-0.5 mb-1">PROFESSIONAL EXPERIENCE</h2>
          {formData.experiences.filter(exp => exp.company).map((exp, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-[8px] text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <p className="text-gray-700 italic text-[9px]">{exp.company}, {exp.location}</p>
              {exp.description && <p className="mt-0.5 text-gray-700 text-[9px]">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {formData.education.some(edu => edu.institution) && (
        <div className="mb-3">
          <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-300 pb-0.5 mb-1">EDUCATION</h2>
          {formData.education.filter(edu => edu.institution).map((edu, idx) => (
            <div key={idx} className="mb-1.5">
              <div className="flex justify-between">
                <h3 className="font-bold text-[10px]">{edu.degree} in {edu.field}</h3>
                <span className="text-[8px] text-gray-600">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-gray-700 text-[9px]">{edu.institution}</p>
              {edu.gpa && <p className="text-[8px] text-gray-600">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {formData.skills && (
        <div className="mb-2">
          <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-300 pb-0.5 mb-1">SKILLS</h2>
          <p className="text-gray-700 text-[9px]">{formData.skills}</p>
        </div>
      )}

      {/* Projects */}
      {formData.projects.some(proj => proj.name) && (
        <div className="mb-2">
          <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-300 pb-0.5 mb-1">PROJECTS</h2>
          {formData.projects.filter(proj => proj.name).map((proj, idx) => (
            <div key={idx} className="mb-1.5">
              <h3 className="font-bold text-[10px]">{proj.name}</h3>
              {proj.description && <p className="text-gray-700 text-[9px]">{proj.description}</p>}
              {proj.technologies && <p className="text-[8px] text-gray-600">Technologies: {proj.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {formData.achievements.some(ach => ach.title) && (
        <div className="mb-2">
          <h2 className="text-xs font-bold text-gray-900 border-b-2 border-gray-300 pb-0.5 mb-1">ACHIEVEMENTS</h2>
          {formData.achievements.filter(ach => ach.title).map((ach, idx) => (
            <div key={idx} className="mb-1.5">
              <div className="flex justify-between">
                <h3 className="font-bold text-[10px]">{ach.title}</h3>
                {ach.date && <span className="text-[8px] text-gray-600">{ach.date}</span>}
              </div>
              {ach.description && <p className="text-gray-700 text-[9px]">{ach.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Creative Template - Orange/Pink Sidebar
  const CreativeTemplate = () => (
    <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 text-[9px]">
      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-3">
        {/* Left Sidebar */}
        <div className="col-span-1 bg-gradient-to-b from-orange-500 to-pink-500 text-white p-3 rounded-lg">
          <h1 className="text-base font-bold mb-1">{formData.firstName || 'John'}</h1>
          <h1 className="text-base font-bold mb-2">{formData.lastName || 'Doe'}</h1>
          
          <div className="space-y-1.5 text-[8px]">
            {formData.email && (
              <div className="flex items-start gap-1">
                <Mail className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" />
                <span className="break-all">{formData.email}</span>
              </div>
            )}
            {formData.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-2.5 h-2.5 flex-shrink-0" /> {formData.phone}
              </div>
            )}
            {formData.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 flex-shrink-0" /> {formData.location}
              </div>
            )}
          </div>

          {formData.skills && (
            <div className="mt-3">
              <h3 className="font-bold mb-1 text-[9px]">SKILLS</h3>
              <div className="space-y-0.5">
                {formData.skills.split(',').slice(0, 6).map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-[8px]">
                    <CheckCircle className="w-2.5 h-2.5 flex-shrink-0" />
                    <span>{skill.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="col-span-2 space-y-2">
          {formData.summary && (
            <div>
              <h2 className="text-xs font-bold text-orange-600 mb-0.5">About Me</h2>
              <p className="text-gray-700 text-[8px]">{formData.summary}</p>
            </div>
          )}

          {formData.experiences.some(exp => exp.company) && (
            <div>
              <h2 className="text-xs font-bold text-orange-600 mb-0.5">Experience</h2>
              {formData.experiences.filter(exp => exp.company).map((exp, idx) => (
                <div key={idx} className="mb-1.5">
                  <h3 className="font-bold text-[9px]">{exp.position}</h3>
                  <p className="text-[8px] text-gray-600">{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  {exp.description && <p className="text-[8px] text-gray-700 mt-0.5">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {formData.education.some(edu => edu.institution) && (
            <div>
              <h2 className="text-xs font-bold text-orange-600 mb-0.5">Education</h2>
              {formData.education.filter(edu => edu.institution).map((edu, idx) => (
                <div key={idx} className="mb-1">
                  <h3 className="font-bold text-[9px]">{edu.degree} in {edu.field}</h3>
                  <p className="text-[8px] text-gray-600">{edu.institution} • {edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}

          {formData.projects.some(proj => proj.name) && (
            <div>
              <h2 className="text-xs font-bold text-orange-600 mb-0.5">Projects</h2>
              {formData.projects.filter(proj => proj.name).map((proj, idx) => (
                <div key={idx} className="mb-1">
                  <h3 className="font-bold text-[9px]">{proj.name}</h3>
                  {proj.description && <p className="text-[8px] text-gray-700">{proj.description}</p>}
                  {proj.technologies && <p className="text-[7px] text-gray-600 mt-0.5">Tech: {proj.technologies}</p>}
                </div>
              ))}
            </div>
          )}

          {formData.achievements.some(ach => ach.title) && (
            <div>
              <h2 className="text-xs font-bold text-orange-600 mb-0.5">Achievements</h2>
              {formData.achievements.filter(ach => ach.title).map((ach, idx) => (
                <div key={idx} className="mb-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[9px]">{ach.title}</h3>
                    {ach.date && <span className="text-[7px] text-gray-600">{ach.date}</span>}
                  </div>
                  {ach.description && <p className="text-[8px] text-gray-700">{ach.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Minimal Template - Clean and Simple
  const MinimalTemplate = () => (
    <div className="bg-white p-6 text-[10px]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-light text-gray-900 mb-1">{formData.firstName || 'John'} {formData.lastName || 'Doe'}</h1>
        <div className="flex gap-2 text-[8px] text-gray-600">
          {formData.email && <span>{formData.email}</span>}
          {formData.phone && <span>•</span>}
          {formData.phone && <span>{formData.phone}</span>}
          {formData.location && <span>•</span>}
          {formData.location && <span>{formData.location}</span>}
        </div>
      </div>

      {formData.summary && (
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed text-[9px]">{formData.summary}</p>
        </div>
      )}

      {formData.experiences.some(exp => exp.company) && (
        <div className="mb-4">
          <h2 className="text-[9px] font-bold text-gray-900 uppercase tracking-wider mb-2">Experience</h2>
          <div className="space-y-2">
            {formData.experiences.filter(exp => exp.company).map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-[8px] text-gray-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-[8px] text-gray-600 mb-0.5">{exp.company} • {exp.location}</p>
                {exp.description && <p className="text-gray-700 text-[9px]">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {formData.education.some(edu => edu.institution) && (
        <div className="mb-4">
          <h2 className="text-[9px] font-bold text-gray-900 uppercase tracking-wider mb-2">Education</h2>
          {formData.education.filter(edu => edu.institution).map((edu, idx) => (
            <div key={idx} className="mb-1.5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-900 text-[10px]">{edu.degree} in {edu.field}</h3>
                <span className="text-[8px] text-gray-500">{edu.endDate}</span>
              </div>
              <p className="text-[8px] text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </div>
      )}

      {formData.skills && (
        <div className="mb-3">
          <h2 className="text-[9px] font-bold text-gray-900 uppercase tracking-wider mb-2">Skills</h2>
          <p className="text-gray-700 text-[9px]">{formData.skills}</p>
        </div>
      )}

      {formData.projects.some(proj => proj.name) && (
        <div className="mb-4">
          <h2 className="text-[9px] font-bold text-gray-900 uppercase tracking-wider mb-2">Projects</h2>
          {formData.projects.filter(proj => proj.name).map((proj, idx) => (
            <div key={idx} className="mb-1.5">
              <h3 className="font-semibold text-gray-900 text-[10px]">{proj.name}</h3>
              {proj.description && <p className="text-gray-700 text-[9px]">{proj.description}</p>}
              {proj.technologies && <p className="text-[8px] text-gray-600">Technologies: {proj.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {formData.achievements.some(ach => ach.title) && (
        <div className="mb-3">
          <h2 className="text-[9px] font-bold text-gray-900 uppercase tracking-wider mb-2">Achievements</h2>
          {formData.achievements.filter(ach => ach.title).map((ach, idx) => (
            <div key={idx} className="mb-1.5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-900 text-[10px]">{ach.title}</h3>
                {ach.date && <span className="text-[8px] text-gray-500">{ach.date}</span>}
              </div>
              {ach.description && <p className="text-gray-700 text-[9px]">{ach.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPreview = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate />;
      case 'professional':
        return <ProfessionalTemplate />;
      case 'creative':
        return <CreativeTemplate />;
      case 'minimal':
        return <MinimalTemplate />;
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              Resume Maker
            </h1>
            <p className="text-gray-600 mt-1">
              Create a professional resume with live preview
            </p>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Template</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setTemplate('modern')}
            className={`group p-4 border-2 rounded-lg transition-all ${
              template === 'modern' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-blue-300 hover:shadow'
            }`}
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-3 flex items-center justify-center text-white font-bold">
              <span className="text-xs">Modern</span>
            </div>
            <p className="font-medium text-gray-900 text-sm">Modern</p>
            <p className="text-xs text-gray-600">Colorful gradient header</p>
          </button>

          <button
            onClick={() => setTemplate('professional')}
            className={`group p-4 border-2 rounded-lg transition-all ${
              template === 'professional' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-blue-300 hover:shadow'
            }`}
          >
            <div className="aspect-[3/4] bg-gray-800 rounded mb-3 flex items-center justify-center text-white font-bold">
              <span className="text-xs">Professional</span>
            </div>
            <p className="font-medium text-gray-900 text-sm">Professional</p>
            <p className="text-xs text-gray-600">Classic business style</p>
          </button>

          <button
            onClick={() => setTemplate('creative')}
            className={`group p-4 border-2 rounded-lg transition-all ${
              template === 'creative' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-blue-300 hover:shadow'
            }`}
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-orange-400 to-pink-500 rounded mb-3 flex items-center justify-center text-white font-bold">
              <span className="text-xs">Creative</span>
            </div>
            <p className="font-medium text-gray-900 text-sm">Creative</p>
            <p className="text-xs text-gray-600">Colorful sidebar design</p>
          </button>

          <button
            onClick={() => setTemplate('minimal')}
            className={`group p-4 border-2 rounded-lg transition-all ${
              template === 'minimal' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-blue-300 hover:shadow'
            }`}
          >
            <div className="aspect-[3/4] bg-gray-100 border border-gray-300 rounded mb-3 flex items-center justify-center text-gray-700 font-bold">
              <span className="text-xs">Minimal</span>
            </div>
            <p className="font-medium text-gray-900 text-sm">Minimal</p>
            <p className="text-xs text-gray-600">Clean and simple</p>
          </button>
        </div>
      </div>

      {/* Resume Builder Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4">
          {/* Personal Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="input"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="input"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="input"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="input"
              />
              <input
                type="text"
                placeholder="Location (City, Country)"
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="input md:col-span-2"
              />
              <textarea
                placeholder="Professional Summary (2-3 sentences about yourself)"
                value={formData.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                className="input md:col-span-2"
                rows={3}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
            <textarea
              placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js, Python, SQL)"
              value={formData.skills}
              onChange={(e) => updateField('skills', e.target.value)}
              className="input"
              rows={3}
            />
          </div>

          {/* Work Experience */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
              <button
                onClick={addExperience}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                + Add
              </button>
            </div>
            <div className="space-y-4">
              {formData.experiences.map((exp, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Experience #{idx + 1}</span>
                    {formData.experiences.length > 1 && (
                      <button onClick={() => removeExperience(idx)} className="text-red-600 text-sm">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                      className="input"
                    />
                    <input
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => updateExperience(idx, 'position', e.target.value)}
                      className="input"
                    />
                    <input
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                      className="input"
                    />
                    <input
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                      className="input"
                    />
                    <input
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                      className="input"
                      disabled={exp.current}
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(idx, 'current', e.target.checked)}
                      />
                      <span className="text-sm">Currently working</span>
                    </label>
                  </div>
                  <textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                    className="input"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
              <button onClick={addEducation} className="text-green-600 hover:text-green-700 font-medium text-sm">+ Add</button>
            </div>
            <div className="space-y-4">
              {formData.education.map((edu, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Education #{idx + 1}</span>
                    {formData.education.length > 1 && (
                      <button onClick={() => removeEducation(idx)} className="text-red-600 text-sm">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                      className="input"
                    />
                    <input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                      className="input"
                    />
                    <input
                      placeholder="Field"
                      value={edu.field}
                      onChange={(e) => updateEducation(idx, 'field', e.target.value)}
                      className="input"
                    />
                    <input
                      placeholder="GPA"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                      className="input"
                    />
                    <input
                      placeholder="Start Date"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                      className="input"
                    />
                    <input
                      placeholder="End Date"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                      className="input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
              <button onClick={addProject} className="text-green-600 hover:text-green-700 font-medium text-sm">+ Add</button>
            </div>
            <div className="space-y-4">
              {formData.projects.map((proj, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Project #{idx + 1}</span>
                    {formData.projects.length > 1 && (
                      <button onClick={() => removeProject(idx)} className="text-red-600 text-sm">Remove</button>
                    )}
                  </div>
                  <input
                    placeholder="Project Name"
                    value={proj.name}
                    onChange={(e) => updateProject(idx, 'name', e.target.value)}
                    className="input"
                  />
                  <textarea
                    placeholder="Project Description"
                    value={proj.description}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    className="input"
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                      value={proj.technologies}
                      onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                      className="input"
                    />
                    <input
                      placeholder="Project Link (optional)"
                      value={proj.link}
                      onChange={(e) => updateProject(idx, 'link', e.target.value)}
                      className="input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
              <button onClick={addAchievement} className="text-green-600 hover:text-green-700 font-medium text-sm">+ Add</button>
            </div>
            <div className="space-y-4">
              {formData.achievements.map((ach, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Achievement #{idx + 1}</span>
                    {formData.achievements.length > 1 && (
                      <button onClick={() => removeAchievement(idx)} className="text-red-600 text-sm">Remove</button>
                    )}
                  </div>
                  <input
                    placeholder="Achievement Title"
                    value={ach.title}
                    onChange={(e) => updateAchievement(idx, 'title', e.target.value)}
                    className="input"
                  />
                  <textarea
                    placeholder="Achievement Description"
                    value={ach.description}
                    onChange={(e) => updateAchievement(idx, 'description', e.target.value)}
                    className="input"
                    rows={2}
                  />
                  <input
                    placeholder="Date (optional)"
                    value={ach.date}
                    onChange={(e) => updateAchievement(idx, 'date', e.target.value)}
                    className="input"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Section - Sticky */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">Real-time</span>
            </div>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gray-50 p-2 border-b border-gray-300">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="bg-white h-[600px] overflow-auto">
                {renderPreview()}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="btn btn-secondary w-full">
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

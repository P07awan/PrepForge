import { useState } from 'react';
import { FileText, Download, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResumeMakerPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    summary: '',
    
    // Professional Experience
    experiences: [
      { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }
    ],
    
    // Education
    education: [
      { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
    ],
    
    // Skills
    skills: '',
    
    // Projects
    projects: [
      { name: '', description: '', technologies: '', link: '' }
    ],
    
    // Certifications
    certifications: [
      { name: '', issuer: '', date: '', link: '' }
    ]
  });

  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');

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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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
              Create a professional resume with our easy-to-use builder
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Template Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setTemplate('modern')}
            className={`p-4 border-2 rounded-lg transition-all ${
              template === 'modern' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="aspect-[8.5/11] bg-gradient-to-br from-green-100 to-green-200 rounded mb-3" />
            <p className="font-medium text-gray-900">Modern</p>
            <p className="text-sm text-gray-600">Clean and contemporary design</p>
          </button>
          <button
            onClick={() => setTemplate('classic')}
            className={`p-4 border-2 rounded-lg transition-all ${
              template === 'classic' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="aspect-[8.5/11] bg-gradient-to-br from-blue-100 to-blue-200 rounded mb-3" />
            <p className="font-medium text-gray-900">Classic</p>
            <p className="text-sm text-gray-600">Traditional professional layout</p>
          </button>
          <button
            onClick={() => setTemplate('minimal')}
            className={`p-4 border-2 rounded-lg transition-all ${
              template === 'minimal' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-3" />
            <p className="font-medium text-gray-900">Minimal</p>
            <p className="text-sm text-gray-600">Simple and elegant style</p>
          </button>
        </div>
      </div>

      {/* Resume Builder Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="input" />
              <input type="text" placeholder="Last Name" className="input" />
              <input type="email" placeholder="Email" className="input" />
              <input type="tel" placeholder="Phone" className="input" />
              <input type="text" placeholder="Location" className="input" />
              <input type="text" placeholder="LinkedIn URL" className="input" />
              <input type="text" placeholder="Portfolio URL" className="input col-span-full" />
              <textarea placeholder="Professional Summary" className="input col-span-full" rows={4} />
            </div>
          </div>

          {/* Work Experience */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
              <button onClick={addExperience} className="text-green-600 hover:text-green-700 font-medium text-sm">
                + Add Experience
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Company" className="input" />
                  <input type="text" placeholder="Position" className="input" />
                  <input type="text" placeholder="Location" className="input" />
                  <input type="date" placeholder="Start Date" className="input" />
                  <input type="date" placeholder="End Date" className="input" />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Currently working here</span>
                  </label>
                </div>
                <textarea placeholder="Description (responsibilities, achievements)" className="input" rows={3} />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
              <button onClick={addEducation} className="text-green-600 hover:text-green-700 font-medium text-sm">
                + Add Education
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Institution" className="input" />
                  <input type="text" placeholder="Degree" className="input" />
                  <input type="text" placeholder="Field of Study" className="input" />
                  <input type="text" placeholder="GPA" className="input" />
                  <input type="date" placeholder="Start Date" className="input" />
                  <input type="date" placeholder="End Date" className="input" />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
            <textarea 
              placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js, Python)" 
              className="input" 
              rows={3} 
            />
          </div>

          {/* Projects */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
              <button onClick={addProject} className="text-green-600 hover:text-green-700 font-medium text-sm">
                + Add Project
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                <input type="text" placeholder="Project Name" className="input" />
                <textarea placeholder="Description" className="input" rows={2} />
                <input type="text" placeholder="Technologies Used" className="input" />
                <input type="text" placeholder="Project Link" className="input" />
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
              <button onClick={addCertification} className="text-green-600 hover:text-green-700 font-medium text-sm">
                + Add Certification
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                <input type="text" placeholder="Certification Name" className="input" />
                <input type="text" placeholder="Issuing Organization" className="input" />
                <input type="date" placeholder="Issue Date" className="input" />
                <input type="text" placeholder="Credential URL" className="input" />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
            <div className="aspect-[8.5/11] bg-white border-2 border-gray-200 rounded-lg p-6 overflow-auto">
              <p className="text-center text-gray-500 text-sm">
                Resume preview will appear here
              </p>
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

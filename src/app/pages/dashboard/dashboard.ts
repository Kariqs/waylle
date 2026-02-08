import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string | undefined;
  github: string | undefined;
  portfolio: string | undefined;
}

interface Experience {
  title: string;
  company?: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

interface Education {
  institution: string;
  degree: string;
  graduationDate: string;
}

interface Project {
  name: string;
  description: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects?: Project[];
}

interface CoverLetterSection {
  opening: string;
  body: string[];
  closing: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DashboardComponent {
  private http = inject(HttpClient);

  currentStep = 1;
  uploadedFile: File | null = null;
  jobUrl = '';
  parsedJobData: any = null;
  generatedResume: ResumeData | null = null;
  generatedCoverLetter: CoverLetterSection | null = null;

  generationProgress = 0;
  isGenerating = false;
  isParsing = false;
  parseError: string | null = null;
  activeTab: 'resume' | 'coverLetter' = 'resume';

  steps = [
    { number: 1, label: 'Upload Resume', completed: false },
    { number: 2, label: 'Job URL', completed: false },
    { number: 3, label: 'Generate', completed: false },
    { number: 4, label: 'Results', completed: false },
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.uploadedFile = input.files[0];
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files?.length) this.uploadedFile = event.dataTransfer.files[0];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  removeFile(): void {
    this.uploadedFile = null;
  }

  continueFromUpload(): void {
    if (this.uploadedFile) {
      this.steps[0].completed = true;
      this.currentStep = 2;
    }
  }

  parseJobUrl(): void {
    if (!this.jobUrl.trim()) {
      this.parseError = 'Please enter a valid job URL';
      return;
    }

    this.isParsing = true;
    this.parseError = null;

    this.http
      .post<any>(`${environment.apiUrl}/api/resumes/extract`, { url: this.jobUrl })
      .subscribe({
        next: (data) => {
          this.parsedJobData = data;
          this.isParsing = false;
        },
        error: (err) => {
          this.isParsing = false;
          this.parseError =
            err.error?.message || 'Failed to parse job posting. Please check the URL.';
        },
      });
  }

  continueToGenerate(): void {
    if (this.parsedJobData && this.uploadedFile) {
      this.steps[1].completed = true;
      this.currentStep = 3;
      this.generateApplication();
    }
  }

  generateApplication(): void {
    this.isGenerating = true;
    this.generationProgress = 0;
    this.generatedResume = null;
    this.generatedCoverLetter = null;

    const formData = new FormData();
    formData.append('resume', this.uploadedFile!);
    formData.append(
      'jobDescription',
      this.parsedJobData.jobDescription || JSON.stringify(this.parsedJobData),
    );

    this.http.post<any>(`${environment.apiUrl}/api/resumes/tailor`, formData).subscribe({
      next: (res) => {
        this.generatedResume = res.resume || res.tailoredResume;
        this.generatedCoverLetter = res.coverLetter;
        this.completeGeneration();
      },
      error: () => {
        this.isGenerating = false;
        this.parseError = 'Failed to generate application. Please try again.';
      },
    });

    const interval = setInterval(() => {
      if (this.generationProgress < 92) {
        this.generationProgress += Math.random() * 9 + 4;
        if (this.generationProgress > 92) this.generationProgress = 92;
      }
    }, 280);
  }

  private completeGeneration(): void {
    this.generationProgress = 100;
    this.isGenerating = false;
    this.steps[2].completed = true;
    this.currentStep = 4;
  }

  switchTab(tab: 'resume' | 'coverLetter'): void {
    this.activeTab = tab;
  }

  goToStep(stepNumber: number): void {
    if (stepNumber <= this.currentStep) this.currentStep = stepNumber;
  }

  downloadResume(): void {
    if (!this.generatedResume) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const resumeHTML = this.generateResumeHTML(this.generatedResume);

    printWindow.document.write(resumeHTML);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  downloadCoverLetter(): void {
    if (!this.generatedCoverLetter) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const coverLetterHTML = this.generateCoverLetterHTML(this.generatedCoverLetter);

    printWindow.document.write(coverLetterHTML);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  private generateResumeHTML(resume: ResumeData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${resume.personalInfo.fullName} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.75in;
      background: white;
    }
    
    h1 {
      font-size: 22pt;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .contact-info {
      font-size: 11pt;
      margin-bottom: 20px;
    }
    
    h2 {
      font-size: 13pt;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 20px;
      margin-bottom: 10px;
      border-bottom: 1px solid #000;
      padding-bottom: 2px;
    }
    
    h3 {
      font-size: 11pt;
      font-weight: 700;
      margin-bottom: 2px;
    }
    
    .company, .institution {
      font-size: 11pt;
      margin-bottom: 2px;
    }
    
    .dates {
      font-size: 11pt;
      margin-bottom: 8px;
    }
    
    ul {
      margin-left: 20px;
      margin-bottom: 12px;
      list-style-type: disc;
    }
    
    li {
      margin-bottom: 4px;
    }
    
    .section-content {
      margin-bottom: 16px;
    }
    
    .skills-text {
      margin-bottom: 12px;
    }
    
    @media print {
      body { 
        padding: 0.75in;
        margin: 0;
      }
      @page {
        margin: 0;
        size: letter;
      }
    }
  </style>
</head>
<body>
  <h1>${resume.personalInfo.fullName}</h1>
  <div class="contact-info">
    ${resume.personalInfo.email || ''} ${resume.personalInfo.email && resume.personalInfo.phone ? '| ' : ''}${resume.personalInfo.phone || ''} ${(resume.personalInfo.email || resume.personalInfo.phone) && resume.personalInfo.location ? '| ' : ''}${resume.personalInfo.location || ''}
    ${resume.personalInfo.linkedin ? `<br>${resume.personalInfo.linkedin}` : ''}
    ${resume.personalInfo.github ? `<br>${resume.personalInfo.github}` : ''}
    ${resume.personalInfo.portfolio ? `<br>${resume.personalInfo.portfolio}` : ''}
  </div>
  
  ${
    resume.professionalSummary
      ? `
  <h2>Professional Summary</h2>
  <div class="section-content">${resume.professionalSummary}</div>
  `
      : ''
  }
  
  <h2>Work Experience</h2>
  ${resume.experience
    .map(
      (exp) => `
    <div class="section-content">
      <h3>${exp.title}</h3>
      ${exp.company ? `<div class="company">${exp.company}</div>` : ''}
      <div class="dates">${exp.startDate} – ${exp.endDate}</div>
      <ul>
        ${exp.responsibilities.map((resp) => `<li>${resp}</li>`).join('')}
      </ul>
    </div>
  `,
    )
    .join('')}
  
  ${
    resume.education.length
      ? `
  <h2>Education</h2>
  ${resume.education
    .map(
      (edu) => `
    <div class="section-content">
      <h3>${edu.degree}</h3>
      <div class="institution">${edu.institution}</div>
      <div class="dates">${edu.graduationDate}</div>
    </div>
  `,
    )
    .join('')}
  `
      : ''
  }
  
  ${
    resume.skills.length
      ? `
  <h2>Skills</h2>
  <div class="skills-text">${resume.skills.join(', ')}</div>
  `
      : ''
  }
  
  ${
    resume.projects && resume.projects.length
      ? `
  <h2>Projects</h2>
  ${resume.projects
    .map(
      (proj) => `
    <div class="section-content">
      <h3>${proj.name}</h3>
      <div>${proj.description}</div>
    </div>
  `,
    )
    .join('')}
  `
      : ''
  }
</body>
</html>
    `;
  }

  private generateCoverLetterHTML(coverLetter: CoverLetterSection): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cover Letter</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #000;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.75in;
      background: white;
    }
    
    p {
      margin-bottom: 16px;
      text-align: justify;
    }
    
    @media print {
      body { 
        padding: 0.75in;
        margin: 0;
      }
      @page {
        margin: 0;
        size: letter;
      }
    }
  </style>
</head>
<body>
  <p>${coverLetter.opening}</p>
  ${coverLetter.body.map((para) => `<p>${para}</p>`).join('')}
  <p>${coverLetter.closing}</p>
</body>
</html>
    `;
  }
}

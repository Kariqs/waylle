import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

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
  fullName: string;
  title: string;
  location?: string;
  email?: string;
  phone?: string;
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
    console.log('Resume download requested');
    // Implement real PDF generation (jsPDF, pdfmake, html-to-pdf, or backend endpoint)
  }

  downloadCoverLetter(): void {
    console.log('Cover letter download requested');
    // Implement real download logic
  }
}

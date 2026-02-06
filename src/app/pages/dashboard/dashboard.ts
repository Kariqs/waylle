import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule, FormsModule],
})
export class DashboardComponent {
  currentStep = 1;
  uploadedFile: File | null = null;
  jobUrl = '';
  parsedJobData: any = null;
  generationProgress = 0;
  isGenerating = false;
  activeTab: 'resume' | 'coverLetter' = 'resume';

  steps = [
    { number: 1, label: 'Upload Resume', completed: false },
    { number: 2, label: 'Job URL', completed: false },
    { number: 3, label: 'Generate', completed: false },
    { number: 4, label: 'Results', completed: false },
  ];

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadedFile = event.dataTransfer.files[0];
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  continueFromUpload() {
    if (this.uploadedFile) {
      this.steps[0].completed = true;
      this.currentStep = 2;
    }
  }

  parseJobUrl() {
    if (this.jobUrl) {
      // Mock parsing - replace with actual API call
      this.parsedJobData = {
        title: 'Senior Frontend Engineer',
        company: 'TechCorp Inc.',
        requirements: 'React, TypeScript, 5+ years experience, team leadership...',
      };
    }
  }

  continueToGenerate() {
    if (this.parsedJobData) {
      this.steps[1].completed = true;
      this.currentStep = 3;
      this.startGeneration();
    }
  }

  startGeneration() {
    this.isGenerating = true;
    this.generationProgress = 0;

    const interval = setInterval(() => {
      this.generationProgress += Math.random() * 15;
      if (this.generationProgress >= 100) {
        this.generationProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          this.steps[2].completed = true;
          this.currentStep = 4;
          this.isGenerating = false;
        }, 500);
      }
    }, 300);
  }

  goToStep(stepNumber: number) {
    if (stepNumber <= this.currentStep) {
      this.currentStep = stepNumber;
    }
  }

  removeFile() {
    this.uploadedFile = null;
  }

  downloadResume() {
    // Implement download logic
    console.log('Downloading resume...');
  }

  switchTab(tab: 'resume' | 'coverLetter') {
    this.activeTab = tab;
  }
}

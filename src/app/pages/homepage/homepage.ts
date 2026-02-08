import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css'],
})
export class HomepageComponent implements OnInit {
  // Scroll animation states
  heroVisible = false;
  featuresVisible = false;
  howItWorksVisible = false;
  pricingVisible = false;

  ngOnInit() {
    // Trigger hero animation on load
    setTimeout(() => {
      this.heroVisible = true;
    }, 100);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.checkScrollPosition();
  }

  checkScrollPosition() {
    const scrollPosition = window.pageYOffset + window.innerHeight;

    // Features section
    const featuresElement = document.getElementById('features');
    if (featuresElement && scrollPosition > featuresElement.offsetTop + 100) {
      this.featuresVisible = true;
    }

    // How it works section
    const howItWorksElement = document.getElementById('how-it-works');
    if (howItWorksElement && scrollPosition > howItWorksElement.offsetTop + 100) {
      this.howItWorksVisible = true;
    }

    // Pricing section
    const pricingElement = document.getElementById('pricing');
    if (pricingElement && scrollPosition > pricingElement.offsetTop + 100) {
      this.pricingVisible = true;
    }
  }

  features = [
    {
      icon: 'fa-solid fa-brain',
      title: 'AI-Powered Rewriting',
      description:
        'Our engine restructures your resume to match job requirements while preserving your authentic experience.',
    },
    {
      icon: 'fa-solid fa-bullseye',
      title: 'ATS Optimization',
      description:
        'Automatically includes the right keywords and formatting that applicant tracking systems look for.',
    },
    {
      icon: 'fa-solid fa-file-lines',
      title: 'Cover Letter Generation',
      description:
        'Get a professionally written, personalized cover letter that complements your tailored resume.',
    },
    {
      icon: 'fa-solid fa-bolt',
      title: 'Instant Results',
      description:
        'From job URL to polished application materials in under 60 seconds. No more hours of manual editing.',
    },
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Fact Preservation',
      description:
        'We never fabricate experience. Your resume is rephrased and restructured, not reinvented.',
    },
    {
      icon: 'fa-solid fa-clock',
      title: 'Application Tracking',
      description:
        "Keep track of every job you've applied to with tailored materials organized in one place.",
    },
  ];

  steps = [
    {
      number: '01',
      icon: 'fa-solid fa-cloud-arrow-up',
      title: 'Upload Your Resume',
      description:
        "Drop your existing resume — PDF or DOCX. We'll parse and understand your experience.",
    },
    {
      number: '02',
      icon: 'fa-solid fa-link',
      title: 'Paste the Job URL',
      description:
        'Paste the job posting link. Our AI extracts the title, company, and full job description.',
    },
    {
      number: '03',
      icon: 'fa-solid fa-microchip',
      title: 'AI Tailors Everything',
      description:
        'Our engine rewrites your resume and generates a cover letter, optimized for ATS systems.',
    },
    {
      number: '04',
      icon: 'fa-solid fa-download',
      title: 'Download & Apply',
      description:
        'Get ATS-ready PDF files. Your tailored resume and cover letter, ready to submit.',
    },
  ];

  pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Try Waylle with limited applications',
      features: [
        '3 tailored applications',
        'Resume parsing',
        'Cover letter generation',
        'PDF export',
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'Unlimited applications for active job seekers',
      features: [
        'Unlimited applications',
        'Priority AI processing',
        'Application tracking',
        'Multiple resume templates',
        'Email support',
      ],
      buttonText: 'Go Pro',
      buttonStyle: 'bg-black text-white hover:bg-gray-800',
      popular: true,
    },
    {
      name: 'Power',
      price: '$39',
      period: '/month',
      description: 'Bulk mode and advanced features for power users',
      features: [
        'Everything in Pro',
        'Bulk application mode',
        'Advanced ATS scoring',
        'Analytics dashboard',
        'Priority support',
        'Chrome extension access',
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300',
      popular: false,
    },
  ];
}

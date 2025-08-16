import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '../../services/business.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrl: './business-detail.component.css',
})
export class BusinessDetailComponent {
  basicInfoForm!: FormGroup;

  constructor(
    private _businessService: BusinessService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: Router
  ) {
    this.basicInfoForm = this.fb.group({
      business_name: ['', Validators.required],
      business_logo: ['', Validators.required],
      business_email: ['', Validators.required],
      business_phone: ['', Validators.required],
      business_tagline: ['', Validators.required],
      business_description: ['', Validators.required],
      registration_number: ['', Validators.required],
      kra_pin: ['', Validators.required],
      facebook: ['', Validators.required],
      twitter: ['', Validators.required],
      linkedin: ['', Validators.required],
      instagram: ['', Validators.required],
      website: ['', Validators.required],
    });
  }

  addBusinessInfo(){
    const data = {
      
    }
    console.log('basicInfoForm',this.basicInfoForm.value);

  }

  faqs = [
    {
      question: 'How quickly can you complete an errand?',
      answer:
        'We offer same-day service for most errands. Our typical response time is under 1 hour, and we can usually complete errands within 2-4 hours depending on the complexity and location.',
      isOpen: false,
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, debit cards, PayPal, and payments through the ErrandHub platform. For regular clients, we also offer monthly billing options.',
      isOpen: false,
    },
    {
      question: 'Are your staff background checked?',
      answer:
        'Yes, all our team members undergo thorough background checks, including criminal history and reference verification. We are also fully insured and bonded for your peace of mind.',
      isOpen: false,
    },
    {
      question: 'Can I request the same errand runner?',
      answer:
        "Absolutely! Many of our clients prefer working with the same team member. You can request your preferred errand runner when booking, and we'll do our best to accommodate based on availability.",
      isOpen: false,
    },
  ];

  showForm = false;
  showServiceForm = false;

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  toggleServiceForm() {
    this.showServiceForm = !this.showServiceForm;
  }

  navigateBack() {
    window.history.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '../../services/business.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrl: './business-detail.component.css',
})
export class BusinessDetailComponent implements OnInit {
  basicInfoForm!: FormGroup;
  serviceInfoForm!:FormGroup
  logoPreviewUrl: string | ArrayBuffer | null = null;
  logoInitials: string = 'BN';
  businessId!:string;
  business_details:any;
  categories:any
  logged_in_user!:any;
  is_logged_in_user = false;
  my_business_id:any;

  constructor(
    private _businessService: BusinessService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.businessId = this.route.snapshot.paramMap.get('id')!;
     this.basicInfoForm = this.fb.group({
      business_name: ['', Validators.required],
      business_logo: [''],
      business_email: ['', Validators.required],
      business_phone: ['', Validators.required],
      business_tagline: [''],
      business_description: ['', Validators.required],
      registration_number: ['', Validators.required],
      kra_pin: ['', Validators.required],
      facebook: [''],
      twitter: [''],
      linkedin: [''],
      instagram: [''],
      website: [''],
    });

    this.logged_in_user = JSON.parse(localStorage.getItem('user_id') || 'null');

    this.serviceInfoForm = this.fb.group({

    })


    this.basicInfoForm
      .get('business_name')
      ?.valueChanges.subscribe((name: string) => {
        if (name) {
          const words = name.trim().split(' ');
          if (words.length === 1) {
            this.logoInitials = words[0].substring(0, 2).toUpperCase();
          } else {
            this.logoInitials = (words[0][0] + words[1][0]).toUpperCase();
          }
        } else {
          this.logoInitials = 'BN';
        }
      });
    this.getBusinessInfo()
    this.getCategories()
  }

  getCategories(){
    this._businessService.getCategories().subscribe((res:any)=>{
      console.log(res);
      this.categories = res;
    })
  }

  getBusinessInfo() {
    this._businessService.getBusinessDetail(this.businessId).subscribe((res:any)=>{
      console.log(res);
      this.business_details = res;
      console.log(this.logged_in_user,this.business_details.user);

      if(this.logged_in_user === this.business_details.user){
        this.is_logged_in_user = true
        // this.my_business_id = this.business_details.id
      }
    })
  }

  addBusinessInfo() {
    if (this.basicInfoForm.invalid) {
      this.basicInfoForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const formData = new FormData();

    // Loop through all controls and append to FormData
    Object.keys(this.basicInfoForm.controls).forEach((key) => {
      const controlValue = this.basicInfoForm.get(key)?.value;
      if (key === 'business_logo' && controlValue instanceof File) {
        formData.append(key, controlValue); // append file
      } else {
        formData.append(key, controlValue);
      }
    });

    this._businessService.addBusiness(formData).subscribe({
      next: (res) => {
        this.toastr.success('Business information added successfully!');
        // this.route.navigate(['/dashboard']); // adjust route as needed
      },
      error: (err) => {
        this.toastr.error('Failed to add business information.');
        console.error(err);
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.basicInfoForm.patchValue({ business_logo: file });
      this.basicInfoForm.get('business_logo')?.updateValueAndValidity();
      // generate preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo() {
    this.basicInfoForm.patchValue({ business_logo: null });
    this.basicInfoForm.get('business_logo')?.updateValueAndValidity();
    this.logoPreviewUrl = null; // go back to initials
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

import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { BusinessService } from '../../../services/business.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-service',
  templateUrl: './update-service.component.html',
  styleUrl: './update-service.component.css',
})
export class UpdateServiceComponent implements OnInit {
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private _businessService = inject(BusinessService);
  private toastr = inject(ToastrService);

  @Input() service_name!: string;
  @Input() category!: string;
  @Input() price_type!: string;
  @Input() price_from!: string;
  @Input() price_to!: string;
  @Input() service_id!:string;
  @Output() serviceUpdated = new EventEmitter<void>();

  serviceInfoForm!: FormGroup;
  categories: any;
  closeResult: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.serviceInfoForm = this.fb.group({
      name: [this.service_name, Validators.required],
      category: [this.category, Validators.required],
      price_type: [this.price_type, Validators.required],
      price_from: [this.price_from, Validators.required],
      price_to: [this.price_to, Validators.required],
    });
    this.getCategories();
  }

   getCategories() {
    this._businessService.getCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

   updateService() {
    this._businessService.updateService(this.serviceInfoForm.value,this.service_id).subscribe(
      (res: any) => {
        this.toastr.success('Service updated successfully');
        this.closeResult.apply(``)
        this.modalService.dismissAll()
        this.serviceUpdated.emit();
      },
      (err) => {
        this.toastr.error('Failed to update Service.');
      }
    );
  }

}

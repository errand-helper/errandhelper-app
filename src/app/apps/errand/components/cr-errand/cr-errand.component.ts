import { Component } from '@angular/core';

@Component({
  selector: 'app-cr-errand',
  templateUrl: './cr-errand.component.html',
  styleUrl: './cr-errand.component.css'
})
export class CrErrandComponent {

  navigateBack() {
    window.history.back();
  }

}

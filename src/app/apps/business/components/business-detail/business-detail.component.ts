import { Component } from '@angular/core';

@Component({
  selector: 'app-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrl: './business-detail.component.css'
})
export class BusinessDetailComponent {

   faqs = [
    {
      question: 'What is Angular?',
      answer: 'Angular is a platform for building mobile and desktop web applications.',
      isOpen: false,
      id:1
    },
    {
      question: 'What is TypeScript?',
      answer: 'TypeScript is a strongly typed programming language that builds on JavaScript.',
      isOpen: false,
      id:2
    },]

toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  navigateBack() {
    window.history.back();
  }
}

import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { SharedModule } from '../../sharedmodule/sharedmodule.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  standalone: true,
  imports: [SharedModule,RouterModule]
})
export class HomepageComponent implements AfterViewInit {

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Navbar scroll effect
    this.renderer.listen('window', 'scroll', () => {
      const navbar = document.querySelector('.navbar-custom');
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    });

    // Smooth scrolling for navigation links
    const anchors = this.el.nativeElement.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor: HTMLAnchorElement) => {
      this.renderer.listen(anchor, 'click', (e: Event) => {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // Counter animation
    const animateCounters = () => {
      const counters = this.el.nativeElement.querySelectorAll('.stats-counter');
      counters.forEach((counter: HTMLElement) => {
        const target = parseInt(counter.textContent!.replace(/\D/g, ''));
        const suffix = counter.textContent!.replace(/\d/g, '');
        let current = 0;
        const increment = target / 100;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target + suffix;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current) + suffix;
          }
        }, 20);
      });
    };

    // Trigger counter animation when hero section is visible
    const heroSection = this.el.nativeElement.querySelector('.hero-section');
    if (heroSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(heroSection);
    }
  }
}
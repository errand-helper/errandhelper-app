import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrDetailsComponent } from './err-details.component';

describe('ErrDetailsComponent', () => {
  let component: ErrDetailsComponent;
  let fixture: ComponentFixture<ErrDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

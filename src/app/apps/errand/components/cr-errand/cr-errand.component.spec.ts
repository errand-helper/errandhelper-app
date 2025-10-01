import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrErrandComponent } from './cr-errand.component';

describe('CrErrandComponent', () => {
  let component: CrErrandComponent;
  let fixture: ComponentFixture<CrErrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrErrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrErrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

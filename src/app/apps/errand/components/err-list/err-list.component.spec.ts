import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrListComponent } from './err-list.component';

describe('ErrListComponent', () => {
  let component: ErrListComponent;
  let fixture: ComponentFixture<ErrListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

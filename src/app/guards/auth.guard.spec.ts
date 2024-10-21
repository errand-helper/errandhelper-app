import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let guard: authGuard;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        authGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(authGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if token is present', () => {
    spyOn(localStorage, 'getItem').and.returnValue('valid_token');
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should deny activation and navigate to login if no token is present', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    expect(guard.canActivate(route, state)).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/authentication/login']);
  });
});

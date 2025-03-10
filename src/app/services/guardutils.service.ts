import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuardutilsService {

  getRole(): string {
    const profile = localStorage.getItem('user_type');
    if (profile) {
      const jsProfile = JSON.parse(profile);
      return jsProfile;
    } else {
      console.log('yes!');
      return '';
    }

  }
}

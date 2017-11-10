import { Injectable } from '@angular/core';
import skygear from 'skygear';

@Injectable()
export class SkygearService {
  isConfigurated = false;
  getSkygear() {
    if (this.isConfigurated) {
      console.log("Configed");
      return Promise.resolve(skygear);
    }
    console.log("Create Config");
    let promise = skygear.config({
      'endPoint': 'https://sanssugar.skygeario.com/',
      'apiKey': 'c140232c1b4b48d2813fc2d014a5696b',
    }).then(()=> {
      this.isConfigurated = true
      console.log("Signing up");
      return Promise.resolve(skygear);
      // return skygear.auth.signupAnonymously();
    })/*.then(() => {
      console.log("Done");
      this.isConfigurated = true
    });
    */
    return promise;
  }
}

export const Tracking = skygear.Record.extend('Tracking');
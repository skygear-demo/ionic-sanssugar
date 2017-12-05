import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';


import {
  SkygearService
} from '../../app/skygear.service';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  height: number;
  weight: number;
  gender: string;
  birthday: Date;
  name: string;
  skygear: Any;

  constructor(public api: Api, private skygearService: SkygearService) { 
    this.height = 160;
    this.weight = 50;
    this.gender = 'm';
    this.name='';
  }

  getCurrentUser () {
    // TODO

    var skygear = this.skygearService.getSkygear();

    var skygearPromise = new Promise((resolve, reject) => {

    this.skygearService.getSkygear()
      .then((skygear) => {
        this.skygear = skygear;
        console.log(`Skygear OK`);
        resolve(skygear.auth.currentUser);
      })
      .catch((error) => {
        console.log(`Skygear Error`);
        reject(error);
      });

    });

     return skygearPromise;
  }

  setName(name) {
    this.name = name;
    console.log("User name set:"+name);
  }

  setProfile(height, weight, gender) {
    if(height != null) {
      this.height = height;
    }
    if(weight != null) {
      this.weight = weight;
    }
    if(gender != null) {
      this.gender = gender;
    }
  }

  signupSkygear() {
    var skygear = this.skygearService.getSkygear();
    var skygearPromise = new Promise((resolve, reject) => {
      this.skygearService.getSkygear()
        .then((skygear) => {
          this.skygear = skygear;
          console.log(`Skygear OK`);
          skygear.auth.signupAnonymously().then((user)=> {
            console.log(user);
            resolve(user);
          });
        })
        .catch((error) => {
          console.log(`Skygear Error`);
          console.error(error);
          reject(error);
        });
      });
      return skygearPromise;
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}

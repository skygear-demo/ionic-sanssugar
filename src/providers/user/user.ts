import 'rxjs/add/operator/toPromise';
import { Storage } from '@ionic/storage';

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
  email: string;
  birthday: Date;
  name: string;
  skygear;

  constructor(public api: Api,
    private skygearService: SkygearService,
    private storage: Storage) { 
    this.height = 160; // default
    this.weight = 50; // default
    this.gender = 'm'; // default
    this.name=''; // default
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
    this.storage.setItem("name", name);
    console.log("User name set:"+name);
  }

  setEmail(email) {
    this.email = email;
    this.storage.setItem("email", email);
    console.log("User email set:"+email);
  }

  setWeight(weight) {
    this.weight = weight;
    this.storage.setItem("weight", weight);
  }

  setHeight(height) {
    this.height = height;
    this.storage.setItem("height", height);
  }

  setGender(gender) {
    this.gender=gender;
    this.storage.setItem("gender", gender);
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
            this.storage.set("userID", user._id);
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

  logoutSkygear() {
    var skygear = this.skygearService.getSkygear();
    var skygearPromise = new Promise((resolve, reject) => {
      this.skygearService.getSkygear()
        .then((skygear) => {
          this.skygear = skygear;
          console.log(`Skygear OK`);
          skygear.auth.logout().then((user)=> {
            console.log(user);
            this.storage.set("userID", null);
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
}

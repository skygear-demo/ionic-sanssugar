import 'rxjs/add/operator/toPromise';
import { Storage } from '@ionic/storage';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import moment from 'moment';

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
 * }
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
    this.email = '';

    this.loadUserFromStorage();
  }

  getCurrentUser () {
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

  getUserEmail() {
    return new Promise(resolve => {

      this.storage.get("email").then(email => {
        this.email = email;
        resolve(email);
      });
    });
  }

  getUserGender() {
    return new Promise(resolve => {
      this.storage.get("gender").then(gender => {
        this.gender = gender;
        resolve(gender);
      });
    });
  }


  loadUserFromStorage() {
    this.storage.get("email").then(email => {
      this.email = email;

      console.log('email = ', email);
    });

    this.storage.get("name").then(name => {
      this.name = name;
      console.log('name = ', name);
    });

    this.storage.get("gender").then(gender => {
      this.gender = gender?gender: 'm';
      console.log('gender = ', gender);
    });


    this.storage.get("height").then(height => {
      this.height = height;
    });

    this.storage.get("weight").then(weight => {
      this.weight = weight;
    });
  }

  setName(name) {
    this.name = name;
    this.storage.set("name", name);
    console.log("User name set:"+name);
  }

  setEmail(email) {
    this.email = email;
    this.storage.set("email", email);
    console.log("User email set:"+email);
  }

  setWeight(weight) {
    this.weight = weight;
    this.storage.set("weight", weight);
  }

  setHeight(height) {
    this.height = height;
    this.storage.set("height", height);
  }

  setGender(gender) {
    this.gender = gender;
    this.storage.set("gender", gender);
  }

  setBirthday(birthday:Date) {
    this.birthday = birthday;
    this.storage.set("birthday", moment(birthday).format('DDMMYYYY'));
  }

  updateProfileToSkygear() {
    var skygear = this.skygearService.getSkygear().then(skygear =>{
      const modifiedRecord = new skygear.UserRecord({
        '_id': 'user/' + skygear.auth.currentUser.id,
        'email': this.email,
        'name': this.name,
        'gender': this.gender,
        'height': this.height,
        'weight': this.weight
      });
      skygear.publicDB.save(modifiedRecord).then((user) => {
        console.log(user); // updated user record
      });
    });
  }

  getProfile() {
    var skygear = this.skygearService.getSkygear();
    const query = new skygear.Query(skygear.UserRecord);
    query.equalTo('_id', skygear.auth.currentUser.id);
    skygear.publicDB.query(query).then((records) => {
      const record = records[0];
      console.log(record);
    }, (error) => {
      console.error(error);
    });
  }

  signupSkygear() {
    var skygearPromise = new Promise((resolve, reject) => {
      this.skygearService.getSkygear()
        .then((skygear) => {
          this.skygear = skygear;
          console.log(`Skygear OK`);
          skygear.auth.signupAnonymously().then((user)=> {
            console.log(user);
            this.storage.set("userID", user._id);
            this.updateProfileToSkygear();
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

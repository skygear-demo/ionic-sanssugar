import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

import {
  SkygearService,
  Tracking
} from '../../app/skygear.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, email: string, password: string } = {
    name: 'Test Human',
    email: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  private signupErrorString: string;

  skygear = null;
  skygearState = "Not ready";

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    private skygearService: SkygearService,
    public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  ngOnInit(): void {
    console.log(`OnInit Signup`);
    this.skygearService.getSkygear()
      .then((skygear) => {
        this.skygear = skygear;
        this.skygearState = "Configurated";
        console.log(`Skygear OK`);
        console.log(skygear);
      })
      .catch((error) => {
        this.skygearState = "Errored";
        console.log(`Skygear Error`);
      });
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  doSignup() {
    // Sign up user here
    this.skygearService.getSkygear()
      .then((skygear)=> {
        console.log(skygear);
        console.log(skygear.auth.currentUser);
        skygear.auth.signupWithEmail(this.account.email,this.account.password).then((user)=> {
          this.showToast(`Welcome ${this.account.name}!`);
          this.navCtrl.push(MainPage);
        }, (err) => {
          // Unable to sign up
          this.showToast(this.signupErrorString);
      })
    })
  }
}

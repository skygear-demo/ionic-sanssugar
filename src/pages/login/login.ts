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
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };

  skygear = null;
  skygearState = "Not ready";

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    private skygearService: SkygearService,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  ngOnInit(): void {
    console.log(`OnInit`);
    this.skygearService.getSkygear()
      .then((skygear) => {
        this.skygear = skygear;
        this.skygearState = "Configurated";
        console.log(`Skygear OK`);
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

  // Attempt to login in 
  doLogin() {
    this.skygearService.getSkygear()
      .then((skygear)=> {
        console.log(skygear);
        console.log(skygear.auth.currentUser);

        skygear.auth.loginWithEmail(this.account.email,this.account.password).then((user)=> {
          this.showToast(`Welcome back!`);
          this.navCtrl.push(MainPage);
        }, (err) => {
          // Unable to sign up
          this.showToast(this.loginErrorString);
      })
      }, (err) => {
        this.showToast(this.loginErrorString);
      })
  }
}

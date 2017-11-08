import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';

import {
  SkygearService,
  Tracking
} from '../../app/skygear.service';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  skygear = null;
  skygearState = "Not ready";

  constructor(public navCtrl: NavController,
    private skygearService: SkygearService) { }

  ngOnInit(): void {
    console.log(`OnInit Welcome`);

    this.checkLogin();
  }

  checkLogin() {
    this.skygearService.getSkygear()
      .then((skygear)=> {
        console.log(skygear);
        console.log(skygear.auth.currentUser);
        if (skygear.auth.currentUser != null) {
          this.navCtrl.push(MainPage);
        }
      }).catch((error) => {
        this.skygearState = "Errored";
        console.log(`Skygear Error`);
        console.log(error);
      });
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}

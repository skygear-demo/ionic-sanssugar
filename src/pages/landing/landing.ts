import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { User } from '../../providers/providers';

import { InfoPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})
export class LandingPage {
  username: string;
  email: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private user: User) {
      this.username = this.user.name;
      this.email = this.user.email;
    }

  ionViewDidLoad() {
    this.navCtrl.swipeBackEnabled=false;
  }


  showWarning(title, msg) {
    let alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: ['OK']
      });
      alert.present();
  }

  checkName() {
    return (this.username != "");

  }

  next() {
    console.log("next");
    if (this.checkName()) {
      this.user.name = this.username;
      this.user.email = this.email;
      this.navCtrl.push('InfoPage');
    } else {
      this.showWarning('Enter your name.', 'Please let us know how to call you. Enter your name to continue.')
    }
  }
}

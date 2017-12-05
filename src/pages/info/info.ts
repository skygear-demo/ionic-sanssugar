import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items, User } from '../../providers/providers';

import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {
  gender: string;
  height: number;
  weight: number;
  birthday: Date;
  loading: Any;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public items: Items,
    public user: User) {
    this.gender = user.gender;
    this.height = user.height;
    this.weight = user.weight;
    this.birthday = user.birthday;
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();

  }

  next() {
    console.log("next");

    // Register and signup
    this.presentLoadingDefault();
    this.user.signupSkygear().then((user)=> {
      this.navCtrl.push('ChartPage');
      this.loading.dismiss();
    }, (error) => {
      console.log("error");
    });

  }

  back() {
    this.navCtrl.push('LandingPage');
  }

}

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

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
  loading: any;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public items: Items,
    public user: User) {
    this.gender = this.user.gender;
    this.height = this.user.height;
    this.weight = this.user.weight;
    this.birthday = this.user.birthday;
  }

  presentLoadingDefault(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }

  updateGender(gender) {
    this.user.setGender(gender);
    this.gender = gender;
  }

  ionViewDidLoad() {
    this.navCtrl.swipeBackEnabled=true;
  }

  showWarning(title, msg) {
    let alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: ['OK']
      });
      alert.present();
  }

  next() {
    console.log("next");

    this.user.setGender(this.gender);
    this.user.setHeight(this.height);
    this.user.setWeight(this.weight);
    this.user.setBirthday(this.birthday);

    // Register and signup
    this.presentLoadingDefault('Signing you in...');
    this.user.signupSkygear().then((user)=> {
      this.navCtrl.push('ChartPage');
      this.loading.dismiss();
    }, (error) => {
      console.log("error");
      this.loading.dismiss();
      this.showWarning('Sorry.','Please connect to the Internet and try again.')
    });
  }

  back() {
    this.navCtrl.push('LandingPage');
  }

}

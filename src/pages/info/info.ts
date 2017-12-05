import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    public user: User) {
    this.gender = user.gender;
    this.height = user.height;
    this.weight = user.weight;
    this.birthday = user.birthday;

  }

  next() {
    console.log("next");

    // Register and signup
    this.user.signupSkygear().then((user)=> {
      this.navCtrl.push('ChartPage');
    }, (error) => {
      console.log("error");
    });

    
  }

  back() {
    this.navCtrl.push('LandingPage');
  }

}

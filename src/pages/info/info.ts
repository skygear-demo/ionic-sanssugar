import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';

import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {
  mgender;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items) {
    this.mgender='m';

  }

  next() {
    console.log("next");
    this.navCtrl.push('ChartPage');
  }

  back() {
    this.navCtrl.push('LandingPage');
  }

}

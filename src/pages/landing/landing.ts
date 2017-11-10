import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';

import { InfoPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})
export class LandingPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items) { }


  next(){
    console.log("next");
    this.navCtrl.push('InfoPage');
  }
}

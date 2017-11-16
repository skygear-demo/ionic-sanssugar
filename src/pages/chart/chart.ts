import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { Item } from '../../models/item';

import { Tracking } from '../../models/tracking';
import { Trackings, Items } from '../../providers/providers';

import { Config } from '../../app/config'

import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage {
 
  barChart: any;

  currentItems: any = [];
  todaySum: number;
  myLimit: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    public trackings: Trackings,
    private alertCtrl: AlertController,
    private socialSharing: SocialSharing) { }

  updateSummary() {
    this.todaySum = this.trackings.getTodaySummary();
    this.myLimit = this.trackings.getMyLimit();

    var percent = (this.todaySum / this.myLimit)* 100;
    percent = percent > 100? 100 : percent;

    // animate the chart
    var todayChart = document.getElementById('today-chart');

    // percent
    var percentageCircle = document.getElementById('percentage-circle');
    console.log(percent);

    // /*Hard coded percentage formula*/
    var c = (300 - 4) * 3.14;
    var cOffSet = (percent/100*0.8) * c;
    percentageCircle.setAttribute("style","stroke-dasharray:"+cOffSet+"px "+c+"px; stroke-dashoffset:"+cOffSet+"px");

    todayChart.className += " animate";
  }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    this.currentItems = this.items.query({
      name: val
    });
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }


  showDisclaimer() {
    let alert = this.alertCtrl.create({
        title: 'Disclaimer',
        subTitle: 'Sans Sugar is for education purposes only and is not a substitute for medical advice from a doctor or health care provider.',
        buttons: ['OK']
      });
      alert.present();
  }

  ionViewDidLoad() {
    //  Disclaimer
    var hasShownDisclaimer = localStorage.getItem("hasShownDisclaimer")
    if(hasShownDisclaimer !== "true") {
      this.showDisclaimer();
      localStorage.setItem("hasShownDisclaimer", "true");
    }

    // Load doughnut Chart
    this.updateSummary();
      }

  add() {
    //this.navCtrl.push('ListMasterPage');
    this.navCtrl.push('SearchPage');
  }

  share() {
    // Check if sharing via email is supported
    this.socialSharing.canShareViaEmail().then(() => {
      // Sharing via email is possible
    }).catch(() => {
      // Sharing via email is not possible
    });

    // Share via email
    this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

}

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { Item } from '../../models/item';

import { Tracking } from '../../models/tracking';
import { Trackings, Items, User } from '../../providers/providers';

import { Config } from '../../app/config'

import { MainPage } from '../pages';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage {
 
  barChart: any;

  currentItems: any = [];
  todaySum: number;
  todayRemain: number;
  myLimit: number;
  todayText: string;
  loading: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    public trackings: Trackings,
    public user: User,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private socialSharing: SocialSharing) { }

  getTodayString() {
    let date = moment().format('D MMM YYYY');
    return date;
  }

  updateSummary() {
    this.todayText = this.getTodayString();
    this.myLimit = this.trackings.getMyLimit();
    this.trackings.getDateSugarTotal(new Date()).then(result => {
      this.todaySum = result.sugar;
      this.todayRemain = Math.round((this.myLimit - this.todaySum) * 100) / 100;
      this.todayRemain = (this.todayRemain > 0)? this.todayRemain : 0;

      console.log('todaySum', this.todaySum);
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

      /* TODO update style when level changes */
      
      if (percent < 50) {
        console.log("stage 1");
        document.getElementById('chart-main-content').className += " stage-1";
        document.getElementById('chart-img').className += " stage-1";

        todayChart.className += " stage-1";

      } else if (percent >= 50 && percent < 75) {
        document.getElementById('chart-main-content').className += " stage-2";
        document.getElementById('chart-img').className += " stage-2";
        todayChart.className += " stage-2";
        console.log("stage 2");
      } else if (percent >= 75) {
        document.getElementById('chart-main-content').className += " stage-3";
        document.getElementById('chart-img').className += " stage-3";
        todayChart.className += " stage-3";
        console.log("stage 3");
      }
    });
  }

  howManyCansOfCoke(gram) {
    // 35g per can of 330ml
    var noOfCans = Math.round(gram / 35 * 100) /100;
    return noOfCans;
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
    // Check User Logged in
    this.user.getCurrentUser().then((user) => {
      console.log(user);
      if (!user) {
        this.navCtrl.swipeBackEnabled=false;
        this.navCtrl.push("LandingPage");
      } else {
        this.initChartView();
      }
    })
  }

  ionViewWillEnter() {
    // Load doughnut Chart
    this.updateSummary();
  }

  initChartView() {
    //  Disclaimer
    var hasShownDisclaimer = localStorage.getItem("hasShownDisclaimer")
    if(hasShownDisclaimer !== "true") {
      this.showDisclaimer();
      localStorage.setItem("hasShownDisclaimer", "true");
    }

  }

  add() {
    //this.navCtrl.push('ListMasterPage');
    this.navCtrl.push('SearchPage');
  }

  showHistory() {
    this.navCtrl.push('ListMasterPage');
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

    this.socialSharing.shareViaFacebook('Hey','img.png','url').then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });

    this.socialSharing.share('message', 'subject', 'file', 'url').then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }


  presentLoadingDefault(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });

    this.loading.present();
  }


  // Test only 
  logout() {
    // Register and signup
    this.presentLoadingDefault('Logging out...');
    this.user.logoutSkygear().then((user)=> {
      this.navCtrl.push('ChartPage');
      this.loading.dismiss();
    }, (error) => {
      console.log("error");
    });
  }

}

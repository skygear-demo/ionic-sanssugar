import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Storage } from '@ionic/storage';

import { Item } from '../../models/item';

import { Tracking } from '../../models/tracking';
import { Trackings, Items, User } from '../../providers/providers';

import { Config } from '../../app/config'

import { MainPage } from '../pages';
import moment from 'moment';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';


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
  cokeCount: number;
  myLimit: number;
  todayText: string;
  loading: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    public trackings: Trackings,
    public user: User,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    private barcodeScanner: BarcodeScanner,
    private storage: Storage) { }

  getTodayString() {
    let date = moment().format('D MMM YYYY');
    return date;
  }

  updateSummary() {
    this.todayText = this.getTodayString();
    this.myLimit = this.trackings.getMyLimit();
    this.trackings.getDateSugarTotal(new Date()).then(result => {
      var todayChart = document.getElementById('today-chart');
      todayChart.classList.remove("animate");
      console.log(result);
      this.todaySum = result["sugar"];
      this.todayRemain = Math.round((this.myLimit - this.todaySum) * 100) / 100;
      this.todayRemain = (this.todayRemain > 0)? this.todayRemain : 0;

      this.cokeCount = this.howManyCansOfCoke(this.todayRemain);

      console.log('todaySum', this.todaySum);
      var percent = (this.todaySum / this.myLimit)* 100;
      percent = percent > 100? 100 : percent;

      // animate the chart
      todayChart.classList.add("animate");
      
      // percent
      var percentageCircle = document.getElementById('percentage-circle');
      console.log('percent: ',percent);

      // /*Hard coded percentage formula*/
      var c = (300 - 4) * 3.14;
      var cOffSet = (percent/100*0.8) * c;
      percentageCircle.setAttribute("style","stroke-dasharray:"+cOffSet+"px "+c+"px; stroke-dashoffset:"+cOffSet+"px");

      todayChart.classList.remove("stage-1", "stage-2", "stage-3");
      document.getElementById('chart-img').classList.remove("stage-1", "stage-2", "stage-3");
      document.getElementById('chart-main-content').classList.remove("stage-1", "stage-2", "stage-3");

      /* TODO update style when level changes */
      
      if (percent < 50) {
        console.log("stage 1");
        document.getElementById('chart-main-content').classList.add("stage-1");
        document.getElementById('chart-img').classList.add("stage-1");
        todayChart.classList.add("stage-1");

      } else if (percent >= 50 && percent < 75) {
        document.getElementById('chart-main-content').classList.add("stage-2");
        document.getElementById('chart-img').classList.add("stage-2");
        todayChart.classList.add("stage-2");
        console.log("stage 2");
      } else if (percent >= 75) {
        document.getElementById('chart-main-content').classList.add("stage-3");
        document.getElementById('chart-img').classList.add("stage-3");
        todayChart.classList.add("stage-3");
        console.log("stage 3");
      }
    });
  }

  howManyCansOfCoke(gram) {
    // 35g per can of 330ml
    var noOfCans = Math.round(gram / 35 * 100) /100;
    return noOfCans;
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
    this.navCtrl.swipeBackEnabled=false;
    this.user.getCurrentUser().then((user) => {
      console.log(user);
      if (!user) {
        // No user
        this.navCtrl.setRoot('LandingPage');
        this.navCtrl.popToRoot();
      } else {
        this.user.getUserEmail().then(email=> {
          console.log("email", email);

          this.user.getUserGender().then(gender => {
            this.initChartView();
            this.updateSummary();
          })
        })
      }
    })
  }

  ionViewDidEnter() {
    // Load doughnut Chart
    this.user.getUserEmail().then(email=> {
      console.log("email", email);
      this.updateSummary();
    })
  }

  initChartView() {
    //  Disclaimer
    this.storage.get("hasShownDisclaimer").then(hasShownDisclaimer => {
      if(hasShownDisclaimer !== "true") {
        this.storage.set("hasShownDisclaimer", "true");
        this.showDisclaimer();
      }
    })
  }

  add() {
    this.navCtrl.push('SearchPage');
  }

  addByBarcode() {
    this.barcodeScanner.scan({disableSuccessBeep: true}).then((barcodeData) => {
 // Success! Barcode data is here
      console.log(barcodeData);
      if (!barcodeData.cancelled) {
        let addModal = this.modalCtrl.create('ItemCreatePage', {barcode: barcodeData});
        addModal.onDidDismiss(item => {

          var tracking = new Tracking(item, new Date());
          this.trackings.add(tracking);
          if (item) {
            this.items.add(item);
          }

          this.presentToast(item['name'] + ' is tracked.');
          this.updateSummary();
        })
        addModal.present();
      }
    }, (err) => {
    // An error occurred
      console.error('Error', err);
    });
  }

  showHistory() {
    this.navCtrl.push('ListMasterPage');
  }

  share() {
    // Check if sharing via email is supported
    // this.socialSharing.canShareViaEmail().then(() => {
    //   // Sharing via email is possible
    // }).catch(() => {
    //   // Sharing via email is not possible
    // });

    // Share via email
    // this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
    //   // Success!
    // }).catch(() => {
    //   // Error!
    // });

    this.socialSharing.shareViaFacebook('Hey','img.png','url').then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });

    this.socialSharing.share('I am using Sans Sugar to track my sugar intake.', 'Let\'s eat less sugar.', 'file', 'url').then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      dismissOnPageChange: true,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
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
      this.loading.dismiss();
      this.navCtrl.setRoot('LandingPage');
      this.navCtrl.popToRoot();
    }, (error) => {
      console.log("error");
    });
  }

}

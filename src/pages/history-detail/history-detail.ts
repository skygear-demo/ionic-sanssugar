import { Component } from '@angular/core';
import { IonicPage, ModalController, NavParams, NavController, AlertController, ToastController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items, Trackings, User } from '../../providers/providers';
import { SocialSharing } from '@ionic-native/social-sharing';

import { Tracking } from '../../models/tracking';
import { Summary } from '../../models/summary';
import { Storage } from '@ionic/storage';
import { Screenshot } from '@ionic-native/screenshot';

import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-history-detail',
  templateUrl: 'history-detail.html'
})
export class HistoryDetailPage {
  daySummary: any;
  dayTrackings:any = [];
  date: Date;
  dateString:string = 'Summary';
  showControl:boolean = true;
  isEmpty:boolean = true;
  stage:number = 1;
  totalSugar:number = 0.0;

  constructor(public navCtrl: NavController,
    params: NavParams,
    public items: Items,
    public modalCtrl: ModalController,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    private trackings: Trackings,
    private screenshot: Screenshot,
    private alertCtrl: AlertController) {

    this.daySummary = params.get('summary');
    console.log(this.daySummary)

    if(this.daySummary) {
      this.date = this.daySummary.date;
      this.dateString = moment(this.date).format('D MMM YYYY');
      this.loadRecords(this.date);
      this.stage = this.daySummary.stage;
    } else {
      this.isEmpty = true;
    }
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    // load from database
    this.navCtrl.swipeBackEnabled=true;
  }

  loadRecords(date) {
    console.log("loading records");

    this.trackings.getDateSummary(date).then((records) => {
      
      var count = 0; // count the records
      var sum:number = 0; // sum the totalSugar

      for (const i in records) {
        console.log(i);
        let record = records[i];
        console.log(record.item);
        if (record && record.item && record.item.hasOwnProperty('sugar')) {
          sum += Number(record.item['sugar']);
        }
        count++;
      }

      this.totalSugar = sum;

      // Update Stage
      var limit = this.trackings.getMyLimit();
      var percent = this.totalSugar/limit * 100;
      console.log('percent', percent);
      if (percent < 50) {
        this.stage = 1;
      } else if (percent >= 50 && percent < 75) {
        this.stage = 2;
      } else if (percent >= 75) {
        this.stage = 3;
      }

      let recordLength = count;
      console.log("length:"+recordLength);
      this.dayTrackings = records;
      if(recordLength == 0 ) {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    });
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

  addTracking() {
    this.navCtrl.push('SearchPage');
  }

  delete(tracking) {
    console.log('delete');
    this.presentDeleteConfirm(tracking.item.name, null, ()=>{
      this.trackings.delete(tracking).then((records)=> {
        this.dayTrackings.splice(this.dayTrackings.indexOf(tracking), 1);
        this.loadRecords(tracking.date); // recalculate all things
        this.presentToast(tracking.item.name+' removed.');
      })
    
    });

  }

  presentDeleteConfirm(itemName, cancelAction, confirmAction) {
    let alert = this.alertCtrl.create({
      title: 'Delete tracking',
      message: 'Are you sure to remove tracking '+itemName+'?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            if(cancelAction) cancelAction();
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('delete');
            if(confirmAction) confirmAction();
          }
        }
      ]
    });
    alert.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      dismissOnPageChange: false,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  print(summary) {
    console.log(summary);
  }

  back() {
    this.navCtrl.pop();
  }

  share() {
    this.showControl = false;
    console.log('share');

    let onSuccess = (res) => {
      console.log(res);
      this.socialSharing.share('Let\'s take less sugar with Sans Sugar..', 'I am using Sans Sugar to track my sugar intake. #sanssugar', res.URI, null).then(() => {
        // Success!
      this.showControl = true;
      }).catch(() => {
      this.showControl = true;
        // Error!
    });

    };

    let onError = (error) => {
      console.log(error);
      this.socialSharing.share('Let\'s take less sugar with Sans Sugar.', 'I am using Sans Sugar to track my sugar intake. #sanssugar', null,null).then(() => {
          // Success!
      this.showControl = true;
      }).catch(() => {
        // Error!
        this.showControl = true;
    });

    };
    
    this.screenshot.URI(80).then(onSuccess, onError);
  }

}

import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';

import { Item } from '../../models/item';
import { Tracking } from '../../models/tracking';
import { Items, Trackings } from '../../providers/providers';

import * as Enums from '../../app/enums';

import { HTTP } from '@ionic-native/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  currentItems: any = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public items: Items,
    public trackings: Trackings,
    private toastCtrl: ToastController,
    private http: HTTP,
    private barcodeScanner: BarcodeScanner,
    private alertCtrl: AlertController
    ) {
    this.currentItems = this.items.query();
  }

  ionViewDidLoad() {
    console.log(Enums.FoodType);
  }

  /**
   * Perform a service for the proper items.
   */


  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = this.items.query(); // show all by default
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

  // FIXME: Copied over from chart.ts, shall unify this code.
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
        })
        addModal.present();
      }
    }, (err) => {
    // An error occurred
      console.error('Error', err);
    });
  }

  delete(item) {
    console.log(item);
    if(item.isDefault) {
      alert("This is a default item, so you cannot remove it.");
    } else {
      this.presentDeleteConfirm(item.name, null, ()=> {
        this.items.delete(item).then((item) => {
          this.presentToast(item['name'] + ' is deleted.');
        });
      });
    }
  }

  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      var tracking = new Tracking(item, new Date());
      this.trackings.add(tracking);
      if (item) {
        this.items.add(item);
        this.presentToast(item['name'] + ' is tracked.');
      }

    });
    addModal.present();
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

  presentDeleteConfirm(itemName, cancelAction, confirmAction) {
    let alert = this.alertCtrl.create({
      title: 'Delete item',
      message: 'Are you sure to delete '+itemName+'?',
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

}


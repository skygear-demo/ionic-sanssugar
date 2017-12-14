import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';

import { Item } from '../../models/item';

import { Tracking } from '../../models/tracking';
import { Trackings, Items, User } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;

  constructor(public navCtrl: NavController,
    navParams: NavParams,
    public items: Items,
    public trackings: Trackings,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
    this.item = navParams.get('item') || new Item({});
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

  presentConfirm(itemName, cancelAction, confirmAction) {
    let alert = this.alertCtrl.create({
      title: 'Add as a new item?',
      message: 'Do you want to add '+itemName+' as a new item?',
      buttons: [
        {
          text: 'Discard',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            if(cancelAction) cancelAction();
          }
        },
        {
          text: 'Add',
          handler: () => {
            console.log('Add');
            if(confirmAction) confirmAction();
          }
        }
      ]
    });
    alert.present();
  }

  addCurrentItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage', {existingItem: this.item});
    addModal.onDidDismiss(item => {
      var tracking = new Tracking(item, new Date());
      this.trackings.add(tracking);
      this.navCtrl.pop();

      //  Ask: Add as a new item?
      this.presentConfirm(item.name, null, ()=> {
        this.items.add(item);
        this.presentToast('Item '+item.name+' saved');
      })

      this.presentToast(item['name'] + ' is tracked.');
    });
    addModal.present();
  }

}

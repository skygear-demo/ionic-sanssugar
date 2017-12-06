import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Tracking } from '../../models/tracking';
import { Items, Trackings } from '../../providers/providers';

import * as Enums from '../../app/enums';

import { HTTP } from '@ionic-native/http';

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
    private http: HTTP
    ) {
    this.currentItems = this.items.query();
  }


  ionViewDidLoad() {
    this.searchFromAPI();

    console.log(Enums.FoodType);

  }

  /** Search from API **/

  searchFromAPI() {
    this.http.get('https://world.openfoodfacts.org/api/v0/product/737628064502.json', {}, {})
    .then(data => {

      console.log(data.status);
      console.log(data.data); // data received by server
      console.log(data.headers);

    }).catch(error => {
      console.log(error)
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
      });
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

  addTracking() {
    var tracking = new Tracking();
    tracking.setDate(new Date());
    tracking.setItem(new Item({
      name: "Cola",
      volume: "330ml",
      sugar: 1.2
    }));
    this.trackings.add(tracking);
  }

  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    })
    addModal.present();
  }

}

import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items, Trackings, User } from '../../providers/providers';

import { Tracking } from '../../models/tracking';
import { Summary } from '../../models/summary';
import { Storage } from '@ionic/storage';

import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  daySummaries: any[] = []; // TODO define a better type

  groupedSummaries = [];

  constructor(public navCtrl: NavController,
    public items: Items,
    params: NavParams,
    public modalCtrl: ModalController,
    private trackings: Trackings) {
    // this.currentItems = this.items.query();
    this.daySummaries = [];
    this.loadSummary();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidEnter() {
    // load from database
    this.loadSummary();
    this.navCtrl.swipeBackEnabled=true;
  }

  /**
  * Groups the summaries into months
  */
  groupSummaries(sortedSummaries){
      let currentMonth = null;
      let currentSummaries = [];

      this.groupedSummaries = [];
      sortedSummaries.forEach((value, index) => {
          if(moment(value.date).format('MMMM') != currentMonth) {
              currentMonth = moment(value.date).format('MMMM');
              let newGroup = {
                  month: currentMonth,
                  summaries: []
              };
              currentSummaries = newGroup.summaries;
              this.groupedSummaries.push(newGroup);
          }

          currentSummaries.push(value);
      });
  }

  loadSummary() {
    var getSummaryQueries = [];
    this.trackings.getFirstDate().then(result => {

      var firstDay = this.trackings.firstDay;
      console.log('firstDay', firstDay);

      var today = moment().startOf('day');
      var daysDiff = today.diff(firstDay, 'days');

      console.log('daysDiff', daysDiff);

      for (var i = 0; i <= daysDiff; i++) {
        var dayToQuery = moment().subtract(i,'day').toDate();
        console.log(dayToQuery);
        getSummaryQueries.push(this.trackings.getDateSugarTotal(dayToQuery));
      }

      Promise.all(getSummaryQueries).then(values => {
        this.daySummaries = []; // clear the original list
        var limit = this.trackings.getMyLimit();
        for (var i in values) {
          // console.log(values[i]);
          values[i].dateString = moment(values[i].date).format('D MMM YYYY');

          // set stage. TODO: Please move to a better place.
          values[i].stage = 1;
          var percent = values[i].sugar/limit * 100;
          console.log('percent', percent);
          if (percent < 50) {
            values[i].stage = 1;
          } else if (percent >= 50 && percent < 75) {
            values[i].stage = 2;
          } else if (percent >= 75) {
            values[i].stage = 3;
          }
          this.daySummaries.push(values[i]);
        }

        this.daySummaries.sort(function(a,b) {
          return a.date > b.date? -1 : 1;
        })

        this.groupSummaries(this.daySummaries);
        // every other thing can happen here e.g call a method
        console.log("OK!", this.groupedSummaries);
      });
    })
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

  print(summary) {
    console.log(summary);
  }

  showDetail(summary) {
    console.log(summary);
    this.navCtrl.push('HistoryDetailPage', {summary: summary});
  }

}

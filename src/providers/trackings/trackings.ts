import { Injectable } from '@angular/core';
import { Tracking } from '../../models/tracking';
import { Storage } from '@ionic/storage';

import moment from 'moment';

import { User } from '../user/user';

@Injectable()
export class Trackings {

  TrackingPrefix:string = 'TRACKING';

  constructor(private user: User,
    private storage: Storage) { }

  query(date: Date) {
    // return this.api.get('/trackings', params);
  }

  getStorageKey(dateString: string) {
    return this.TrackingPrefix+'-'+this.user.email+'-'+dateString;

  }

  add(tracking: Tracking) {
    var date = tracking.date;
    console.log(tracking);
    var dateString = moment().format('YYYYMMDD');
    console.log(dateString);
    let storageKey = this.getStorageKey(dateString);
    this.storage.get(storageKey).then((records) => {
      records = records? records : [];
      console.log('records', records);
      records.push(tracking);

      this.storage.set(storageKey, records);
    });
  }

  delete(tracking: Tracking) {
    var date = tracking.date;
    console.log(tracking);
    var dateString = moment().format('YYYYMMDD');
  }

  getDateSugarTotal(date:Date) {

    return new Promise(resolve => {
      this.getDateSummary(date).then(records => {
        
        // Loop through items
        var sum:number = 0;

        for (const i in records) {
          console.log(i);
          let record = records[i];
          console.log(record);
          if (record.item.hasOwnProperty('sugar')) {
            sum += record.item['sugar'];
          }
        }

        console.log('sum',sum);
        // Round it because JS Math is "Awesome"
        resolve(Math.round(sum * 100) / 100);
      });
    });
  }

  getDateSummary(date:Date) {
    var dateString = moment(date).format('YYYYMMDD');
    let storageKey = this.getStorageKey(dateString);
    console.log(storageKey);
    var result = new Promise ( resolve => {
      this.storage.get(storageKey).then(records => {
        records = records? records : [];
        console.log(records);


        resolve(records);
      });
    });

    return result;
  }

  getMyLimit() {
    if (this.user.gender === 'm') {
      return 25; // MALE LIMIT
    } else {
      return 19; // FEMALE LIMIT
    }
  }

  clear() {
    storage.clear();
  }

}

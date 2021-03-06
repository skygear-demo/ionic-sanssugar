import { Injectable } from '@angular/core';
import { Tracking } from '../../models/tracking';
import { Storage } from '@ionic/storage';

import moment from 'moment';

import { User } from '../user/user';

import {
  SkygearService,
  SkygearItem,
  SkygearTracking
} from '../../app/skygear.service';

@Injectable()
export class Trackings {

  TrackingPrefix:string = 'TRACKING';
  FirstTrackingPrefix:string = 'FIRST_TRACKING';

  firstDay:Date;

  constructor(private user: User,
    private storage: Storage,
    private skygearService: SkygearService
    ) {
    this.user.getUserEmail().then(email => {
      this.setFirstDayIfNotSet();
    });
  }

  query(limit?:Number, page?:Number) {
    if (limit) {

    } else {

    }
    return this.getDateSugarTotal(moment().toDate());
    // return this.api.get('/trackings', params);
  }

  getStorageKey(dateString: string) {
    return this.TrackingPrefix+'-'+this.user.email+'-'+dateString;
  }

  getFirstDayStorageKey() {
    return this.FirstTrackingPrefix+'-'+this.user.email;
  }

  setFirstDayIfNotSet() {
    this.getFirstDate().then(result => {
      console.log("result of firstDay", result)

      // If the current date is not set or < firstdate, save it instead
      var firstDayIsAfterToday = moment(result, 'YYYYMMDD').isAfter(moment().toDate());
      if(!result || firstDayIsAfterToday) {
        let todayString = moment().format('YYYYMMDD');
        this.storage.set(this.getFirstDayStorageKey(), todayString);
        console.log('first day is set as today: ',todayString);
      }
    })
  }

  getFirstDate() {
    return new Promise(resolve => {
      this.storage.get(this.getFirstDayStorageKey()).then(val => {
        this.firstDay = val? moment(val,'YYYYMMDD').toDate(): moment().startOf('day').toDate();

        console.log("result val", val)
        console.log('first day', this.firstDay);
        resolve(val);
      })
    });
  }

  add(tracking: Tracking) {
    var date = tracking.date;
    console.log(tracking);
    var dateString = moment(date).format('YYYYMMDD');
    console.log(dateString);
    let storageKey = this.getStorageKey(dateString);
    this.storage.get(storageKey).then((records) => {
      records = records? records : [];
      console.log('records before:', records);
      records.push(tracking);

      console.log('records after:', records);

      this.storage.set(storageKey, records);
    });

    // Save to skygear
    this.addTrackingToSkygear(tracking).then((result)=>{
      // update toskygear id to local db
    }).catch((error) => {
      
    });
  }

  addTrackingToSkygear(tracking) {
    return new Promise(resolve => {
      this.skygearService.getSkygear().then(skygear => {
        let newTracking = new SkygearTracking(tracking);
        skygear.privateDB.save(newTracking).then((record) => {
          console.log("Saved to skygear");
          tracking["skygearId"]= record.id;
          resolve(tracking);
        }, (error) => {
          console.log("cannot save to skygear: ", error);
          resolve(error);
        })
      });
    });
  }

  delete(tracking: Tracking) {
    var date = tracking.date;
    console.log(tracking);
    var dateString = moment().format('YYYYMMDD');
    let storageKey = this.getStorageKey(dateString);

    return new Promise(resolve => {
      this.storage.get(storageKey).then((records) => {
        records = records? records : [];
        records.splice(records.indexOf(tracking), 1);
        this.storage.set(storageKey, records);
        resolve(records);
      });
    });

    // TODO: delete at Skygear
  }

  getDateSugarTotal(date:Date) {
    return new Promise(resolve => {
      this.getDateSummary(date).then(records => {

        // Loop through items
        var sum:number = 0;

        for (const i in records) {
          console.log(i);
          let record = records[i];
          console.log(record.item);
          if (record && record.item && record.item.hasOwnProperty('sugar')) {
            sum += Number(record.item['sugar']);
          }
        }

        // Round this because JS Math is "Awesome"
        resolve({
          date: date,
          sugar: Math.round(sum * 100) / 100});
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
    this.storage.clear();
  }

}

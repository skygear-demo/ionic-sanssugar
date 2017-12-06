import { Injectable } from '@angular/core';
import { Tracking } from '../../models/tracking';
import moment from 'moment';

import { User } from '../user/user';

@Injectable()
export class Trackings {

  constructor(private user: User) { }

  query(params?: any) {
    // return this.api.get('/trackings', params);
  }

  add(tracking: Tracking) {
    // Must be today
  }

  delete(tracking: Tracking) {
    // Must be today
  }

  getTodaySummary() {
    return 10;
  }

  getMyLimit() {
    if (this.user.gender === 'm') {
      return 25;
    } else {
      return 19;
    }
  }

  getByDate() {
    
  }

}

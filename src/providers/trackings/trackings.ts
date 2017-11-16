import { Injectable } from '@angular/core';
import { Tracking } from '../../models/tracking';

@Injectable()
export class Trackings {

  constructor() { }

  query(params?: any) {
    // return this.api.get('/trackings', params);
  }

  add(tracking: Trackings) {
  }

  delete(tracking: Trackings) {
  }

  getTodaySummary() {
    return 10;
  }

  getMyLimit() {
    return 26;
  }

}

import { Injectable } from '@angular/core';
import { Tracking } from '../../models/tracking';

@Injectable()
export class Trackings {

  constructor() { }

  query(params?: any) {
    // return this.api.get('/trackings', params);
  }

  add(tracking: Tracking) {
  }

  delete(tracking: Tracking) {
  }

  getTodaySummary() {
    return 10;
  }

  getMyLimit() {
    return 26;
  }

  getByDate() {
    
  }

}

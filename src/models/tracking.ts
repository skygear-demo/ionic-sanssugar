import { Item } from './item';

export class Tracking {

    constructor(
     public item: Item,
     public date:Date){
    }

    setItem(item) {
        this.item = item;
    }

    setDate(date) {
        this.date = date;
    }
}
import { Tracking } from './tracking';

export class Summary {

    sugar: Number;

    constructor(
     public trackings: Tracking[],
     public date: Date){
    }
}
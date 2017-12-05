import { Item } from './item';

export class Tracking {
 
    constructor(public title: string, public items: Item[], public date:Date){
 
    }

    addItem(item){
        this.items.push({
            title: item,
            checked: false
        });
    }
 
    removeItem(item){
        for(var i = 0; i < this.items.length; i++) {
            if(this.items[i] == item){
                this.items.splice(i, 1);
            }
        }
    }
}
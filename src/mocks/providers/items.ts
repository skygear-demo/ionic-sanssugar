import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';

import { Item } from '../../models/item';

import {
  SkygearService,
  SkygearItem
} from '../../app/skygear.service';

@Injectable()
export class Items {
  items: Item[] = [];
  food: Item[] = [];

  defaultItem: any = {};

  constructor(private skygearService: SkygearService) {
    // These are default Items
    let defaultItems = [
      {
        "name": "Coke 330ml",
        "profilePic": "https://static.openfoodfacts.org/images/products/544/900/000/0996/front_en.193.400.jpg",
        "about": "",
        "sugar": "35",
        "barcode":"5449000000996",
        "type":"drinks",
        "volume": "330",
        "isDefault": true

      },
      {
        "name": "Fanta 330ml",
        "profilePic": "https://static.openfoodfacts.org/images/products/544/900/001/1527/front_en.49.400.jpg",
        "about": "",
        "sugar": "21.4",
        "barcode": "5449000011527",
        "type":"drinks",
        "volume": "330",
        "isDefault": true
      },
      {
        "name": "Sprite 330ml",
        "profilePic": "https://static.openfoodfacts.org/images/products/500/011/254/5357/front_da.18.400.jpg",
        "about": "",
        "sugar": "33.3",
        "barcode":"5000112545357",
        "type":"drinks",
        "volume": "330",
        "isDefault": true
      },
      {
        "name": "Mountain Dew 330ml",
        "profilePic": "https://static.openfoodfacts.org/images/products/406/080/017/5472/front_fr.5.400.jpg",
        "about": "",
        "sugar": "40.9",
        "barcode":"4060800175472",
        "type":"drinks",
        "volume": "330",
        "isDefault": true
      },
      {
        "name": "Oreo 🍪 (1 pc)",
        "profilePic": "https://static.openfoodfacts.org/images/products/841/000/081/0004/front_fr.41.400.jpg",
        "about": "",
        "sugar": "2.2",
        "barcode": "8410000810004",
        "type":"snacks",
        "isDefault": true
      }
    ];

    for (let item of defaultItems) {
      this.items.push(new Item(item));
    }

    this.getDataFromSkygear();
  }

  getDataFromSkygear() {
    this.skygearService.getSkygear().then(skygear => {
      const query = new skygear.Query(SkygearItem);
      query.limit = 999; // Quick hack for no pagination
      skygear.privateDB.query(query).then((records) => {
        
        console.log(records);
        for (let item of records) {
          this.items.push(new Item(item));
        }
      }, (error) => {
        console.log("Error: ",error);
      })

    });
  }


  addItemToSkygear(item) {
    this.skygearService.getSkygear().then(skygear => {
      let newItem = new SkygearItem(item);
      skygear.privateDB.save(newItem).then((record) => {
        console.log("Saved to skygear");
      }, (error) => {
        console.log("cannot save to skygear: ", error);
      })

    });
  }

  query(params?: any) {
    if (!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  add(item: Item) {
    this.items.push(item);

    var itemJSON = JSON.stringify(item);
    // TODO: Save item in storage
    this.addItemToSkygear(JSON.parse(itemJSON));

  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}

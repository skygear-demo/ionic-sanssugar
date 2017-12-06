import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';

import { Item } from '../../models/item';

@Injectable()
export class Items {
  items: Item[] = [];
  food: Item[] = [];

  defaultItem: any = {
    "name": "Burt Bear",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt is a Bear.",
  };


  constructor(private sqlite: SQLite) {
    let items = [
      {
        "name": "Coke",
        "profilePic": "http://icons.iconarchive.com/icons/michael/coke-pepsi/512/Coca-Cola-Can-icon.png",
        "about": ""
      },
      {
        "name": "Fanta",
        "profilePic": "",
        "about": ""
      },
      {
        "name": "Sprite",
        "profilePic": "",
        "about": ""
      },
      {
        "name": "Dew",
        "profilePic": "",
        "about": ""
      },
      {
        "name": "Syrup",
        "profilePic": "",
        "about": ""
      },
      {
        "name": "Tea",
        "profilePic": "",
        "about": ""
      },
      {
        "name": "Chocolate Bar",
        "profilePic": "",
        "about": ""
      }
    ];

    for (let item of items) {
      this.items.push(new Item(item));
    }
  }

      // // SQL1
      // db.executeSql('SELECT * FROM expense ORDER BY rowid DESC', {})
      // .then(res => {
      //   this.expenses = [];
      //   for(var i=0; i<res.rows.length; i++) {
      //     this.expenses.push({rowid:res.rows.item(i).rowid,date:res.rows.item(i).date,type:res.rows.item(i).type,description:res.rows.item(i).description,amount:res.rows.item(i).amount})
      //   }
      // })
      // .catch(e => console.log(e));

      // // SQL2
      // db.executeSql('SELECT SUM(amount) AS totalIncome FROM expense WHERE type="Income"', {})
      // .then(res => {
      //   if(res.rows.length>0) {
      //     this.totalIncome = parseInt(res.rows.item(0).totalIncome);
      //     this.balance = this.totalIncome-this.totalExpense;
      //   }
      // })
      // .catch(e => console.log(e));

      // // SQL3
      // db.executeSql('SELECT SUM(amount) AS totalExpense FROM expense WHERE type="Expense"', {})
      // .then(res => {
      //   if(res.rows.length>0) {
      //     this.totalExpense = parseInt(res.rows.item(0).totalExpense);
      //     this.balance = this.totalIncome-this.totalExpense;
      //   }
      // })


  // initDB() {
  //   this.sqlite.create({
  //     name: 'data.db',
  //     location: 'default'
  //   })
  //     .then((db: SQLiteObject) => {


  //       db.executeSql('create table trackings(name VARCHAR(32))', {})
  //         .then(() => console.log('Executed SQL'))
  //         .catch(e => console.log(e));

  //     })
  //     .catch(e => console.log(e));

  // }

  getData() {
    this.sqlite.create({
      name: 'sans_sugar_food.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM food ORDER BY name DESC', {})
      .then(res => {
        this.food = [];
        for(var i=0; i<res.rows.length; i++) {
          this.food.push({name:'noname'})
        }
      })
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
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
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}

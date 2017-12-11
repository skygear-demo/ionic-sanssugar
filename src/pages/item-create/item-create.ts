import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, NavParams} from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

import * as Enums from '../../app/enums';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  barcodeData: any;

  item: any;

  form: FormGroup;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public camera: Camera,
    params: NavParams,
    private http: HTTP) {

    this.barcodeData = params.get('barcode')

    console.log('Barcode', params.get('barcode'));

    if(this.barcodeData) {
      // prefill the form for that bar code
      this.searchFromAPI(this.barcodeData['text']);

    }


    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      type: ['', Validators.required],
      sugarAmount: [0, Validators.required],
      about: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  /** Search from API **/

  searchFromAPI(id) {
    this.http.get('https://world.openfoodfacts.org/api/v0/product/'+id+'.json', {}, {})
    .then(data => {

      // console.log(data.status);
      console.log("data", data.data); // data received by server
      // console.log(data.headers);

      var dataJSON = JSON.parse(data.data);

      console.log("data status", dataJSON["status"]); // data received by server
      console.log("data status2",dataJSON.status);
      if(dataJSON["status"] === 1) {
        //found

        this.form.patchValue({'name': dataJSON["product"]["product_name_en"]});
        this.form.patchValue({'sugarAmount': dataJSON["product"]["nutriments"]["sugars_serving"]});

        this.form.patchValue({'profilePic': dataJSON["product"]["image_front_small_url"]});
        //image_front_small_url
        console.log("Found");
        alert("Found: "+ dataJSON["product"]["product_name_en"])
      } else {
        // Not Found
        alert("Sorry, this product is not found on the database. But you can input the info manually to track this item.")
      }

    }).catch(error => {
      console.log(error)
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
      });
  }


  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }
}

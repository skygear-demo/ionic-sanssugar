import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, NavParams, LoadingController, ToastController} from 'ionic-angular';

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
  loading: any;

  item: any;
  form: FormGroup;
  openfoodfactsAPI:string = 'https://world.openfoodfacts.org/api/v0/product/';

  toast: any;

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public camera: Camera,
    params: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HTTP) {

    this.barcodeData = params.get('barcode')

    console.log('Barcode', params.get('barcode'));

    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      type: ['', Validators.required],
      volume: [''],
      sugar: [null, Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

    if(this.barcodeData) {
      // prefill the form for that bar code
      this.searchFromAPI(this.barcodeData['text']);
    }
  }

  presentToast(msg) {

    this.toast = this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      closeButtonText: 'OK',
      dismissOnPageChange: true,
      position: 'bottom'
    });

    this.toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    this.toast.present();
  }

  presentLoadingDefault(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });

    this.loading.present();
  }


  /** Search from API **/

  searchFromAPI(id) {
    this.presentLoadingDefault('Searching from database...');
    this.http.get(this.openfoodfactsAPI + id + '.json', {}, {})
    .then(data => {
      this.loading.dismiss();
      // console.log(data.status);
      console.log("data", data.data); // data received by server
      // console.log(data.headers);

      var dataJSON = JSON.parse(data.data);

      console.log("data status", dataJSON["status"]); // data received by server
      console.log("data status2",dataJSON.status);
      if(dataJSON["status"] === 1) {
        //found

        this.form.patchValue({'name': dataJSON["product"]["product_name"]});

        console.log("Found");
        // Found, but there is no "nutriments" records
        if (dataJSON["product"]["nutriments"]["sugars"]) {

          this.form.patchValue({'sugar': Number(dataJSON["product"]["nutriments"]["sugars"])});
          this.presentToast(""+ dataJSON["product"]["product_name"]+ " - " +
            "\nSugar per 100g: "+ dataJSON["product"]["nutriments"]["sugars_100g"] + "g"+
            "\nTotal Sugar: "+dataJSON["product"]["nutriments"]["sugars"] + "g");

        } else {
          this.presentToast("Product ("+dataJSON["product"]["product_name"]+'\n) found, however there is no sugar information available. Please input sugar amount mannually.');
        }
        
        this.form.patchValue({'profilePic': dataJSON["product"]["image_front_small_url"]});

        //categories / categories_tags
        // drinks / beverages

        this.form.patchValue({'type': 'snacks'});

      } else {
        // Not Found

        this.presentToast("Sorry, this product is not found on the database. But you can input the info manually to track this item.");
      }

    }).catch(error => {
      console.log(error)
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);

      this.loading.dismiss();
      alert(error.error);

      this.presentToast("However, you can input the info manually to track.");
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
    if (this.toast) {
      this.toast.dismiss();
    }
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (this.toast) {
      this.toast.dismiss();
    }
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }
}

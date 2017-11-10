import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ChartPage } from './chart';

@NgModule({
  declarations: [
    ChartPage,
  ],
  imports: [
    IonicPageModule.forChild(ChartPage),
    TranslateModule.forChild()
  ],
  exports: [
    ChartPage
  ]
})
export class ChartPageModule { }

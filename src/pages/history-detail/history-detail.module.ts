import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { HistoryDetailPage } from './history-detail';

@NgModule({
  declarations: [
    HistoryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    HistoryDetailPage
  ]
})
export class HistoryDetailPageModule { }

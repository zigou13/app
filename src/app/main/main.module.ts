import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MainPage } from './main.page';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { ModalTablonPage } from '../modal-tablon/modal-tablon.page';


import { TranslateModule } from '@ngx-translate/core';
import { RainComponent } from '../componets/rain/rain.component';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,

  ],
   declarations: [MainPage  , ModalTablonPage, RainComponent ],
  entryComponents: [ ModalTablonPage ]
})
export class MainPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MainPage } from './main.page';
import { ModalPage } from '../modal/modal.page';

import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

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
    RouterModule.forChild(routes)
  ],
  declarations: [MainPage, ModalPage],
  entryComponents: [ModalPage],
  providers: [
    NativeGeocoder
  ]
})
export class MainPageModule { }

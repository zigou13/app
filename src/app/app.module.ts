import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// firebase

import Config from './firebase';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ModalPagePage } from './modal-page/modal-page.page';

import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule , TranslateLoader } from '@ngx-translate/core' ;
import { TranslateHttpLoader } from '@ngx-translate/http-loader' ;

// nativo
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


import { HTTP } from '@ionic-native/http/ngx';
import { FiltrePipe } from './pipes/filtre.pipe';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader( http, 'assets/' , '.json');
}


@NgModule({
  declarations: [AppComponent, FiltrePipe],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(Config),
    AngularFireAuthModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    Camera,
    InAppBrowser,
    SplashScreen,
    BackgroundGeolocation,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

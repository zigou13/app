import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LanguageService } from './lenguage.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

// Plugins

import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  uid: any;
  intro: boolean;
  country: string;
  language: string;


  lat: number;
  lng: number;

  constructor(
    private statusBar: StatusBar,
    private platform: Platform,
    private splashScreen: SplashScreen,
    public aut: AngularFireAuth,
    private rout: Router,
    private languageService: LanguageService,
    private http: HttpClient,
    private storage: Storage,
    private geolocation: Geolocation,

  ) {
    this.initializeApp();
    // let status bar overlay webview
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.hide();
      this.splashScreen.hide();
      this.languageService.setInitialAppLanguage();
      this.languageload();
      this.logueado();

    });


  }

  logueado() {
    this.platform.ready().then(() => {
      this.aut.user.subscribe(user => {
        if (user) {
          this.rout.navigate(['/home']);
          this.uid = user.uid;
        } else {
          this.rout.navigate(['/login']);
        }
      }, err => {
        this.rout.navigate(['/login']);
      }, () => {
        this.splashScreen.hide();
      });
      this.statusBar.styleDefault();
    });
  }

  languageload() {
    this.http.get(`http://api.ipstack.com/213.99.99.182?access_key=c36e4dd64bd5e197d466538bec25caa0`).subscribe((data: any) => {
       console.log(data.country_name);
       this.country = data.country_name;
       if ( this.country === 'Spain' ) {

        this.storage.get('SELECTED_LANGUAGE').then(val => {
          if (val) {
            this.languageService.setLanguage(val);
          } else {
            console.log('España');
            this.language = 'es';
            this.languageService.setLanguage('es');
          }
        });
      } else {
       this.languageService.setLanguage('en');
      }
   });
}




}

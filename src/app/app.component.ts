import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  navigate: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public aut: AngularFireAuth,
    private rout: Router,
    private menu: MenuController
  ) {
    this.initializeApp();
    this.logueado();
  }

  async logueado() {
    await this.aut.authState
      .subscribe(
        user => {
          if (user) {
            console.log('loged');
            localStorage.setItem('uid' , user.uid);
          } else {
            this.rout.navigateByUrl('/register');
          }
        },
        () => {
          this.rout.navigateByUrl('/register');
        }
      );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.logueado();
    });
  }

  open(id) {
    this.rout.navigateByUrl(id);
    this.menu.close();
  }
  async signOut() {
    const res = await this.aut.auth.signOut();
    console.log(res);
    this.menu.close();
    this.rout.navigateByUrl('/login');
  }

}

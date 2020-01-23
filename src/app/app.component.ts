import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


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
		private menu: MenuController,
		private localNotifications: LocalNotifications
		) {
		this.initializeApp();
		
	}


	delayed_notification() {
		// Schedule delayed notification
		this.localNotifications.schedule({
			text: 'Hay movientos en tu zona, echa un vistazo a la app!',
			trigger: { at: new Date(new Date().getTime() + 3600) },
			led: 'FF0000',
			sound: null
		});
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
			this.statusBar.hide();
			this.splashScreen.hide();
			// this.logueado();
			this.delayed_notification();
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

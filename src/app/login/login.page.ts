import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { ServicesService } from '../services.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username: string;
  password: string;
  passwordType = 'password';
  passwordIcon = 'eye-off';
  t2: string;
  t3: string;
  t4: string;
  t5: string;
  t6: string;


  constructor(public afs: AngularFireAuth,
    public rout: Router,
    public service: ServicesService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private translate: TranslateService) {

      this.translate.get('ERROR.T2').subscribe((text: string) => {
        this.t2 = text ; } );
      this.translate.get('ERROR.T3').subscribe((text: string) => {
        this.t3 = text ; } );
      this.translate.get('ERROR.T4').subscribe((text: string) => {
        this.t4 = text ; } );
      this.translate.get('ERROR.T5').subscribe((text: string) => {
        this.t5 = text ; } );
      this.translate.get('ERROR.T6').subscribe((text: string) => {
        this.t6 = text ; } );


  }

  async login() {

    const { username, password } = this;
    try {
      const res = await this.afs.auth.signInWithEmailAndPassword(username, password).then(data => {
        this.rout.navigate(['/home']);
      });
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        this.error(this.t2);
      }  if (error.code === 'auth/user-not-found') {
        this.error(this.t3);
      }
      if ( error.code === 'auth/argument-error') {
        this.error(this.t4);
       }
       if ( error.code === 'auth/invalid-email') {
        this.error(this.t5);
       }
    }
  }

  async loginGmail() {
    const loading = await this.loadingController.create({
      message: 'No se encuentra disponible'
    });
    this.presentLoading(loading);

    setTimeout(() => {
      loading.dismiss();
    }, 3000);


  }

  goRegister() {
    this.rout.navigate(['/register']);
  }

  async presentAlert(username) {
    const alert = await this.alertController.create({
      header: 'Logueado como: ',
      message: `${username}`,
      buttons: ['OK']
    });

    await alert.present();
  }

  async error(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorUsuario() {
    const alert = await this.alertController.create({
      message: this.t6,
    });

    await alert.present();
  }


  async presentLoading(loading) {
    return await loading.present();
  }

  // contraseña

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
moveFocus(nextElement) {
  nextElement.setFocus();
}


}

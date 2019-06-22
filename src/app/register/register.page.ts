import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  email: string;
  password: string;
  cpassword: string;

  passwordType = 'password';
  passwordIcon = 'eye-off';

  t2: string;
  t3: string;
  t4: string;
  t5: string;
  t6: string;
  t7: string;

  constructor(public afr: AngularFireAuth,
    public rout: Router,
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
      this.translate.get('ERROR.T7').subscribe((text: string) => {
        this.t7 = text ; } );
    }

  async register() {

    const { email, password, cpassword } = this;

    if (password !== cpassword) {
      this.errorpassIguales();
      this.rout.navigate(['/register']);
    } else {
      try {
        await this.afr.auth.createUserWithEmailAndPassword(email, password).then(data => {
          console.log(data);
          setTimeout( () => {
            this.rout.navigate(['/slides']);
          }, 1000);
        });

      } catch (error) {
        console.log(error);
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
  }

  async registerGmail() {

    const loading = await this.loadingController.create({
      message: 'No se encuentra disponible'
    });
    this.presentLoading(loading);

    setTimeout(() => {
      loading.dismiss();
    }, 3000);


  }
  goLogin() {
    this.rout.navigate(['/login']);
  }

  async errorpassIguales() {
    const alert = await this.alertController.create({
      message: this.t7,
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorServ() {
    const alert = await this.alertController.create({
      message: 'Lo siento no se pudo crear su usuario, vuelva a intentar',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async error(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
moveFocus(nextElement) {
  nextElement.setFocus();
}
}

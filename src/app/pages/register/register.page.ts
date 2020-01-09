import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  email: string ;
  password: string ;
  cpassword: string ;

  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(public afr: AngularFireAuth, public rout: Router , public alertController: AlertController) { }



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
            this.rout.navigate(['edit-profile']);
          }, 1000);
        });

      } catch (error) {
        console.log(error);
        if (error.code === 'auth/wrong-password') {
          this.error('Contraseña incorrecta');
        }  if (error.code === 'auth/user-not-found') {
          this.error('Usuario no encontrado');
        }
        if (error.code === 'auth/email-already-in-use') {
          this.error('Email ya usado');
        }
        if ( error.code === 'auth/argument-error') {
          this.error('Error de argumento');
         }
         if ( error.code === 'auth/invalid-email') {
          this.error('Email invalido');
         }
      }
    }
  }
  goLogin() {
    this.rout.navigate(['/login']);
  }

  async errorpassIguales() {
    const alert = await this.alertController.create({
      message: 'Las contraseñas no coenciden',
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorServ() {
    const alert = await this.alertController.create({
      message: 'Algo ha ido mal intentalo más tarde',
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

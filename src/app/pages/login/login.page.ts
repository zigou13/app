import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { auth } from 'firebase/app';
import { ServicesService } from 'src/app/services/services.service';

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

  constructor(public afs: AngularFireAuth,
    public rout: Router,
    public service: ServicesService,
    public alertController: AlertController,
    public loadingController: LoadingController) {

  }

  async login() {

    const { username, password } = this;
    console.log(username, password);
    try {
      const res = await this.afs.auth.signInWithEmailAndPassword(username, password);
      console.log(res);
      this.rout.navigateByUrl('/');
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/wrong-password') {
        this.error('Contraseña incorrecta');
      } if (error.code === 'auth/user-not-found') {
        this.error('Usuario no encontrado');
      }
      if (error.code === 'auth/email-already-in-use') {
        this.error('Email ya usado');
      }
      if (error.code === 'auth/argument-error') {
        this.error('Error de argumento');
      }
      if (error.code === 'auth/invalid-email') {
        this.error('Email invalido');
      } else {
        this.error('Algo ha ido mal intententalo despues');
      }
    }
  }
  async loginGmail() {
    try {
      const res = await this.afs.auth.signInWithPopup(new auth.GoogleAuthProvider());
      console.log(res);
      this.rout.navigateByUrl('/');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        this.error('Contraseña incorrecta');
      } if (error.code === 'auth/user-not-found') {
        this.error('Usuario no encontrado');
      }
      if (error.code === 'auth/email-already-in-use') {
        this.error('Usuario ya usado');
      }
      if (error.code === 'auth/argument-error') {
        this.error('Error de argumento');
      }
      if (error.code === 'auth/invalid-email') {
        this.error('Email invalido');
      }
      console.log(error);
    }
  }

  goRegister() {
    this.rout.navigate(['/register']);
  }

  async presentAlert(username) {
    const alert = await this.alertController.create({
      header: 'Registrado: ',
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

  async erroruser() {
    const alert = await this.alertController.create({
      message: 'Usuario no encontrado',
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

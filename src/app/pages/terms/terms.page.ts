import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { AlertController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  text:string;
  constructor(public service: ServicesService, public alertController: AlertController) { }

  ngOnInit() {
  }
  send(text) {
    this.service.review(text);
    this.mensj();
  }
  async mensj() {
    const alert = await this.alertController.create({
      message: 'Mensaje enviado gracias por tu feedback!',
      buttons: ['OK']
    });
    await alert.present();
  }

}

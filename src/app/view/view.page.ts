import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from '../services/services.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatService } from '../services/chat.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  useruid: string;
  chips = [];
  userdata = [];
  uid: string;
  chat: any;

  ngOnInit() {
    this.useruid = this.active.snapshot.paramMap.get('uid');
    this.loged();
    this.getProfile(this.useruid);

  }


  constructor(public active: ActivatedRoute , public services: ServicesService , public aut: AngularFireAuth ,
    public chatservice: ChatService , private alertController: AlertController , private router: Router) {
    }

  async getProfile(id) {
    await this.services.getProfile(id).subscribe((data => {
      console.log(data);
      this.userdata = data;
    }));
    }

    loged() {
      this.aut.authState
        .subscribe(
          user => {
            if (user) {
             // console.log('loged');
              this.uid = user.uid;
              // console.log(this.id);
            } else {
             // this.router.navigateByUrl('/login');
            }
          },
          () => {
             // this.router.navigateByUrl('/login');
          }
        );
    }

    async presentAlertConfirm() {
      const alert = await this.alertController.create({
        header: 'Report User',
        // tslint:disable-next-line:max-line-length
        message: 'Report this user if is violating the politics and terms of Uicar.io,choose the reson of the violation and we will get into in the quick as posible',
        inputs: [
          {
            name: 'Fake user',

            type: 'checkbox',
            label: 'Fake user',
            value: 'value1',
            checked: true
          },

          {
            name: 'Inappropriate User or Nudity',
            type: 'checkbox',
            label: 'Inappropriate User or Nudity',
            value: 'value2'
          },

          {
            name: 'Scammer',
            type: 'checkbox',
            label: 'Scammer',
            value: 'value3'
          },

          {
            name: 'Phishing',
            type: 'checkbox',
            label: 'Phishing',
            value: 'value4'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Send',
            handler: () => {
              console.log('Confirm Ok');
            }
          }
        ]
      });

      await alert.present();
    }




}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('scrollElement') content: IonContent;


  uid: string;
  useruid: string;
  userchat = [];
  id: string;
  message: string;
  nombre: string;
  img: string;

  messages = [];

  constructor(public service: ServicesService, public active: ActivatedRoute, public chatservice: ChatService
    , private aut: AngularFireAuth, private router: Router) {
    this.uid = this.aut.auth.currentUser.uid;
    this.id = this.active.snapshot.paramMap.get('id');
  }


  ngOnInit() {
    this.getUsers();
    this.getmessages();
  }


  async getUsers() {
    await this.chatservice.functiongetUids(this.id).subscribe((uid: any) => {
      console.log(uid);
      if (uid != null) {
        this.chatservice.getProfiles(uid).subscribe((data: any) => {
          console.log(data);
          this.userchat = data;
        });
      }
    });
  }
  async getmessages() {
    await this.chatservice.getmessages(this.id).subscribe((data => {
      this.messages = data;
    }
    ));
    setTimeout(async () => {
      await this.content.scrollToBottom(1000);
    }, 2000);
  }

  sendmessage(text, uid, id) {
    this.messages = [];
    console.log(text);
    console.log(uid);
    console.log(id);
    if (text === undefined) {
      console.log('no puede mandar mensajes vacios');
    } else {
      this.chatservice.sendmessage(text, uid, id);
      this.getmessages();
      this.message = '';
    }
  }
  gotoprofile(uid) {
    console.log(uid);
    this.router.navigateByUrl(`/view/${uid}`);
  }

}

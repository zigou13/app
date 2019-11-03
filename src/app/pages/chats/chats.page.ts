import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  chats = [];
  uid: string;

  vacio: Boolean;

  constructor(
    public router: Router,
    private aut: AngularFireAuth,
    private chatservice: ChatService) {
    this.uid = this.aut.auth.currentUser.uid;
  }

  ngOnInit() {
    this.getchats();
  }
  public ionViewDidLoad(): void {
    console.log('hi');
  }
  getchats() {

    this.chatservice.functiongetchats(this.uid).subscribe((data: any) => {
      // this.chats = [];
      this.chats = data;
    });
  }

  ira(item) {
    console.log(this.uid);
    console.log(item[0].payload.doc.data().uid);
    this.chatservice.gotochatbyuid(this.uid, item[0].payload.doc.data().uid);
  }

}

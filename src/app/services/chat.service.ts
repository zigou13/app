
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Route, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  id: string;
  users1 = [];
  users2 = [];
  users3 = [];


  chats1 = [];
  chats2 = [];
  chats3 = [];

  messages = [];
  private itemsCollection: AngularFirestoreCollection<any>;
  private itemsCollection2: AngularFirestoreCollection<any>;



  constructor(public afs: AngularFirestore,
    public rout: Router,
    private auth: AngularFireAuth) { }


  // OMG I AM FUCKING PROUD OF THIS NEXT 100 LINES OF CODE

  functiongetUids(id) {
    this.itemsCollection = this.afs.collection<any>(`chats/${id}/users/`);

    // Get the uids
    return this.itemsCollection.valueChanges().pipe(map((info2: any[]) => {
      const uid = this.auth.auth.currentUser.uid;

      console.log(info2.length);

      for (let i = 0; i < info2.length; i++) {
        if (info2[i].uid !== uid) {
          this.users3 = info2[i].uid;
        }
      }

      console.log(this.users3);
      return this.users3;
    }));
  }

 async secondgetprofiles(id) {
    await this.getProfiles(id).subscribe((data: any) => {
      console.log(data);
      this.users3 = data;
    });
  }


  getProfiles(id) {
    this.itemsCollection = this.afs.collection<any>(`users/${id}/profile/`);

    return this.itemsCollection.snapshotChanges().pipe(map((info: any[]) => {
      this.users2 = [];
      for (const infos of info) {
        this.users2.unshift(infos);
      }
      // console.log(this.users2);
      return this.users2;
    }));
  }

  // Load messages

  getmessages(id) {
    this.itemsCollection = this.afs.collection<any>(`chats/${id}/messages/`);

    return this.itemsCollection.snapshotChanges().pipe(map((info: any[]) => {
      this.messages = [];

      for (const infos of info) {
        this.messages.unshift(infos);
      }
      // console.log(this.chips);
      return this.messages;
    }));
  }

  // Send a message

  sendmessage(text, uid, id) {
    const date = Date.now();
    const date2 = date.toString();
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(`chats/${id}/messages`).doc(date2).set({
        text: text,
        uid: uid,
        date: date,
      });
    });
  }

  gotochat(id) {
    // console.log('lleva a :' , id);
    // this.rout.navigateByUrl(`/chat/${id}`);
  }

  // create chat

  createchat(uid1, uid2) {
    const id = Math.random().toString(36).substring(2);
    return new Promise<any>((resolve, reject) => {
      // Put the second uid in the chats of the first uid
      this.afs.collection(`users/${uid1}/chats`).doc(uid2).set({
        uid: uid2,
        id: id,
        datecreate: Date.now(),
      });
      this.afs.collection(`users/${uid2}/chats`).doc(uid1).set({
        uid: uid1,
        id: id,
        datecreate: Date.now(),
      });
      this.afs.collection(`chats/${id}/users`).add({
        uid: uid2,
        id: id,
        datecreate: Date.now(),
      });
      this.afs.collection(`chats/${id}/users`).add({
        uid: uid1,
        id: id,
        datecreate: Date.now(),
      });
      this.rout.navigateByUrl(`/chat/${id}`);
    });
  }

  // check chat existence

  checkchatexistence(uid, uid2) {
    this.itemsCollection2 = this.afs.collection<any>(`users/${uid}/chats/`);
    let existence = false;
    let url = '';
    this.itemsCollection2.doc(uid2).ref.get().then(function (doc) {
      if (doc.exists) {
        // console.log('Document data:', doc.data());
        url = doc.data().id;
        console.log(url);

        existence = true;
      } else {
        // url = Math.random().toString(36).substring(2);
        // console.log('No chat');

        existence = false;
      }
    });
    setTimeout(() => {
      if (existence === true) {
        this.gotochat(url);
      } else {
        // console.log('creating chat..');
        this.createchat(uid, uid2);
      }
    }, 1500);
  }

  async gotochatbyuid(uid, uid2) {
    // let url = '';

    this.itemsCollection2 = this.afs.collection<any>(`users/${uid}/chats/`);

    await this.itemsCollection2.doc(uid2).ref.get().then((doc) => {
      if (doc.exists) {
        this.rout.navigateByUrl(`/chat/${doc.data().id}`);
      } else {
        console.log('no existe');
      }
    });

    // this.itemsCollection2.doc(uid2).ref.get().then((doc) => {
    //   if (doc.exists) {
    //     url = doc.data().id;
    //   } else {
    //   }
    // });
    // setTimeout(() => {
    //   this.gotochat(url);
    // }, 1500);
  }



  // Gets chats

  functiongetchats(uid) {
    this.itemsCollection = this.afs.collection<any>(`users/${uid}/chats/`);

    // Get the uids
    return this.itemsCollection.snapshotChanges().pipe(map((info2: any[]) => {
      this.chats1 = [];

      for (const infos of info2) {
        this.chats1.unshift(infos);
      }
      // Put them in a array
      for (let i = 0; i < this.chats1.length; i++) {

        this.chats2.push(this.chats1[i].payload.doc.data().uid);
      }
      // Get the info from those uniques uid
      for (let i = 0; i < this.chats2.length; i++) {
        // console.log(this.chats2[i]);
        this.chats3 = [];
        this.secondgetchats(this.chats2[i]);
      }
      // console.log(this.chats3);
      return this.chats3;
    }));
  }

  secondgetchats(id) {
    this.getchats(id).subscribe((data: any) => {
      this.chats3.push(data);
      // console.log(this.chats3);
    });
  }


  getchats(id) {
    this.itemsCollection = this.afs.collection<any>(`users/${id}/profile/`);

    return this.itemsCollection.snapshotChanges().pipe(map((info: any[]) => {
      this.chats2 = [];
      for (const infos of info) {
        this.chats2.unshift(infos);

      }
      // console.log(this.chats2);
      return this.chats2;
    }));
  }

}

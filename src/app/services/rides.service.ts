import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Route, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RidesService {

  id: string;
  users1 = [];
  users2 = [];
  users3 = [];
  private itemsCollection: AngularFirestoreCollection<any>;

  users12 = [];
  users22 = [];
  users32 = [];
  private itemsCollection2: AngularFirestoreCollection<any>;

  users123 = [];
  users223 = [];
  users323 = [];
  private itemsCollection23: AngularFirestoreCollection<any>;



  constructor(public afs: AngularFirestore, public rout: Router) { }


  // OMG I AM SOME PROUD OF THIS NEXT 100 LINES OF CODE

  functiongetRides(zone) {
    this.itemsCollection = this.afs.collection<any>(`zones/${zone}/rides`);

    // Get the uids
    return this.itemsCollection.snapshotChanges().pipe(map((info2: any[]) => {
      this.users1 = [];

      for (const infos of info2) {
        this.users1.unshift(infos);
      }

      // Put them in a array
      for (let i = 0; i < this.users1.length; i++ )  {
        this.users2.push(this.users1[i].payload.doc.data().id);
      }
      // // Get the info from those uniques uid
      for (let i = 0; i < this.users2.length; i++ )  {
        // console.log(this.users2[i]);
        this.secondgetRides(this.users2[i]);
      }
      //  console.log(this.users3);
      return this.users3;
    }));
  }

  secondgetRides(id) {
    this.getRides(id).subscribe((data: any) => {
      this.users3.push(data);
      // console.log(this.users3);
  });
  }


  getRides(id) {
    this.itemsCollection2 = this.afs.collection<any>(`rides/${id}/info/`);

    return this.itemsCollection2.snapshotChanges().pipe(map((info: any[]) => {
      this.users22 = [];
      for (const infos of info) {
        this.users22.unshift(infos);

      }
      // console.log(this.users2);
      return this.users22;
    }));
  }

  functiongetRides2(zone) {
    this.itemsCollection2 = this.afs.collection<any>(`zones/${zone}/rides`);

    // Get the uids
    return this.itemsCollection2.snapshotChanges().pipe(map((info2: any[]) => {
      this.users12 = [];

      for (const infos of info2) {
        this.users12.unshift(infos);
      }

      // Put them in a array
      for (let i = 0; i < this.users12.length; i++ )  {
        this.users22.push(this.users12[i].payload.doc.data().id);
      }
      // // Get the info from those uniques uid
      for (let i = 0; i < this.users22.length; i++ )  {
        // console.log(this.users2[i]);
        this.secondgetRides2(this.users22[i]);
      }
      //  console.log(this.users3);
      return this.users32;
    }));
  }

  secondgetRides2(id) {
    this.getRides2(id).subscribe((data: any) => {
      this.users32.push(data);
      // console.log(this.users3);
  });
  }


  getRides2(id) {
    this.itemsCollection2 = this.afs.collection<any>(`rides/${id}/info/`);

    return this.itemsCollection2.snapshotChanges().pipe(map((info: any[]) => {
      this.users22 = [];
      for (const infos of info) {
        this.users22.unshift(infos);

      }
      // console.log(this.users2);
      return this.users22;
    }));
  }

  functiongetRides3(zone) {
    this.itemsCollection23 = this.afs.collection<any>(`zones/${zone}/rides`);

    // Get the uids
    return this.itemsCollection23.snapshotChanges().pipe(map((info2: any[]) => {
      this.users123 = [];

      for (const infos of info2) {
        this.users123.unshift(infos);
      }

      // Put them in a array
      for (let i = 0; i < this.users123.length; i++ )  {
        this.users223.push(this.users123[i].payload.doc.data().id);
      }
      // // Get the info from those uniques uid
      for (let i = 0; i < this.users223.length; i++ )  {
        // console.log(this.users2[i]);
        this.secondgetRides3(this.users223[i]);
      }
      //  console.log(this.users3);
      return this.users323;
    }));
  }

  secondgetRides3(id) {
    this.getRides3(id).subscribe((data: any) => {
      this.users323.push(data);
      // console.log(this.users3);
  });
  }


  getRides3(id) {
    this.itemsCollection23 = this.afs.collection<any>(`rides/${id}/info/`);

    return this.itemsCollection23.snapshotChanges().pipe(map((info: any[]) => {
      this.users223 = [];
      for (const infos of info) {
        this.users223.unshift(infos);

      }
      // console.log(this.users2);
      return this.users223;
    }));
  }

  cleanvariable() {
    this.users1 = [];
    this.users2 = [];
    this.users3 = [];
    this.users12 = [];
    this.users22 = [];
    this.users32 = [];
    this.users123 = [];
    this.users223 = [];
    this.users323 = [];
  }
}

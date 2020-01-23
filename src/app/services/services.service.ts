import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  anuncios: any[] = [];
  info: any[] = [];
  private itemsCollection: AngularFirestoreCollection<any>;

  users1 = [];
  users2 = [];
  users3 = [];
  private itemsCollection2: AngularFirestoreCollection<any>;



  constructor(public afs: AngularFirestore, public rout: Router, private http: HttpClient) {
  }


  goto(id) {
    this.rout.navigateByUrl(id);
  }


  getProfile(id) {
    this.itemsCollection = this.afs.collection<any>(`users/${id}/profile/`);

    return this.itemsCollection.snapshotChanges().pipe(map((info: any[]) => {
      this.info = [];

      for (const infos of info) {
        this.info.unshift(infos);
      }

      return this.info;
    }));
  }




  crearUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(`users/${value.uid}/profile`).doc(value.uid).set({
        name: value.name,
        phone: value.phone,
        mail: value.mail,
        img: value.img,
        uid: value.uid,
        adress: value.adress,
        date: Date.now(),
        stars: 5,
        zone: value.zone

      });
      this.rout.navigateByUrl(`fill`);
    });
  }

  review(text) {
    return this.afs.collection('reviews').doc(Date.now().toString()).set({
      text: text,
      user: localStorage.getItem('uid'),
    });
   }
 


  updateUser(value, id?) {
   return this.afs.collection('users').doc(value.uid).collection('profile').doc(id).set(value);
  }

  userdata(car, mode , uid) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(`users/${uid}/profile`).doc(uid).update({
        car: car,
        mode: mode,
      });

      this.rout.navigateByUrl(`location`);
    });
  }

  userlocation(adress, zone , uid) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(`users/${uid}/profile`).doc(uid).update({
        zone: zone,
        adress: adress,
      });

      this.rout.navigateByUrl(`profile`);
    });
  }

  getride(id) {
    this.itemsCollection = this.afs.collection<any>(`rides/${id}/info/`);

    return this.itemsCollection.snapshotChanges().pipe(map((info: any[]) => {
      this.info = [];

      for (const infos of info) {
        this.info.unshift(infos);
      }

      return this.info;
    }));
  }

  createride(data) {
    return new Promise<any>((resolve, reject) => {

      const num = Math.floor(Math.random() * 6) + 1;
      const id = 'idride-' + num * Date.now();
      this.afs.collection(`rides/${id}/info`).doc('info').set({
        zone: data.zone,
        zipcode1: data.zipcode1,
        zipcode2: data.zipcode2,
        creationdate: Date.now(),
        uid: data.uid,
        information: data.information,
        start: data.start,
        destine: data.destine,
        rutine: data.rutine,
        id: id,
        hour: data.hour,
        seats: data.seats,
        car: data.car,
      });
      this.afs.collection(`zones/${data.zone}/rides`).doc(id).set({
        creationdate: Date.now(),
        uid: data.uid,
        destine: data.destine,
        start: data.start,

        rutine: data.rutine,
        id: id,
      });
      this.afs.collection(`users/${data.uid}/rides`).doc(id).set({
        creationdate: Date.now(),
        uid: data.uid,
        destine: data.destine,
        rutine: data.rutine,
        id: id,
      });
      setTimeout(() => {
      this.rout.navigateByUrl(`ride/${id}`);
      }, 500);
      // return this.afs.collection('users').doc(data.uid).collection('rides').doc(id).set(data);
  });

}


//obtener codigo postal

obtenerCodigoPostal(lat, lng){
  return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC6Zaf4zBj8h-RXCCIh6pPZn5hWK_OZVrg`);
}
uploadImage(imageURI, randomId) {
  return new Promise<any>((resolve, reject) => {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child('img').child(randomId);
    this.encodeImageUri(imageURI, function (image64) {
      imageRef.putString(image64, 'data_url')
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
        .then(res => resolve(res))
      }, err => {
        reject(err);
      });
    });
  });
}

encodeImageUri(imageUri, callback) {
  var c = document.createElement('canvas');
  var ctx = c.getContext("2d");
  var img = new Image();
  img.onload = function () {
    var aux: any = this;
    c.width = aux.width;
    c.height = aux.height;
    ctx.drawImage(img, 0, 0);
    var dataURL = c.toDataURL("image/jpeg");
    callback(dataURL);
  };
  img.src = imageUri;
}




// OMG I AM SOME PROUD OF THIS NEXT 100 LINES OF CODE

functiongetRides(uid) {
  this.itemsCollection2 = this.afs.collection<any>(`users/${uid}/rides`);

  // Get the uids
  return this.itemsCollection2.snapshotChanges().pipe(map((info2: any[]) => {
    this.users1 = [];

    for (const infos of info2) {
      this.users1.unshift(infos);
    }
    // Put them in a array
    for (let i = 0; i < this.users1.length; i++ )  {

      this.users2.push(this.users1[i].payload.doc.data().id);
    }
    // Get the info from those uniques uid
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
    this.users2 = [];
    for (const infos of info) {
      this.users2.unshift(infos);

    }
    // console.log(this.users2);
    return this.users2;
  }));
}




}


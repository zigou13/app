import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { ServicesService } from 'src/app/services/services.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

declare var google;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  @ViewChild('imageProd') inputimageProd: ElementRef;
  @ViewChild('autoCompleteInput2') inputNativeElement2: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;


  id: any;
  uid: string;
  name: any;
  phone: string;
  adress: string;
  img: any;
  mail: string;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  item: any;

  zone: any;

  lugar1: any;
  lugar2: any;

  new: any;

  cp: Boolean;

  constructor(private rout: Router,
    public route: ActivatedRoute,
    public services: ServicesService,
    public imagePicker: ImagePicker,
    public toastCtrl: ToastController,
    public afs: AngularFireStorage,
    public loadingController: LoadingController,
    private aut: AngularFireAuth ,
    public webview: WebView,
    public alertCtrl: AlertController , public activateroute: ActivatedRoute) {
     
  }

  ngOnInit() {
    this.logueado();
    this.initMap();
  }




  logueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            this.mail = user.email;
            this.uid = user.uid;
            console.log(this.mail);
            this.getProfile(this.uid);
          }
        });
  }

  async getProfile(id) {
    await this.services.getProfile(id).subscribe((data: any) => {
      console.log(data);
      if (data.length !== 0) {
        this.cp = true;
        this.id = data[0].payload.doc.id;
        this.name = data[0].payload.doc.data().name;
        this.phone = data[0].payload.doc.data().phone;
        this.adress = data[0].payload.doc.data().adress;
        this.img = data[0].payload.doc.data().img;
        this.zone = data[0].payload.doc.data().zone;

        console.log('profil full');
      } else {
        this.cp = false;
        console.log('profile empty');
      }

    });
  }

  openImagePicker(){
    console.log('click');
    this.imagePicker.hasReadPermission()
    .then((result) => {
      if (result === false) {
        // no callbacks required as this opens a popup which returns async
        this.imagePicker.requestReadPermission();
      }
      else if (result === true) {
        this.imagePicker.getPictures({
          maximumImagesCount: 1,
          quality: 50
        }).then(
        (results) => {
          for (let i = 0; i < results.length; i++) {
            this.uploadImageToFirebase(results[i]);
          }
        }, (err) => console.log(err)
        );
      }
    }, (err) => {
      console.log(err);
    });
  }

  async uploadImageToFirebase(image) {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    const toast = await this.toastCtrl.create({
      message: 'Image was updated successfully',
      duration: 3000
    });
    this.presentLoading2(loading);
    let image_src = this.webview.convertFileSrc(image);
    let randomId = Math.random().toString(36).substring(2);

    //uploads img to firebase storage
    this.services.uploadImage(image_src, randomId)
    .then(photoURL => {
      this.urlImage = photoURL;
      this.img=photoURL;
      loading.dismiss();
      toast.present();
    }, err => {
      console.log(err);
    });
  }
  async presentLoading2(loading) {
    return await loading.present();
  }



  onUpload(e) {
    console.log(e.target.files[0]);

    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `image/pic_${id}`;
    const ref = this.afs.ref(filePath);
    const task = this.afs.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    this.presentLoading();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
  }


  save(name, phone) {
    console.log(this.cp);
    const image = this.inputimageProd.nativeElement.value;
    const data = {
      name: name,
      phone: phone,
      mail: this.mail,
      img: image || this.urlImage,
      adress:   this.adress || 'new' ,
      uid: this.uid,
      zone: this.zone || 'new',
    };
    console.log(data);
    if (this.cp === false) {
      this.services.crearUser(data).then(
        res => {
          console.log('Upload' + res);
          this.rout.navigateByUrl(`fill`);
        });
    } else {
      this.services.updateUser(data, this.id).then(
        res => {
          console.log('Upload' + res);
          this.rout.navigateByUrl(`profile`);
        });
    }

  }


  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando imagen',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }
  moveFocus(nextElement) {
    nextElement.setFocus();
  }


  initMap() {
    const input = <HTMLInputElement>document.getElementById('pac-input-create');
    const input2 = <HTMLInputElement>document.getElementById('pac-input-create2');

    this.adress = input.value;

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']);
    const infowindow = new google.maps.InfoWindow();

    const infowindowContent = document.getElementById('infowindow-content');
    const infowindowContent2 = document.getElementById('infowindow-content2');
    const infowindowContent3 = document.getElementById('infowindow-content3');

    infowindow.setContent(infowindowContent);
    infowindow.setContent(infowindowContent2);
    infowindow.setContent(infowindowContent3);

    autocomplete.addListener('place_changed', () => {
      infowindow.close();
      const place = autocomplete.getPlace();



      if (!place.geometry) {
        this.error('error');
        return;
      }

      let address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;



      if (place.address_components[place.address_components.length - 1].types[0] === 'postal_code') {
        // console.log('tiene codigo postal');
        localStorage.setItem('ubic1', input.value);
        infowindowContent2.children['place-ub1'].textContent = input.value;
        infowindowContent2.children['place-code'].textContent =
          place.address_components[place.address_components.length - 1].long_name;
        localStorage.setItem('zone', place.address_components[place.address_components.length - 1].long_name);
      } else {
        input.value = '';
        this.error('error');
      }
    });

  }

  async error(mensaje: string) {
    const alert = await this.alertCtrl.create({
      message: 'Direccion invalida se más especifico',
      buttons: ['OK']
    });
    await alert.present();
  }

}

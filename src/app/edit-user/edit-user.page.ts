import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { ServicesService } from '../services/services.service';
import { Storage } from '@ionic/storage';

declare var google;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit, OnDestroy {

  uidprofile: string;
  uid: string;
  zones: any;
  telefono: any;
  prefijo: any;
  nombre: any;
  zona: any;
  profiledata: any;

  url: any;

  cod1: any;
  cod2: any;

  constructor(public router: Router, public active: ActivatedRoute, private aut: AngularFireAuth
    , private http: HttpClient, public cargaImagen: ServicesService,  private storage: Storage) {

    if (this.cargaImagen.url === undefined) {
      this.cargaImagen.url = '/assets/icons/user.svg';
    }

    this.uid = this.active.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.profileload();
    // this.zonasload();
  }

  logueado() {

    this.aut.authState
      .subscribe(
        user => {
          console.log(user.uid);
          if (user.uid != null) {
            this.uid = user.uid;
          } else {
            this.router.navigate([`/login`]);
          }
        }
      );
  }

  moveFocus(nextElement) {
    nextElement.setFocus();
  }

  gotouser() {
    this.router.navigate([`/profile/${this.uid}`]);
  }

  async profileload() {

    await this.http.get(`http://uicar.openode.io/users/` + this.uid + '/info').subscribe((data: any) => {
      console.log(data);
      this.cargaImagen.url = data[0].img;
      this.nombre = data[0].nombre;
      this.telefono = data[0].whatsapp;
      this.zona = data[0].ubication;
      this.prefijo = data[0].prefijo;    });
  }

  gotocreate() {
    this.router.navigate([`/create`]);
  }
  async cargaruid() {
    await this.active.params.subscribe((data2: any) => {
      this.uidprofile = data2.id;
    });
  }

  async makepost() {
    const telf =  this.telefono;
    const { nombre, zona, url , prefijo} = this;
    console.log(nombre, telf, zona , localStorage.getItem('ubic1') , prefijo);



    if (this.cargaImagen.url === undefined) {
      this.cargaImagen.url = '/assets/icons/user.svg';
    }

    await this.http.post('http://uicar.openode.io/edituser/', {
      nombre: nombre,
      uid: this.uid,
      img: this.cargaImagen.url,
      code: zona,
      whatsapp: telf,
      ubic : zona ,
      prefijo : prefijo
    }).subscribe((response) => {
      console.log(response);
      this.router.navigate([`home`]);
    }, error => {
      console.log(error);
      this.router.navigate([`profile/${this.uid}`]);
    });
    // this.guardar();
    this.storage.set('zona', localStorage.getItem('cod1'));
  }

  ngOnDestroy() {
  }

  cargarImagen() {
    this.cargaImagen.cargarImagen(this.url);
  }






  // async initMap() {

  //   const input = <HTMLInputElement>document.getElementById('pac-input');
  //   const input2 = <HTMLInputElement>document.getElementById('pac-input2');

  //   const autocomplete = new google.maps.places.Autocomplete(input);
  //   const autocomplete2 = new google.maps.places.Autocomplete(input2);

  //   autocomplete.setFields(
  //     ['address_components', 'geometry', 'icon', 'name']);
  //   autocomplete2.setFields(
  //     ['address_components', 'geometry', 'icon', 'name']);

  //   const infowindow = new google.maps.InfoWindow();

  //   const infowindowContent = document.getElementById('infowindow-content');
  //   const infowindowContent2 = document.getElementById('infowindow-content2');
  //   const infowindowContent3 = document.getElementById('infowindow-content3');

  //   infowindow.setContent(infowindowContent);
  //   infowindow.setContent(infowindowContent2);
  //   infowindow.setContent(infowindowContent3);

  //   autocomplete.addListener('place_changed', function () {
  //     infowindow.close();
  //     const place = autocomplete.getPlace();



  //     if (!place.geometry) {
  //       window.alert('No se obtuvo lugar ' + place.name);
  //       return;
  //     }

  //     let address = '';
  //     if (place.address_components) {
  //       address = place.address_components[1] || place.address_components[1].short_name;
  //     }

  //     infowindowContent.children['place-icon'].src = place.icon;
  //     infowindowContent.children['place-name'].textContent = place.name;
  //     infowindowContent.children['place-address'].textContent = address;


  //     console.log(place);

  //     if (place.address_components[place.address_components.length - 1].types[0] === 'postal_code') {
  //       console.log('tiene codigo postal');
  //       localStorage.setItem('ubic1', place.name);
  //       infowindowContent2.children['place-ub1'].textContent = place.name;
  //       infowindowContent2.children['place-code'].textContent =
  //         place.address_components[place.address_components.length - 1].long_name;
  //       localStorage.setItem('cod1', place.address_components[place.address_components.length - 1].long_name);
  //     } else {
  //       input.value = '';
  //       alert('Intente con otra direccion');
  //     }
  //   });

  //   autocomplete2.addListener('place_changed', function () {
  //     infowindow.close();
  //     const place = autocomplete2.getPlace();

  //     if (!place.geometry) {
  //       window.alert('No se obtuvo lugar ' + place.name);
  //       return;
  //     }

  //     let address = '';
  //     if (place.address_components) {
  //       address = place.address_components[1] || place.address_components[1].short_name;
  //     }

  //     infowindowContent.children['place-icon'].src = place.icon;
  //     infowindowContent.children['place-name'].textContent = place.name;
  //     infowindowContent.children['place-address'].textContent = address;

  //     console.log(place);
  //     if (place.address_components[place.address_components.length - 1].types[0] === 'postal_code') {
  //       console.log('tiene codigo postal');
  //       localStorage.setItem('ubic2', place.name);
  //       infowindowContent3.children['place-ub2'].textContent = place.name;
  //       infowindowContent3.children['place-code2'].textContent =
  //         place.address_components[place.address_components.length - 1].long_name;
  //       localStorage.setItem('cod2', place.address_components[place.address_components.length - 1].long_name);
  //     } else {
  //       input2.value = '';
  //       alert('Intente con otra direccion');
  //     }
  //   });
  // }

  // guardar() {
  //   if (localStorage.getItem('ubic1') !== null ) {
  //     const valor = {
  //       ubi1: localStorage.getItem('ubic1'),
  //       cod1: localStorage.getItem('cod1'),
  //     };
  //     console.log(valor);
  //     localStorage.clear();
  //   } else {
  //     // alert('Comprueba que los valores esten llenos');
  //   }

  // }

}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { AlertController, ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { mapstyle } from 'src/assets/maps/mapstyle';

declare var google;



@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  zones: any;
  trayectos: any;
  inicio: string;
  destino: string;
  buscado = false ;
  errore: string;

  map: any;
  directionsDisplay: any;

  lat: any;
  lng: any;

  style = mapstyle;

  @ViewChild('mapElement') mapNativeElement: ElementRef;
  @ViewChild('autoCompleteInput') inputNativeElement: ElementRef;
  @ViewChild('autoCompleteInput2') inputNativeElement2: ElementRef;
  directionsService = new google.maps.DirectionsService;

  constructor(
    private router: Router,
    private aut: AngularFireAuth,
    public modalCtrl: ModalController,
    private geolocation: Geolocation ,
    ) {



  }

  ngOnInit() {
    this.posicion();
    this.obtenerUbicacion();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  posicion() {
    this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        // console.log('tus cordenadas', this.lng, this.lat);
    }).catch((error) => {
        console.log('Error getting location', error);
    });
}

  async search() {
  }

  async obtenerUbicacion() {
    await this.geolocation.getCurrentPosition().then((resp) => {

      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        zoom: 16,
        center: { lat: this.lat, lng: this.lng }
      });
      /*location object*/
      const pos = {
        lat: this.lat,
        lng: this.lng
      };
      map.setCenter(pos);
      const icon = {
        // url: 'assets/placeholder.png', // image url
        // scaledSize: new google.maps.Size(50, 50), // scaled size
      };
      const marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Hello World!',
        icon: icon
      });
      this.directionsDisplay.setMap(map);
    });
  }
}

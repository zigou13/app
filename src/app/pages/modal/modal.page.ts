import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { mapstyle } from 'src/assets/maps/mapstyle';
import { RidesService } from '../../services/rides.service';

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

  adress: string;


  map: any;
  directionsDisplay: any;

  lat: any;
  lng: any;

  id: string;


  style = mapstyle;

  @ViewChild('mapElement') mapNativeElement: ElementRef;
  @ViewChild('autoCompleteInput') inputNativeElement: ElementRef;
  @ViewChild('autoCompleteInput2') inputNativeElement2: ElementRef;
  directionsService = new google.maps.DirectionsService;

  currentLocation: any = {
    lat: 0,
    lng: 0
  };
  constructor(
    private router: Router,
    public modalCtrl: ModalController,
    private geolocation: Geolocation ,
    private alertCtrl: AlertController,
    private ridesservice: RidesService,
    private loadingcontroller: LoadingController,
    ) {
      this.obtenerUbicacion();



  }

  ngOnInit() {
    this.posicion();
    this.initMap();

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
    this.rutes();
    this.presentLoading('Loading rides');
    setTimeout(() => {
      this.rutes();
    }, 1000);

  }

  initMap() {
    const input = <HTMLInputElement>document.getElementById('pac-input-create');

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
        localStorage.setItem('zip1', place.address_components[place.address_components.length - 1].long_name);
      } else {
        input.value = '';
        this.error('error');
      }
    });

  }


  async obtenerUbicacion() {
    await this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.currentLocation.lat = resp.coords.latitude;
      this.currentLocation.lng = resp.coords.longitude;

      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        zoom: 16,
        center: { lat: this.currentLocation.lat, lng: this.currentLocation.lng }
      });
      /*location object*/
      const pos = {
        lat: this.currentLocation.lat,
        lng: this.currentLocation.lng
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

  async presentLoading(message) {
    const loading = await this.loadingcontroller.create({
      message: message,
      duration: 1000
    });
  }
  async rutes() {

    this.ridesservice.functiongetRides3(localStorage.getItem('zip1')).subscribe((data: any) => {
     console.log(localStorage.getItem('zip1'));
       for (let i = 0; i < data.length; i++) {
         console.log(data[i][0].payload.doc.data().id);

           this.directionsService.route({
               origin: data[i][0].payload.doc.data().start,
               destination: data[i][0].payload.doc.data().destine,
               travelMode: 'DRIVING'
           }, (response, status) => {
               const waypoint_markers = [];
               if (status === 'OK') {
                   this.directionsDisplay.setDirections(response);

                   this.directionsDisplay = new google.maps.DirectionsRenderer({
                       suppressBicyclingLayer: true,
                       // suppressMarkers: true,
                       strokeColor: 'black'
                       // }
                   });
                   const myRoute = response.routes[0].legs[0];
                   const marker = new google.maps.Marker({
                       position: myRoute.steps[0].start_point,
                       map: this.map,
                       id: data[i][0].payload.doc.data().id,
                       zIndex: 999999,
                   });
                   this.attachInstructionText(marker);
                   const marker1 = new google.maps.Marker({
                       position: myRoute.steps[myRoute.steps.length - 1].end_point,
                       map: this.map,
                       id: data[i][0].payload.doc.data().id,
                       zIndex: 999999,
                   });
                   this.attachInstructionText(marker1);
                   this.directionsDisplay.setMap(this.map);
               } else {
                   // window.alert('Directions request failed due to ' + status);
                   // this.ubicacion();
               }
           });
       this.directionsDisplay = new google.maps.DirectionsRenderer();
       this.map = new google.maps.Map(document.getElementById('map3'), {
           zoom: 13,
           mapTypeId: 'roadmap',
           styles: this.style,
           center: {lat: this.lat, lng: this.lng},
       });
       this.directionsDisplay.setMap(this.map);

       }
   });
}

attachInstructionText(marker) {
  const self = this;
  console.log(marker.id);
  const id = marker.id;
  console.log(self.id);

  google.maps.event.addListener(marker, 'click', function () {
    console.log(marker.id);
    self.gotoride(marker.id);
  });
}

gotoride(id) {
  console.log(id);
  this.close();
  this.router.navigateByUrl(`ride/${id}`);
}



  async error(mensaje: string) {
    const alert = await this.alertCtrl.create({
      message: 'Direcction not valid please be more specific',
      buttons: ['OK']
    });
    await alert.present();
  }
}

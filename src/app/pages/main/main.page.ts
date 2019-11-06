import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


import { ActionSheetController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { mapstyle } from 'src/assets/maps/mapstyle';
import { RidesService } from 'src/app/services/rides.service';
import { ServicesService } from 'src/app/services/services.service';



declare var google;

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, AfterViewInit {
  @ViewChild('map') mapNativeElement: ElementRef;
  latitude: any;
  longitude: any;
  item: any[] = [];
  id: string;

  map: any;
  directionsDisplay: any;

  style = mapstyle;


  lat: number;
  num: any;
  lng: number;

  rides: any[] = [];
  rides2: any[] = [];


  rideszone: any;

  zone: any;

  constructor(
    private aut: AngularFireAuth,
    private router: Router, public services: ServicesService,
    public actionSheetController: ActionSheetController,
    private geolocation: Geolocation,
    private ridesservice: RidesService,
    private modalController: ModalController) {

      this.getrides(this.zone);

      setTimeout(() => {
        this.rutes();
        this.getrides(this.zone);
      }, 2000);
      setTimeout(() => {
        this.rutes();
      }, 3000);
      setTimeout(() => {
        this.rutes();
      }, 6000);
      setTimeout(() => {
        this.rutes();
      }, 9000);
      setTimeout(() => {
        if ( this.rides.length === 0 && this.rides2.length === 0) {
           this.ubicacion();
        }
      }, 10000);

  }

  directionsService = new google.maps.DirectionsService();

  ngOnInit() {
    this.logueado();
    this.posicion();

  }

  ngAfterViewInit() {
  }
  gotoride(id) {
    console.log(id);
    this.router.navigateByUrl(`ride/${id}`);
  }


  getrides(zone) {
    this.ridesservice.functiongetRides(zone).subscribe((data: any) => {
      this.rides2 = data;
    });
  }
  posicion() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      // console.log('tus cordenadas', this.lng, this.lat);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  ubicacion() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: { lat: this.latitude, lng: this.longitude },
        zoom: 16
      });
      /*location object*/
      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };
      map.setCenter(pos);
      const marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Hello World!'
      });
      const contentString = this.item[0].payload.doc.data().adress;
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400
      });
      marker.addListener('click', function () {
        infowindow.open(map, marker);
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }




  async logueado() {
    await this.aut.authState
      .subscribe(
        user => {
          if (user) {
            console.log('loged');
            this.id = user.uid;
            console.log(this.id);
            this.getProfile(this.id);
          } else {
            this.router.navigateByUrl('/register');
          }
        },
        () => {
          this.router.navigateByUrl('/register');
        }
      );
  }

  async signOut() {
    const res = await this.aut.auth.signOut();
    console.log(res);
    this.router.navigateByUrl('/login');
  }

  async getProfile(id) {
    await this.services.getProfile(id).subscribe((data: any) => {
      // console.log(data[0].payload.doc.data().zone);
      if (data.length === 0) {
        console.log('profile empty');
        this.router.navigateByUrl(`edit-profile`);
      } else {
        console.log('Profile not empty');
        console.log(data);
        this.item = data;
        if (data[0].payload.doc.data().zone === null) {
          console.log('No zone');
          this.ubicacion();
        } else {

          this.zone = data[0].payload.doc.data().zone;

        }
      }
    });
  }

  profile() {
    this.router.navigateByUrl(`profile`);
  }

  goto() {
    this.router.navigateByUrl(`create`);
  }

  async presentModal() {
    const modal2 = await this.modalController.create({
      component: ModalPage,
    });
    return await modal2.present();
  }



  async rutes() {

    this.ridesservice.functiongetRides2(this.zone).subscribe((data: any) => {
     console.log(data);
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
                   this.ubicacion();
               }
           });
       this.directionsDisplay = new google.maps.DirectionsRenderer();
       this.map = new google.maps.Map(document.getElementById('map'), {
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

  async presentActionSheets() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Settings',
      buttons: [
        {
          text: 'Log out',
          icon: 'exit',
          handler: () => {
            this.signOut();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();
  }
}

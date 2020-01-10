import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';

import { ActionSheetController, AlertController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { mapstyle } from 'src/assets/maps/mapstyle';
import { RidesService } from 'src/app/services/rides.service';
import { ServicesService } from 'src/app/services/services.service';

import {HttpClient} from '@angular/common/http';
import { GetService } from '../../services/get.service';
import { Storage } from '@ionic/storage';

declare var google;

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit{
  @ViewChild('map') mapNativeElement: ElementRef;
  latitude: any;
  longitude: any;
  item: any[] = [];
  uid: string;
  name:string;

  map: any;
  directionsDisplay: any;

  style = mapstyle;

  empty: boolean;


  lat: number;
  num: any;
  lng: number;

  rides: any[] = [];
  rides2: any[];

  loading = true;


  rideszone: any;

  zone: any;

  constructor(
    private aut: AngularFireAuth,
    private router: Router, public services: ServicesService,
    public actionSheetController: ActionSheetController,
    private geolocation: Geolocation,
    private ridesservice: RidesService,
    private modalController: ModalController,
    public alertController: AlertController,
    private http: HttpClient,
    private fcm: FCM,
    private storage: Storage,
    public bs: GetService) {


  }


  directionsService = new google.maps.DirectionsService();

  
  ngOnInit() {
    this.fcm.getToken().then(token => {
      console.log(token);
      this.storage.set('notif', token);
    });
    this.logueado();
    this.posicion();

    // this.init();

  }

  init() {

    // setTimeout(() => {
      //   this.getProfile(this.uid);
      //   this.posicion();
      // }, 2000);


      // setTimeout(() => {
        //   this.zone =  this.item[0].payload.doc.data().zone;

        //   console.log(this.zone);
        //   this.rutes();
        //   this.bs.ridesload(this.zone);
        //   // this.presentAlertMultipleButtons();
        // }, 3000);

      }




      refresh() {

        this.ridesservice.cleanvariable();
        this.rutes();
      }


      gotoride(id) {
        console.log(id);
        this.router.navigateByUrl(`ride/${id}`);
      }

      posicion() {
        this.geolocation.getCurrentPosition().then((resp) => {
          console.log(resp);
          this.lat = resp.coords.latitude;
          this.lng = resp.coords.longitude;


          this.obtenerCodigoPostal(this.lat, this.lng);
        });
      }



      obtenerCodigoPostal(lat, lng){
        // console.log(lat, lng);
        this.services.obtenerCodigoPostal(lat,lng).subscribe((data:any)=>{
          console.log(data.results[0].address_components);
          const tam= data.results[0].address_components.length - 1;
          console.log(data.results[0].address_components[tam]);
          if(data.results[0].address_components[tam].types[0]==='postal_code'){

            console.log('si tiene postal');
            console.log(data.results[0].address_components[tam].long_name);
            this.rutes(data.results[0].address_components[tam].long_name);
          }else{
            console.log('no tiene postal');
          }
        });
      }




      async rutes(zone) {

        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          mapTypeId: 'roadmap'
        });
        this.directionsDisplay.setMap(this.map);
        console.log(zone);
        await this.http.get(`http://uicar.openode.io/zones/${zone}/3`).subscribe((data: any) => {
          // console.log(data);
          this.rides2 = data;
          if(   this.rides2.length === 0) {
            console.log('Data empty' + this.rides2);
            this.mapempty();
            this.empty = true;
          } else {
            // console.log('not empty i guss' + this.rides2);
          }
          for (let i = 0; i < data.length; i++) {

            this.directionsService.route({
              origin: data[i].start,
              destination: data[i].destine,
              travelMode: 'DRIVING'
            }, (response, status) => {
              const waypoint_markers = [];
              if (status === 'OK') {
                this.directionsDisplay.setDirections(response);

                this.directionsDisplay = new google.maps.DirectionsRenderer({
                  suppressBicyclingLayer: true
                  // suppressMarkers: true
                });
                const myRoute = response.routes[0].legs[0];
                const marker = new google.maps.Marker({
                  position: myRoute.steps[0].start_point,
                  map: this.map,
                  id: data[i].id,
                  zIndex: 999999,

                });
                this.attachInstructionText(marker);
                const marker1 = new google.maps.Marker({
                  position: myRoute.steps[myRoute.steps.length - 1].end_point,
                  map: this.map,
                  id: data[i].id,
                  zIndex: 999999,
                });
                this.attachInstructionText(marker1);
                this.directionsDisplay.setMap(this.map);
              } else {
                // window.alert('Directions request failed due to ' + status);
              }
            });
          }
          this.loading = false;
        });
      }



      async logueado() {
        await this.aut.authState
        .subscribe(
          user => {
            if (user) {
              // console.log('loged');
              this.uid = user.uid;
              this.getProfile(this.uid);
              // console.log(this.uid);
            } else {
              this.router.navigateByUrl('/register');
            }
          },
          () => {
            this.router.navigateByUrl('/register');
          }
          );
      }

      async getProfile(id) {
        console.log(id);
        await this.services.getProfile(id).subscribe((data: any) => {
          // console.log(data[0].payload.doc.data().zone);

          if (data.length === 0) {
            console.log('profile empty');
            //  this.router.navigateByUrl(`edit-profile`);
          } else {

            this.item = data;
            this.zone = data[0].payload.doc.data().zone;
            this.name= data[0].payload.doc.data().name;

            this.bs.ridesload(this.zone);
            // this.rutes(this.zone);
          }

        });
      }


      goto(id) {
        this.router.navigateByUrl(id);
      }

      async presentModal() {
        const modal2 = await this.modalController.create({
          component: ModalPage,
        });
        return await modal2.present();
      }




      attachInstructionText(marker) {
        const self = this;
        // console.log(marker.id);
        const id = marker.id;
        // console.log(self.uid);

        google.maps.event.addListener(marker, 'click', function () {
          // console.log(marker.id);
          self.gotoride(marker.id);
        });
      }

      async mapempty() {
        await this.geolocation.getCurrentPosition().then((resp) => {
          // console.log(resp);

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

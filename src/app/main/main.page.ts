import {Component, AfterViewInit, OnInit, DoCheck, OnChanges, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router, ActivatedRoute} from '@angular/router';
import {ServicesService} from '../services.service';
import {HttpClient} from '@angular/common/http';
import {ModalController, Platform, IonSegment} from '@ionic/angular';
import {ModalPagePage} from '../modal-page/modal-page.page';
import {ModalTablonPage} from '../modal-tablon/modal-tablon.page';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { mapstyle } from '../../assets/maps/mapstyle';

import { mapstyle2 } from '../../assets/maps/mapstyle2';
import { Storage } from '@ionic/storage';

import {
    BackgroundGeolocation,
    BackgroundGeolocationConfig,
    BackgroundGeolocationResponse,
    BackgroundGeolocationEvents
  } from '@ionic-native/background-geolocation/ngx';


  import { HTTP } from '@ionic-native/http/ngx';


declare var google;


@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements AfterViewInit, OnInit {
    uid: string;
    profiledata = [];
    tablondata = [];
    data = [];
    trayectos = [];
    weather = [];
    zona;
    nombre = 'Usuario';


    img = '/assets/icons/user.svg';
    // Variables map


    gps_update_link = 'uicar.openode.io/data/';


    key = 'AIzaSyATy7pX219NlBc9Sac6Biz0JgWR-cTB2f8';
    map: any;
    directionsDisplay: any;
    usuario: any;
    lat: number;
    num: any;
    lng: number;
    hr = (new Date()).getHours();
    estilo = [] ;
    lloviendo = false;


    directionsService = new google.maps.DirectionsService();


    segment: number;
    @ViewChild('slides') slides;


    constructor(private aut: AngularFireAuth,
                public modalController: ModalController,
                private router: Router, public _servicie: ServicesService,
                private http: HttpClient,
                private geolocation: Geolocation,
                private statusBar: StatusBar,
                private storage: Storage,
                private backgroundGeolocation: BackgroundGeolocation,
                private http2: HTTP) {
                    this.segment = 0;
                }
                public async setSegment(activeIndex: Promise<number>) {
                    this.segment = await activeIndex;
                  }

    ngOnInit() {
        this.logueado();
        this.checkday();
        // this.getweather();
        // this.startBackgroundGeolocation();
    }

    ngAfterViewInit() {
        this.iniciar();
    }

    async logueado() {
        await this.aut.authState
            .subscribe(
                user => {
                    if (!user) {
                        this.router.navigate(['/login']);
                    } else {
                        // console.log('logueado');
                        this.uid = user.uid;
                    }
                });

        return this.uid;
    }

    async checkday() {
        // console.log(this.hr);
        if ( this.hr >= 21 || this.hr <= 7 ) {
            // console.log('Es de noche');
            this.estilo = mapstyle;
        } else {
            // console.log('Es de dia');
            this.estilo = mapstyle2;
        }
    }

    async presentModal2() {
        const modal2 = await this.modalController.create({
            component: ModalTablonPage,
            componentProps: {zona: this.zona, nombre: this.nombre , img: this.img}
        });
        return await modal2.present();
    }

    gotoprofile() {
        this.router.navigate([`/profile/${this.uid}`]);
    }

    gotoinfoTrayecto(id: string) {
        this.router.navigate([`/info-trayecto/${id}`]);
    }

    gotoPerfil(id: string) {
        this.router.navigate([`/profile/${id}`]);
    }

    gotoall() {
        this.router.navigate([`/todos-trayectos/${this.zona}`]);
    }
    gotoalltablon() {
        this.router.navigate([`/todos-tablon/${this.zona}`]);
    }
    gotosearch() {
        this.router.navigate([`/search/`]);
    }


    async profileload(id: string) {
        await this.http.get(`http://uicar.openode.io/users/${id}/info`).subscribe((data: any) => {
            // console.log(data);
            this.profiledata = data;
        });
    }
    async getweather() {
    await this.http
    .get(`http://api.openweathermap.org/data/2.5/weather?q=Madrid&appid=18c90d97bb8bcdd19f4321b7926b0e6f`).subscribe((data: any) => {
         // console.log(data);
    this.weather = data;
        // console.log(data.rain['1h']);
        if ( data.rain['1h'] >= 0.1 ) {
            this.lloviendo = true ;
            // console.log('Esta lloviendo');
        } else {
            // console.log('No esta lloviendo');
        }
    });
    }
    async tablonload(id: string) {

        await this.http.get(`http://uicar.openode.io/tablon/${id}/100`).subscribe((data: any) => {

            this.tablondata = data;
        });
    }

    async trayectosload(id: string) {
        await this.http.get(`http://uicar.openode.io/zonas/${id}/100`).subscribe((data: any) => {
            // console.log(data);
            this.trayectos = data;
        });
    }


    // Mapa

    async rutas(zona: string) {

        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            mapTypeId: 'terrain',
            styles: this.estilo
        });
        this.directionsDisplay.setMap(this.map);

        await this.http.get(`http://uicar.openode.io/zonas/${zona}/3`).subscribe((data: any) => {
            for (let i = 0; i < data.length; i++) {
                this.directionsService.route({
                    origin: data[i].inicio,
                    destination: data[i].destino,
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
                            zIndex: 999999
                        });
                        this.attachInstructionText(marker);
                        const marker1 = new google.maps.Marker({
                            position: myRoute.steps[myRoute.steps.length - 1].end_point,
                            map: this.map,
                            id: data[i].id,
                            zIndex: 999999
                        });
                        this.attachInstructionText(marker1);
                        this.directionsDisplay.setMap(this.map);
                    } else {
                        // window.alert('Directions request failed due to ' + status);
                    }
                });
            }
        });
    }
    emptymap() {
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            mapTypeId: 'terrain',
            styles: this.estilo
        });
    }

    attachInstructionText(marker) {
        const self = this;
        google.maps.event.addListener(marker, 'click', function () {
            self.gotoinfoTrayecto(this.id);
        });
    }

    doRefresh(event) {

        this.logueado();

        setTimeout(() => {
            this.profileload(this.uid);
        }, 1000);

        setTimeout(() => {
            this.zona = this.profiledata[0].ubication;
            this.nombre = this.profiledata[0].nombre;
            this.num = this.profiledata[0].whatsapp;
            this.img = this.profiledata[0].img;
        }, 2000);

        setTimeout(() => {
            this.trayectosload(this.zona);
            this.tablonload(this.zona);
            this.rutas(this.zona);
            event.target.complete();
        }, 3000);
        setTimeout(() => {
            if ( this.trayectos.length === 0 ) {
                this.zona = '28013';
                this.trayectosload('28013');
                this.tablonload('28013');
                this.rutas('28013');
            }
        }, 4500);

    }


    iniciar() {
        setTimeout(() => {
            this.profileload(this.uid);
        }, 1000);

        setTimeout(() => {
            this.nombre = this.profiledata[0].nombre;
            this.num = this.profiledata[0].whatsapp;
            this.zona = this.profiledata[0].ubication;
            this.img = this.profiledata[0].img;
        }, 2000);

        setTimeout(() => {
            this.trayectosload(this.zona);
            this.tablonload(this.zona);
            this.rutas(this.zona);
        }, 3000);

        setTimeout(() => {
            if ( this.trayectos.length === 0 ) {
                this.zona = '28013';
                this.trayectosload('28013');
                this.tablonload('28013');
                this.rutas('28013');
            }
        }, 4500);
    }



    // Background geo



    startBackgroundGeolocation() {
        const config: BackgroundGeolocationConfig = {
          desiredAccuracy: 10,
          stationaryRadius: 20,
          distanceFilter: 30,
          debug: true, //  enable this hear sounds for background-geolocation life-cycle.
          stopOnTerminate: false // enable this to clear background location settings when the app terminates
        };

        this.backgroundGeolocation.configure(config).then(() => {
          this.backgroundGeolocation
            .on(BackgroundGeolocationEvents.location)
            .subscribe((location: BackgroundGeolocationResponse) => {
              console.log(location);
              this.sendGPS(location);
              this.backgroundGeolocation.finish();
              // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
              // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
              // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            });
        });
     // start recording location
        this.backgroundGeolocation.start();

        // If you wish to turn OFF background-tracking, call the #stop method.
        // this.backgroundGeolocation.stop();
      }
      sendGPS(location) {
        if (location.speed === undefined) {
          location.speed = 0;
        }
        const timestamp = new Date(location.time);
        this.http2
          .post(
            this.gps_update_link, // backend api to post
            {
              lat: location.latitude,
              lng: location.longitude,
              timestamp: timestamp,
              uid: this.uid
            },
            {}
          )
          .then(data => {
            console.log(data.status);
            console.log(data.data); // data received by server
            console.log(data.headers);
            this.backgroundGeolocation.finish(); // FOR IOS ONLY
          })
          .catch(error => {
            console.log(error.status);
            console.log(error.error); // error message as string
            console.log(error.headers);
            this.backgroundGeolocation.finish(); // FOR IOS ONLY
          });
      }




      // Segment


      segmentChanged( event) {

        const valuesegment = event.detail.value;

        console.log(valuesegment);

      }

}

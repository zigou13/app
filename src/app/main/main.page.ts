import {Component, AfterViewInit, OnInit, DoCheck, OnChanges, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {ServicesService} from '../services/services.service';
import {HttpClient} from '@angular/common/http';
import {ModalController} from '@ionic/angular';

import {ModalTablonPage} from '../modal-tablon/modal-tablon.page';

import { mapstyle } from '../../assets/maps/mapstyle';

import { mapstyle2 } from '../../assets/maps/mapstyle2';


import { BackendService } from '../services/backend.service';


  import { HTTP } from '@ionic-native/http/ngx';


declare var google;


@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements AfterViewInit, OnInit {
    uid: string;
    data = [];

    weather = [];
    zona;
    nombre = 'Usuario';


    img: string;


    // Variables map


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


    gps_update_link = '192.168.1.38/data';


    segment: number;
    @ViewChild('slides') slides;

    slideOpts = {
        initialSlide: 0,
        speed: 400,
    };



    constructor(private aut: AngularFireAuth,
                private http2: HTTP,
                public modalController: ModalController,
                private router: Router, public _servicie: ServicesService,
                private http: HttpClient,
                public bs: BackendService) {

                        this.aut.authState
                            .subscribe(
                                user => {
                                    if (!user) {
                                        this.router.navigate(['/login']);
                                    } else {
                                        // console.log('logueado');
                                        this.uid = user.uid;
                                    }
                                });
                    this.segment = 0;
                }
                public async setSegment(activeIndex: Promise<number>) {
                    this.segment = await activeIndex;
                  }

    ngOnInit() {
        this.bs.logueado();
        this.checkday();
    }

    ngAfterViewInit() {
        this.iniciar();
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




    // Mapa

    async rutas(zona: string) {

        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            mapTypeId: 'terrain',
            styles: this.estilo
        });
        this.directionsDisplay.setMap(this.map);

        await this.http.get(`http://uicar.fr.openode.io/zonas/${zona}/3`).subscribe((data: any) => {
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
            self.bs.goto2( 'info-trayecto' , this.id);
        });
    }

    doRefresh(event) {

        this.bs.logueado();

        setTimeout(() => {
            this.bs.profileload(this.uid);
        }, 1000);

        setTimeout(() => {
            this.zona = this.bs.profiledata[0].ubication;
            this.nombre = this.bs.profiledata[0].nombre;
            this.num = this.bs.profiledata[0].whatsapp;
            this.img = this.bs.profiledata[0].img;
        }, 2000);

        setTimeout(() => {
            this.bs.trayectosload(this.zona);
            this.bs.tablonload(this.zona);
            this.rutas(this.zona);
            this.bs.trayectosrutine(this.zona);
            this.bs.trayectosweek(this.zona);
            event.target.complete();
        }, 3000);
        setTimeout(() => {
            if ( this.bs.trayectos.length === 0 ) {
                this.zona = '28013';
                this.bs.trayectosload('28013');
                this.bs.tablonload('28013');
                this.rutas('28013');
            }
        }, 4500);

    }


    iniciar() {
        setTimeout(() => {
            this.bs.profileload(this.uid);
        }, 1000);

        setTimeout(() => {
            this.nombre = this.bs.profiledata[0].nombre;
            this.num = this.bs.profiledata[0].whatsapp;
            this.zona = this.bs.profiledata[0].ubication;
            this.img = this.bs.profiledata[0].img;
        }, 2000);

        setTimeout(() => {
            this.bs.trayectosload(this.zona);
            this.bs.tablonload(this.zona);
            this.rutas(this.zona);
            this.bs.trayectosrutine(this.zona);
            this.bs.trayectosweek(this.zona);
        }, 3000);

        setTimeout(() => {
            if ( this.bs.trayectos.length === 0 ) {
                this.zona = '28013';
                this.bs.trayectosload('28013');
                this.bs.tablonload('28013');
                this.rutas('28013');
            }
        }, 4500);
    }


      // Segment


      segmentChanged( event) {

        const valuesegment = event.detail.value;

        console.log(valuesegment);

      }

}

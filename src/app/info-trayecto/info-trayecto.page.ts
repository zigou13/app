import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
declare var google;



import { mapstyle } from '../../assets/maps/mapstyle';


@Component({
  selector: 'app-info-trayecto',
  templateUrl: './info-trayecto.page.html',
  styleUrls: ['./info-trayecto.page.scss'],
})
export class InfoTrayectoPage implements OnInit {

  id: string;
  zona: string;
  uid: any;
  trayectodata = [];


  estilo = [] ;


  key = 'AIzaSyATy7pX219NlBc9Sac6Biz0JgWR-cTB2f8';
  flightPath: any;
  map: any;
  marker: any;
  directionsDisplay: any;

  lat: number;
  lng: number;

  hr = (new Date()).getHours();


  directionsService = new google.maps.DirectionsService();

  constructor(public router: Router, public active: ActivatedRoute, private http: HttpClient,
    private geolocation: Geolocation, private aut: AngularFireAuth) {


    this.id = this.active.snapshot.paramMap.get('id');
  }

  ngOnInit() {

    this.logueado();
    // this.posicion();
    this.trayectoload(this.id);
    this.checkday();

    setTimeout(() => {
      this.rutas();
    }, 2000);
  }

  async checkday() {
    console.log(this.hr);
    if ( this.hr >= 21 || this.hr <= 7 ) {
        // console.log('Es de noche');
        this.estilo = mapstyle;
    } else {
        console.log('Es de dia');
        this.estilo = [];
    }
}

  logueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            this.uid = user.uid;
          } else {
            this.router.navigate([`/login`]);
          }
        }
      );
  }

  posicion() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      console.log('tus cordenadas', this.lng, this.lat);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  return() {
    this.router.navigate(['home']);
  }

  gotoprofile(id: string) {
    this.router.navigate([`/profile/${id}`]);
  }


  rutas() {
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.map = new google.maps.Map(document.getElementById('map2'), {
      zoom: 11,
      center: { lat: this.lat, lng: this.lng },
      mapTypeId: 'terrain',
      styles: this.estilo
    });
    this.directionsDisplay.setMap(this.map);

    this.http.get(`http://uicar.openode.io/trayectos/${this.id}`).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.directionsService.route({
          origin: data[i].inicio,
          destination: data[i].destino,
          travelMode: 'DRIVING'
        }, (response, status) => {
          if (status === 'OK') {
            this.directionsDisplay.setDirections(response);
            this.directionsDisplay = new google.maps.DirectionsRenderer({
              suppressBicyclingLayer: false,
              suppressMarkers: true
            });
            this.directionsDisplay.setMap(this.map);
            // this.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
    });
  }

  async trayectoload(id: string) {

    await this.http.get(`http://uicar.openode.io/trayectos/` + id).subscribe((data: any) => {
      this.trayectodata = data;
    });
  }

}

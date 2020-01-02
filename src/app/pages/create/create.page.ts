import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ServicesService } from 'src/app/services/services.service';


declare var google;



@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit, AfterViewInit {

  @ViewChild('mapElement') mapNativeElement: ElementRef;
  @ViewChild('autoCompleteInput') inputNativeElement: ElementRef;
  @ViewChild('autoCompleteInput2') inputNativeElement2: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;
  currentLocation: any = {
    lat: 0,
    lng: 0
  };
  lat: any;
  lng: any;

  num = 0;
  ubic: string;

  uid: string;

  errore: string;
  lugar1: string;
  lugar2: string;

  seats: number;
  car: any;

  information: string;

  start: string;
  destine: string;

  footer2 = false;

  rutine = false;

  band = true;

  hour: any = '9:00';

  ridedate: any = '';


  public form = [
    { val: 'Rutine', isChecked: false },
  ];


  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private geolocation: Geolocation,
    public loadingController: LoadingController,
    private aut: AngularFireAuth,
    public service: ServicesService) {

    const valor = localStorage.getItem('direccion');
    this.createDirectionForm(valor);
  }

  ngOnInit() {
    this.obtenerUbicacion();
    this.logueado();

  }
  ngAfterViewInit(): void {
    this.initMap();

  }

  createDirectionForm(ubic) {
    console.log(ubic);
    this.directionForm = this.fb.group({
      source: [ubic, Validators.required],
      destination: ['', Validators.required]
    });
  }

  logueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            this.uid = user.uid;
            this.getProfile(this.uid);
          }
        },
        () => {
          // this.router.navigateByUrl('/login');
        }
      );
  }

  async getProfile(id) {
    await this.service.getProfile(id).subscribe((data: any) => {
      console.log(data[0].payload.doc.data().car);
      // this.ubic = data[0].payload.doc.data().adress;
      this.car = data[0].payload.doc.data().car ;
     // this.createDirectionForm(this.ubic);
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

  select() {
    this.band = true;
    this.footer2 = true;
    const valor = localStorage.getItem('direccion');
    this.createDirectionForm(valor);
    this.obtenerUbicacion();
  }

  moveFocus(nextElement) {
    nextElement.setFocus();
  }




  initMap() {
    const input = <HTMLInputElement>document.getElementById('pac-input-create');
    const input2 = <HTMLInputElement>document.getElementById('pac-input-create2');

    this.lugar1 = input.value;
    this.lugar2 = input2.value;

    const autocomplete = new google.maps.places.Autocomplete(input);
    const autocomplete2 = new google.maps.places.Autocomplete(input2);

    autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']);
    autocomplete2.setFields(
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
        localStorage.setItem('cod1', place.address_components[place.address_components.length - 1].long_name);
      } else {
        input.value = '';
        this.error('error');
      }
    });

    autocomplete2.addListener('place_changed', () => {
      infowindow.close();
      const place = autocomplete2.getPlace();

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

      // console.log(place);
      if (place.address_components[place.address_components.length - 1].types[0] === 'postal_code') {
        // console.log('tiene codigo postal');
        localStorage.setItem('ubic2', input2.value);
        infowindowContent3.children['place-ub2'].textContent = input2.value;
        infowindowContent3.children['place-code2'].textContent =
          place.address_components[place.address_components.length - 1].long_name;
        localStorage.setItem('cod2', place.address_components[place.address_components.length - 1].long_name);
        this.calculateAndDisplayRoute();
      } else {
        input2.value = '';
        this.error('error');
      }

    });

  }

  async error(mensaje: string) {
    const alert = await this.alertCtrl.create({
      message: 'Direcction not valid please be more specific',
      buttons: ['OK']
    });
    await alert.present();
  }



  calculateAndDisplayRoute() {

    this.start = localStorage.getItem('ubic1');
    this.destine = localStorage.getItem('ubic2');
    const that = this;
    this.presentLoading('Loading route');
    this.directionsService.route({
      origin: this.start,
      destination: this.destine,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {

        that.directionsDisplay.setDirections(response);
        this.band = false;

      } else {
        this.error(status);
      }
    });
  }

  async presentLoading(message) {
    const loading = await this.loadingController.create({
      message: message,
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  create() {
    const data = {
      zone: localStorage.getItem('cod1'),
      zipcode1: localStorage.getItem('cod1'),
      zipcode2: localStorage.getItem('cod2'),
      ridedate: this.ridedate,
      uid: this.uid,
      information: this.information,
      start: this.start,
      destine: this.destine,
      rutine: this.rutine,
      hour: this.hour,
      seats: this.seats,
      car: this.car || 'none',
    };

    console.log(data);
    // alert( this.start + this.destine + localStorage.getItem('cod1') + localStorage.getItem('cod2') +
    //  this.rutine + this.hour + this.ridedate + this.uid );
    this.service.createride(data);
    this.presentLoading('Creating ride');
  }
  back() {
    this.num = 0;
    this.select();
  }


}

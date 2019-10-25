import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';


declare var google;



@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  fecha = Date.now();
  zones: any;
  inicio2: string;
  destino2: string;
  hour = 200;
  fecharide = 1563556794360;
  rutina = false;
  asientos: string;
  vehiculo = 'car';
  descripcion: string;
  uid: string;

  lugar1: string;
  lugar2: string;

  errore: string;

  input = <HTMLInputElement>document.getElementById('pac-input');
  input2 = <HTMLInputElement>document.getElementById('pac-input2');

  public form = [
    { val: 'Rutine', isChecked: false },
  ];

  horas = ['00:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00',
    '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];




  constructor(
    private http: HttpClient,
    public router: Router,
    private aut: AngularFireAuth,
    public alertController: AlertController) {

  }


  ngOnInit() {
    this.logueado();

  }

  async logueado() {
    await this.aut.authState
      .subscribe(
        user => {
          if (!user) {
            this.router.navigate(['/login']);
          } else {
            console.log('logueado');
            this.uid = user.uid;
          }
        });

    return this.uid;
  }

  moveFocus(nextElement) {
    nextElement.setFocus();
  }


  async error(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK']
    });
  }


  async initMap(errore: string) {
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

    autocomplete.addListener('place_changed', function () {
      infowindow.close();
      const place = autocomplete.getPlace();



      if (!place.geometry) {
        window.alert(errore);
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


      console.log(place);

      if (place.address_components[place.address_components.length - 1].types[0] === 'postal_code') {
        console.log('tiene codigo postal');
        localStorage.setItem('ubic1', input.value);
        infowindowContent2.children['place-ub1'].textContent = input.value;
        infowindowContent2.children['place-code'].textContent =
          place.address_components[place.address_components.length - 1].long_name;
        localStorage.setItem('cod1', place.address_components[place.address_components.length - 1].long_name);
      } else {
        input.value = '';
        alert(errore);
      }
    });

    autocomplete2.addListener('place_changed', function () {
      infowindow.close();
      const place = autocomplete2.getPlace();

      if (!place.geometry) {
        window.alert(errore);
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

      console.log(place);
      if (place.address_components[place.address_components.length - 1].types[0] === 'postal_code') {
        console.log('tiene codigo postal');
        localStorage.setItem('ubic2', input2.value);
        infowindowContent3.children['place-ub2'].textContent =  input2.value;
        infowindowContent3.children['place-code2'].textContent =
          place.address_components[place.address_components.length - 1].long_name;
        localStorage.setItem('cod2', place.address_components[place.address_components.length - 1].long_name);
      } else {
        input2.value = '';
        window.alert(errore);
      }
    });
  }

  guardar() {
    if (localStorage.getItem('ubic1') !== null && localStorage.getItem('ubic2') !== null) {
      const valor = {
        ubi1: localStorage.getItem('ubic1'),
        ubi2: localStorage.getItem('ubic2'),
        cod1: localStorage.getItem('cod1'),
        cod2: localStorage.getItem('cod2')
      };
      console.log(valor);
      localStorage.clear();
    } else {
      alert('los valores tienen que estar llenos');
    }

  }


}

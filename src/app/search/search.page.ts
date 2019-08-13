import { OnInit } from '@angular/core';
import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { Storage } from '@ionic/storage';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

declare var google;


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  zones: any;
  trayectos: any;
  inicio: string;
  destino: string;
  buscado = false ;
  errore: string;

  constructor(
    public router: Router,
    private aut: AngularFireAuth,
    private http: HttpClient,
    private storage: Storage,
    public alertController: AlertController,
    private translate: TranslateService) {

  }

  ngOnInit() {
    // this.zonasload();
    this.translate.get('ERROR.T1').subscribe((text: string) => {
      this.errore = text ; } );
    this.initMap(this.errore);
  }

  async zonasload() {
    await this.http.get(`http://uicar.fr.openode.io/zonas/`).subscribe((data: any) => {
      this.zones = data;
    });
  }
  gotomain() {
    this.router.navigate(['home']);
  }
  gotoinfoTrayecto(id: string) {
    this.router.navigate([`/info-trayecto/${id}`]);
}

  gotoall() {
    this.router.navigate([`/todos-trayectos/${localStorage.getItem('cod1')}`]);
}

  async search() {
    console.log(localStorage.getItem('cod1') , localStorage.getItem('cod2'));
    await this.http.get(`http://uicar.fr.openode.io/search/${ localStorage.getItem('cod1') }/${ localStorage.getItem('cod2') }`)
    .subscribe((data: any) => {
      this.trayectos = data;
      this.buscado = true;
      console.log(this.trayectos);
    });
  }

  async initMap(errore: string) {
    const input = <HTMLInputElement>document.getElementById('pac-input');
    const input2 = <HTMLInputElement>document.getElementById('pac-input2');

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
        // console.log('tiene codigo postal');
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
        // console.log('tiene codigo postal');
        localStorage.setItem('ubic2', input2.value);
        infowindowContent3.children['place-ub2'].textContent =  input2.value;
        infowindowContent3.children['place-code2'].textContent =
          place.address_components[place.address_components.length - 1].long_name;
        localStorage.setItem('cod2', place.address_components[place.address_components.length - 1].long_name);
      } else {
        input2.value = '';
        alert(errore);
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

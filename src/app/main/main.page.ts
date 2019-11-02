
import { Component , OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';

import { mapstyle } from '../../assets/maps/mapstyle';

import { ActionSheetController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RidesService } from '../services/rides.service';
import { ModalController } from '@ionic/angular';

import { ModalPage } from '../modal/modal.page';



declare var google;

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  item: any[] = [];
  id: string;

  map: any;
  directionsDisplay: any;

  style = mapstyle;


  lat: number;
  num: any;
  lng: number;

  rides: any[] = [];

  rideszone: any;

  zone = '94901';

  constructor(
    private aut: AngularFireAuth,
    private router: Router , public services: ServicesService,
    public actionSheetController: ActionSheetController,
    private geolocation: Geolocation ,
    private ridesservice: RidesService,
    private modalController: ModalController) {

      setTimeout(() => {
      this.rutes();
      }, 3000);
    }

  directionsService = new google.maps.DirectionsService();

  ngOnInit() {
    this.logueado();
    this.posicion();
    this.getrides();
  }

  gotoride(id) {
    this.router.navigateByUrl(`ride/${id}`);
  }

  getrides() {
     this.ridesservice.functiongetRides(this.zone).subscribe((data: any) => {
      console.log(data);
      this.rides = data;
    });
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




  logueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            console.log('loged');
            this.id = user.uid;
            console.log(this.id);
            this.getProfile(this.id);
          } else {
            this.router.navigateByUrl('/login');
          }
        },
        () => {
          this.router.navigateByUrl('/login');
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
      if (data.length === 0) {
        console.log('profile empty');
        this.router.navigateByUrl(`edit-profile`);
      } else {
        console.log('Profile not empty');
        console.log(data);
        this.item = data;
        console.log(data[0].payload.doc.data().zone);
        if ( data[0].payload.doc.data().zone === null ) {
          console.log('No zone');
        } else  {
          this.zone = data[0].payload.doc.data().zone;
        }
      }
    });
  }

  profile() {
    this.router.navigateByUrl(`profile`);
  }

  async presentModal() {
    const modal2 = await this.modalController.create({
        component: ModalPage,
    });
    return await modal2.present();
}

  // Maps
  async rutes() {

     this.ridesservice.functiongetRides(this.zone).subscribe((data: any) => {
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
                        suppressMarkers: true,
                        // polylineOptions: {
                        //   strokeColor: 'black'
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



emptymap() {
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        mapTypeId: 'roadmap',
        styles: this.style
    });
}

attachInstructionText(marker) {
    const self = this;
    console.log(marker.id);
    const id = marker.id;
    console.log(self.id);

    google.maps.event.addListener(marker, 'click', function () {
      console.log(marker.id);
        this.router.navigateByUrl( '/ride' , marker.id),
        console.log(marker.id);
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

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesService } from 'src/app/services/services.service';
import { ChatService } from 'src/app/services/chat.service';
import { AngularFireAuth } from '@angular/fire/auth';

declare var google;

@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage implements OnInit {

  id: string;
  map2: any;
  directionsDisplay: any;
  ride: any;
  item: any;

  uid: string;

  constructor(private rout: Router, private services: ServicesService
    , public active: ActivatedRoute , public chatservice: ChatService , private auth: AngularFireAuth) {
    this.id = this.active.snapshot.paramMap.get('id');
  }


  directionsService = new google.maps.DirectionsService();


  ngOnInit() {
    this.logueado();
    this.getride();
  }

  async logueado() {
    await this.auth.authState
      .subscribe(
        user => {
          if (user) {
            console.log('loged');
            this.uid = user.uid;
          } else {
            // this.router.navigateByUrl('/login');
          }
        },
        () => {
          // this.router.navigateByUrl('/login');
        }
      );
  }
  gotoprofile(uid) {
    this.rout.navigateByUrl(`view/${uid}`);
  }

  async getProfile(id) {
    await this.services.getProfile(id).subscribe((data => {
      console.log(data);
      this.item = data;
    }));
  }

  async getride() {
    await this.services.getride(this.id).subscribe((data => {
      // this.ride = data;
      console.log(data.length);
      if (data.length === 0) {
        console.log('no tiene ');
      } else {
        this.ride = data;
        this.getProfile(this.ride[0].payload.doc.data().uid);
        this.rutes(this.ride[0].payload.doc.data().start, this.ride[0].payload.doc.data().destine);
      }
      // console.log(this.ride[0].payload.doc.data().start);
    }));
  }
  async rutes(start, destine) {

    this.directionsService.route({
      origin: start,
      destination: destine,
      travelMode: 'DRIVING'
    }, (response, status) => {
      const waypoint_markers = [];
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);

        this.directionsDisplay = new google.maps.DirectionsRenderer({
          suppressBicyclingLayer: true,
          // suppressMarkers: true,
          polylineOptions: {
            strokeColor: 'red'
          }
        });
        //  const myRoute = response.routes[0].legs[0];
        //  const marker = new google.maps.Marker({
        //      position: myRoute.steps[0].start_point,
        //      map: this.map2,
        //      id: this.ride[0].payload.doc.data().id,
        //      zIndex: 999999,
        //  });
        //  this.attachInstructionText(marker);
        //  const marker1 = new google.maps.Marker({
        //      position: myRoute.steps[myRoute.steps.length - 1].end_point,
        //      map: this.map2,
        //      id: this.ride[0].payload.doc.data().id,
        //      zIndex: 999999,
        //  });
        //  this.attachInstructionText(marker1);
        this.directionsDisplay.setMap(this.map2);
      } else {
        // window.alert('Directions request failed due to ' + status);
      }
    });
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.map2 = new google.maps.Map(document.getElementById('map3'), {
      zoom: 13,
      mapTypeId: 'roadmap',
    });
    this.directionsDisplay.setMap(this.map2);

  }



  emptymap() {
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.map2 = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      mapTypeId: 'terrain',
    });
  }

  attachInstructionText(marker) {
    const self = this;
    google.maps.event.addListener(marker, 'click', function () {
      // this.router.navigateByUrl( '/ride' , this.id),
      console.log(this.id);
    });
  }
}

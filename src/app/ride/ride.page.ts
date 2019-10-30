import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private rout: Router, private services: ServicesService
    , public active: ActivatedRoute) {
    this.id = this.active.snapshot.paramMap.get('id');

    setTimeout(() => {
    this.getride();
    }, 2000);
   }


   directionsService = new google.maps.DirectionsService();


  ngOnInit() {
  }

  async getride() {
    await this.services.getride(this.id).subscribe((data => {
        this.ride = data;
    }));
  }

  async map() {
        this.map = new google.maps.Map(document.getElementById('map2'));
        this.directionsService.route({
               origin: this.ride[0][0].payload.doc.data().inicio,
               destination: this.ride[0][0].payload.doc.data().destino,
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
                   const myRoute = response.routes[0].legs[0];
                  //  const marker = new google.maps.Marker({
                  //      position: myRoute.steps[0].start_point,
                  //      map: this.map,
                  //      id: data[i][0].payload.doc.data().id,
                  //      zIndex: 999999,
                  //  });
                  //  this.attachInstructionText(marker);
                  //  const marker1 = new google.maps.Marker({
                  //      position: myRoute.steps[myRoute.steps.length - 1].end_point,
                  //      map: this.map,
                  //      id: data[i][0].payload.doc.data().id,
                  //      zIndex: 999999,
                  //  });
                  //  this.attachInstructionText(marker1);
                   this.directionsDisplay.setMap(this.map);
               } else {
                   // window.alert('Directions request failed due to ' + status);
               }
           });
       this.directionsDisplay = new google.maps.DirectionsRenderer();

       }

}

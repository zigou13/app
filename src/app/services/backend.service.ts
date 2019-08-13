import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { AngularFireAuth } from '@angular/fire/auth';


import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from '@ionic-native/background-geolocation/ngx';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient,
              public router: Router,
              private backgroundGeolocation: BackgroundGeolocation,
              private http2: HTTP,
              private aut: AngularFireAuth) { }

  img = '/assets/icons/user.svg';

  gps_update_link = 'uicar.fr.openode.io/data/';

  links: any;
  profiledata = [];
  weather: any;
  uid: string;
  lloviendo: boolean;
  tablondata = [];
  trayectos = [];
  trayectosrutinedata = [];
  trayectosweekdata = [];


  // Global functions
    display() {
      console.log('no sacriface');

    }

  goto(url: any ) {

    this.router.navigate([`/${url}`]);
  }

  goto2(url: string, parm: string) {
    this.router.navigate([`/${url}/${parm}`]);
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






  // Http


  async linksload() {

    await this.http.get(`http://uicar.fr.openode.io/links/`).subscribe((data: any) => {
      this.links = data;
      console.log(data);
    });
  }

  async profileload(id: string) {
    await this.http.get(`http://uicar.fr.openode.io/users/${id}/info`).subscribe((data: any) => {
         console.log(data);
        this.profiledata = data;
    });
}
async getweather() {
await this.http
.get(`http://api.openweathermap.org/data/2.5/weather?q=Madrid&appid=18c90d97bb8bcdd19f4321b7926b0e6f`).subscribe((data: any) => {
      console.log(data);
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

    await this.http.get(`http://uicar.fr.openode.io/tablon/${id}/100`).subscribe((data: any) => {
      console.log(data);

        this.tablondata = data;
    });
}

async trayectosload(id: string) {
    await this.http.get(`http://uicar.fr.openode.io/zonas/${id}/4`).subscribe((data: any) => {
        console.log(data);
        this.trayectos = data;
    });
}

async trayectosrutine(id: string) {
  await this.http.get(`http://uicar.fr.openode.io/zonas/${id}/4/rutine`).subscribe((data: any) => {
      console.log(data);
      console.log(id);
      this.trayectosrutinedata = data;
  });
}
async trayectosweek(id: string) {
  await this.http.get(`http://uicar.fr.openode.io/zonas/${id}/4/week`).subscribe((data: any) => {
      console.log(data);
      this.trayectosweekdata = data;
  });
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





}

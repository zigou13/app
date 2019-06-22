import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {

  slides: any;
  uid: string;
  lenguage: string;

  constructor( private http: HttpClient , private ruta: Router , private storage: Storage , private aut: AngularFireAuth) { }

  ngOnInit() {
    this.storage.get('SELECTED_LANGUAGE').then(val => {
      console.log(val);
      if (val === 'es') {
        this.lenguage = 'es';
      } else {
        this.lenguage = 'en';
      }
    });
    setTimeout(() => {
      this.slidesload(this.lenguage);
      this.logueado();
    }, 1200);
  }

  async slidesload(len: string) {
    await this.http.get(`http://uicar.openode.io/slides/${len}`).subscribe((data: any) => {
        console.log(data);
        this.slides  = data;
    });
}
  saltar() {
    this.ruta.navigate([`/edituser/${ this.uid }`]);
  }

  async logueado() {
    await this.aut.authState
        .subscribe(
            user => {
                if (!user) {
                    this.ruta.navigate(['/login']);
                } else {
                    console.log('logueado');
                    this.uid = user.uid;
                }
            });

    return this.uid;
}


}

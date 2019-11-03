import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-fill',
  templateUrl: './fill.page.html',
  styleUrls: ['./fill.page.scss'],
})
export class FillPage implements OnInit {

  num = 0;
  mode: string;
  car: string;
  high = null;
  weight = null ;
  uid: string;

  constructor(public service: ServicesService , private aut: AngularFireAuth) { }

  ngOnInit() {
    this.logueado();
  }



  logueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            this.uid = user.uid;
          }
        },
        () => {
          // this.router.navigateByUrl('/login');
        }
      );
  }

  setmode(mode: string) {
    this.mode = mode;
    this.num = 1;
    // if (this.mode = 'rider' ) {
    //   this.setcar('none');
    //   this.service.userdata(this.car , this.mode, this.uid);
    // }
  }
  setcar(car: string) {
    this.car = car;
    this.num = 2;
  }


  moveFocus(nextElement) {
    nextElement.setFocus();
  }

}

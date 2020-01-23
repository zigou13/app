import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ServicesService } from 'src/app/services/services.service';
import { GetService } from '../../services/get.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  uid: any;
  item: any;
  anuncios: any;
  empty: Boolean;

  rides: any;

  stars: number;
  userrides:any;
  userrriesN:number;

  numbers: any;

  constructor(private rout: Router, private services: ServicesService, private aut: AngularFireAuth , private bs: GetService) {

  }

  ngOnInit() {
    this.getLogueado();
    this.getrides();
  }

  getLogueado() {
    this.aut.authState
    .subscribe(
      user => {
        if (user) {
          console.log('logeado');
          this.uid = user.uid;
          console.log(this.uid);
          this.getProfile(this.uid);
          this.getrides();
        } else {
          this.rout.navigateByUrl('/login');
        }
      },
      () => {
        this.rout.navigateByUrl('/login');
      }
      );
  }


  async getProfile(id) {
    await this.services.getProfile(id).subscribe((data => {
      console.log(data);
      if (data.length === 0) {
        this.empty = false;
        console.log('empty');
      } else {
        this.empty = true;
        this.item = data;
        this.stars = data[0].payload.doc.data().stars;
        // this.numbers = Array(5).fill().map((x, i) => i); // [0,1,2,3,4]
        // this.numbers = Array(5).fill(4); // [4,4,4,4,4]

      }
    }));
  }



  async signOut() {
    const res = await this.aut.auth.signOut();
    console.log(res);
    this.rout.navigateByUrl('/login');
  }

  async getrides() {
    // this.bs.ridesuid(this.uid);

    await this.bs.ridesuid(this.uid).subscribe((data:any)=>{
      this.userrides=data;
      this.userrriesN=data.length;
    });
  }
  gotoride(id) {
    this.rout.navigateByUrl(`ride/${id}`);
  }



}

import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ride',
  templateUrl: './ride.page.html',
  styleUrls: ['./ride.page.scss'],
})
export class RidePage implements OnInit {

  id: string;

  constructor(private rout: Router, private services: ServicesService
    , public active: ActivatedRoute) {
    this.id = this.active.snapshot.paramMap.get('id');
   }

  ride: any;

  ngOnInit() {
  }

}

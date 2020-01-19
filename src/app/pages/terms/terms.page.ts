import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  text:string;
  constructor(public service: ServicesService) { }

  ngOnInit() {
  }
  send(text) {
    this.service.review(text);
  }

}

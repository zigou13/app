import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetService {
  rideszone: any;
  userrides: any;
  viewuserrides: any;

  constructor(private http: HttpClient) { }

  ridesload(id: string) {
    return this.http.get(`http://uicar.openode.io/zones/${id}/10`);
  }

  async ridesuid(uid: string) {
    await this.http.get(`http://uicar.openode.io/rides/${uid}/`).subscribe((data: any) => {
      console.log(data);
      this.userrides = data;
    });
  }


  async viewridesuid(uid: string) {
    await this.http.get(`http://uicar.openode.io/rides/${uid}/`).subscribe((data: any) => {
      console.log(data);
      this.viewuserrides = data;
    });
  }
}

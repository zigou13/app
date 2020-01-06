import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class NotificationsService {

	url:string='https://fcm.googleapis.com/fcm/send';

	constructor(private fcm: FCM, private http: HttpClient) { }



	mandarNot(token:string, mensaje:any){
		let not={
			"notification":{
				"title":"Mensaje Nuevo",
				"body":mensaje
			},
			"to":token
		};

		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization':'key=AAAAbF0Mla0:APA91bHz21LMf0C5ydVs2by1EKlq_fAAzGHlgIDSgyxW-rQg4yXxAUzhLFBcFFPE8W0bJCrswwR247Z5ETBa9JoLzct00UCAyUkhg5N2koPGljDwHQQ9XEnXp-J0JtemMRDPdLIaFbZO'
		});

		return this.http.post(this.url,not,{headers});
	}
}

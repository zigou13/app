import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    public aut: AngularFireAuth,
    private rout: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {



    if (state.url === 'login') {
      this.aut.authState
        .subscribe(
          user => {
            if (user) {
              // this.rout.navigateByUrl('');
            } else {
              this.rout.navigateByUrl('/register');
            }
          },
          () => {
            // this.rout.navigateByUrl('/login');
          }
        );
    }

    return true;
  }
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', loadChildren: './pages/main/main.module#MainPageModule' , canActivate: [AuthGuard]},
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate: [LoginGuard]},
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
  { path: 'edit-profile', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule', canActivate: [AuthGuard] },
  { path: 'main', loadChildren: './pages/main/main.module#MainPageModule' , canActivate: [AuthGuard]},
  { path: 'fill', loadChildren: './pages/fill/fill.module#FillPageModule' , canActivate: [AuthGuard]},
  { path: 'ride/:id', loadChildren: './pages/ride/ride.module#RidePageModule' , canActivate: [AuthGuard]},
  { path: 'view/:uid', loadChildren: './pages/view/view.module#ViewPageModule' , canActivate: [AuthGuard]},
  { path: 'chats', loadChildren: './pages/chats/chats.module#ChatsPageModule' , canActivate: [AuthGuard]},
  { path: 'chat/:id', loadChildren: './pages/chat/chat.module#ChatPageModule' , canActivate: [AuthGuard]},
  { path: 'terms', loadChildren: './pages/terms/terms.module#TermsPageModule' , canActivate: [AuthGuard]},
  { path: 'modal', loadChildren: './pages/modal/modal.module#ModalPageModule' , canActivate: [AuthGuard]},
  { path: 'create', loadChildren: './pages/create/create.module#CreatePageModule' , canActivate: [AuthGuard]},
  { path: 'location', loadChildren: './pages/location/location.module#LocationPageModule' , canActivate: [AuthGuard]},
  { path: 'event', loadChildren: './pages/event/event.module#EventPageModule' , canActivate: [AuthGuard]},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

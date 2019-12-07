import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', loadChildren: './pages/main/main.module#MainPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate: [LoginGuard] },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'edit-profile/:new?', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'main', loadChildren: './pages/main/main.module#MainPageModule', canActivate: [AuthGuard] },
  { path: 'fill', loadChildren: './pages/fill/fill.module#FillPageModule' },
  { path: 'ride/:id', loadChildren: './pages/ride/ride.module#RidePageModule' },
  { path: 'view/:uid', loadChildren: './pages/view/view.module#ViewPageModule' },
  { path: 'chats', loadChildren: './pages/chats/chats.module#ChatsPageModule' },
  { path: 'chat/:id', loadChildren: './pages/chat/chat.module#ChatPageModule' },
  { path: 'terms', loadChildren: './pages/terms/terms.module#TermsPageModule' },
  { path: 'modal', loadChildren: './pages/modal/modal.module#ModalPageModule' },
  { path: 'create', loadChildren: './pages/create/create.module#CreatePageModule' },
  { path: 'location', loadChildren: './pages/location/location.module#LocationPageModule' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

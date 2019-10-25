import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './main/main.module#MainPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'edit-profile', loadChildren: './edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'main', loadChildren: './main/main.module#MainPageModule' },
  { path: 'fill', loadChildren: './fill/fill.module#FillPageModule' },
  { path: 'ride/:id', loadChildren: './ride/ride.module#RidePageModule' },
  { path: 'view/:uid', loadChildren: './view/view.module#ViewPageModule' },
  { path: 'chats', loadChildren: './chats/chats.module#ChatsPageModule' },
  { path: 'chat/:id', loadChildren: './chat/chat.module#ChatPageModule' },
  { path: 'terms', loadChildren: './terms/terms.module#TermsPageModule' },
  { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' },
  { path: 'create', loadChildren: './create/create.module#CreatePageModule' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

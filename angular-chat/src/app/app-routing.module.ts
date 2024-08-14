import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { RegisterRequestComponent } from './components/register-request/register-request.component';
import { LoginRequestComponent } from './components/login-request/login-request.component';
import { RootComponent } from './navbar/root/root.component';
import { NavatbsComponent } from './navatbs/navatbs.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { ChatComponent } from './components/chat/chat.component';
import { WaitingComponent } from './components/waiting/waiting.component';
import { DisplayFriendRequestComponent } from './components/display-friend-request/display-friend-request.component';
import { AdminChatComponent } from './admin-chat/admin-chat.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'waiting-room', component: WaitingComponent },

  // { path: 'friend-request', component: FriendRequestComponent },
  // { path: 'register-request', component: RegisterRequestComponent },
  { path: 'nav', component: NavbarComponent },


  {
    path: "navbar", component: RootComponent,
    children: [
      { path: 'friend-request', component: FriendRequestComponent },
      { path: 'register-request', component: RegisterRequestComponent },
      { path: 'login-request', component: LoginRequestComponent },
      { path: 'profile-edit', component: ProfileEditComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'fetch-friends', component: DisplayFriendRequestComponent },
      // { path: 'view-chats', component: AdminChatComponent },
      { path: 'view-chats', component: AdminChatComponent },



      






    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

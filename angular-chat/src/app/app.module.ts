import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio'
import {MatSelectModule} from '@angular/material/select'
import {MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';

import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FriendRequestComponent } from './components/friend-request/friend-request.component';
import { RegisterRequestComponent } from './components/register-request/register-request.component';
import { LoginRequestComponent } from './components/login-request/login-request.component';
import { NavatbsComponent } from './navatbs/navatbs.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarModule } from './navbar/navbar.module';
import { DemoComponent } from './components/demo/demo.component';
import { ChatComponent } from './components/chat/chat.component';
import { HttpClientModule } from '@angular/common/http';
import { WaitingComponent } from './components/waiting/waiting.component';
import { DisplayFriendRequestComponent } from './components/display-friend-request/display-friend-request.component';
import { AdminChatComponent } from './admin-chat/admin-chat.component';



@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ChatComponent,
    WaitingComponent,
    AdminChatComponent,
   
   
    // NavatbsComponent,
    // SidenavListComponent,
    // ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule,
    MatIconModule,
    MatProgressBarModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    NavbarModule,
    HttpClientModule
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

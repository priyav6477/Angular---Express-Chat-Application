import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootComponent } from './root/root.component';
import { SidenavListComponent } from '../sidenav-list/sidenav-list.component';
import { NavatbsComponent } from '../navatbs/navatbs.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FriendRequestComponent } from '../components/friend-request/friend-request.component';
import { RegisterRequestComponent } from '../components/register-request/register-request.component';
import { LoginRequestComponent } from '../components/login-request/login-request.component';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

import { AppRoutingModule } from '../app-routing.module';
import { ProfileEditComponent } from '../components/profile-edit/profile-edit.component';
import { DemoComponent } from '../components/demo/demo.component';
import { HttpClientModule } from '@angular/common/http';

import { DisplayFriendRequestComponent } from '../components/display-friend-request/display-friend-request.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    RootComponent,
    SidenavListComponent,
    NavatbsComponent,
    ToolbarComponent, 
    NavbarComponent,
    FriendRequestComponent,
    RegisterRequestComponent,
    LoginRequestComponent,
    ProfileEditComponent,
    DemoComponent,
  DisplayFriendRequestComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
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
    RouterModule, 
    AppRoutingModule,
    MatTabsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatTableModule// Import the RouterModule if you haven't already
  ],
  exports: [RootComponent    
   ],
  bootstrap: [RootComponent],
})
export class NavbarModule { }

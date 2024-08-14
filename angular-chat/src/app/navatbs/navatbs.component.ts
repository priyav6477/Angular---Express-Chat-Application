import { Component } from '@angular/core';

@Component({
  selector: 'app-navatbs',
  templateUrl: './navatbs.component.html',
  styleUrls: ['./navatbs.component.css']
})
export class NavatbsComponent {
  userType!: string;

  constructor() {
    let user = sessionStorage.getItem('userDetails');
    if (user)
      var userObject = JSON.parse(user);
    this.userType = userObject.role
  }
}

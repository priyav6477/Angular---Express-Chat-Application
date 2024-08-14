import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {
  constructor(private http: HttpClient) {}

  registerUser(userData: any) {
    return this.http.post<any>('http://localhost:3000/register', userData);
}
}

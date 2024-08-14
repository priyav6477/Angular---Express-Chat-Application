import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { SnackbarServiceService } from 'src/app/service/snackbar-service.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  form!: FormGroup;

  approvalStatus!: string;
  intervalSubscription!: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackbarMessage: SnackbarServiceService) {
    sessionStorage.clear();
  }


  ngOnInit() {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.form.valid) {
      const req = {
        email: this.form.controls['userName'].value,
        password: this.form.controls['password'].value,
      }
      this.authService.login(req).subscribe(data => {
        console.log(data)
        if (data.statusCode == 200 && data.message == "Admin login successful") {



          sessionStorage.setItem('userDetails', JSON.stringify(data.result))
          this.router.navigateByUrl('/navbar/register-request')

        } else if (data.statusCode == 200) {
          console.log("user")
          sessionStorage.setItem('userId', req.email);

          this.router.navigateByUrl('waiting-room')
        } else {
          this.snackbarMessage.snackbarDisplay(data.message);

        }

      })
    }
  }



}

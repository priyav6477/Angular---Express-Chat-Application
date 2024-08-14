import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MustMatch } from './validation';
import { ChatService } from 'src/app/service/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  isLinear = true;
  formNameGroup !: FormGroup;
  formPasswordGroup !: FormGroup;
  formEmailGroup !: FormGroup;
  formPhoneGroup !: FormGroup;
  constructor(private fb: FormBuilder,private chatService:ChatService,private router: Router
  ) { this.createForm(); }
  createForm() {
    this.formNameGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.formPasswordGroup = this.fb.group({
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required]
    });
    this.formEmailGroup = this.fb.group({
      photo: ['', Validators.required]
    });
    this.formPhoneGroup = this.fb.group({
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required]
    });
  }

  fileToUpload: any;
  imageUrl: any;
  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.fileToUpload = (target.files as FileList)[0];
    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 20;

  onNext() {
    this.value = this.value + 20;
  }

  onBack() {
    this.value = this.value - 20;
  }


  onSubmit() {
    if (this.formNameGroup.valid && this.formPasswordGroup.valid && this.formEmailGroup.valid && this.formPhoneGroup.valid) {
      const req = {
        stepOneData: {
          firstName: this.formNameGroup.controls['firstName'].value,
          lastName: this.formNameGroup.controls['lastName'].value,
          email: this.formNameGroup.controls['email'].value,
          mobileNumber: this.formNameGroup.controls['mobile'].value,
          password: this.formNameGroup.controls['password'].value,
          confirmPassword: this.formNameGroup.controls['confirmPassword'].value,
        },
        stepTwoData: {
          dateOfBirth: this.formPasswordGroup.controls['dateOfBirth'].value,
          gender: this.formPasswordGroup.controls['gender'].value
        },
        stepThreeData: {
          profile: this.imageUrl
        },
        stepFourData: {
          companyName: this.formPhoneGroup.controls['companyName'].value,
          companyAddress: this.formPhoneGroup.controls['companyAddress'].value
        }
      };

      this.chatService.registerUser(req).subscribe(
        data => {
          if(data.statusCode ==200){
            console.log('Response from server:', data);
            this.router.navigate(['/sign-in']);
          }

       },
        (error) => {
          console.error('Error sending message:', error);
          // Handle error here
        }
      );
  }




  }}

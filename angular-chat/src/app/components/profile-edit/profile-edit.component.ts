import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/service/chat.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent {

  public addShopFormGroup!: FormGroup;

  constructor(private chatService: ChatService) { }
  userId = sessionStorage.getItem('userId') || "";

  ngOnInit() {
    // this.onSubmit()
    this.addShopFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      dateofBirth: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      companyAddress: new FormControl('', [Validators.required]),
      profile: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    const req = {
      firstName: this.addShopFormGroup.controls['firstName'].value,
      lastName: this.addShopFormGroup.controls['lastName'].value,
      mobile: this.addShopFormGroup.controls['mobile'].value,
      dateofBirth: this.addShopFormGroup.controls['dateofBirth'].value,
      gender: this.addShopFormGroup.controls['gender'].value,
      companyName: this.addShopFormGroup.controls['companyName'].value,
      companyAddress: this.addShopFormGroup.controls['companyAddress'].value,
      profile: this.imageUrl
    }
    console.log(req)

    console.log(this.addShopFormGroup.valid)

    if (this.addShopFormGroup.valid) {

      this.chatService.updatreProfile(this.userId, req).subscribe(data => {
        console.log(data);
        location.reload();
      })
    }
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

  public checkError = (controlName: string, errorName: string) => {
    return this.addShopFormGroup.controls[controlName].hasError(errorName);
  }
}

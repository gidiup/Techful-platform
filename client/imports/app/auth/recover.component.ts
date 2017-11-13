import {Component, OnInit, NgZone} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Accounts} from 'meteor/accounts-base';
// import {MatSnackBar} from '@angular/material';
import template from './recover.component.html';
@Component({
  selector: 'recover',
  template
})
export class RecoverComponent implements OnInit{
  recoverForm: FormGroup;
  error: string;
  constructor(private router:Router,private zone:NgZone,private formBuilder:FormBuilder,public snackBar:FormBuilder){}
  ngOnInit() {
    this.recoverForm=this.formBuilder.group({
      email:['',Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]
    });
    this.error='';
  }
  recover(){
    if(this.recoverForm.valid){
      Accounts.forgotPassword({
        email: this.recoverForm.value.email
      }, (err) => {
        if (err) {
          this.zone.run(() => {
            this.error = err;
          });
        } else {
          this.router.navigate(['/']);
        }
      });
    }else{
      this.recoverForm.reset();
      // this.snackBar.open("Invalid email!","Try again.");
    }
  }
}
import {Component, OnInit, NgZone} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Accounts} from 'meteor/accounts-base';
import {MdSnackBar} from '@angular/material';
import template from './signup.component.html';
@Component({
  selector: 'signup',
  template
})
export class SignupComponent implements OnInit{
  signupForm: FormGroup;
  error: string;
  constructor(private router:Router,private zone:NgZone,private formBuilder:FormBuilder,public snackBar:MdSnackBar){}
  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['',Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')],
      password: ['', Validators.required]
    });
    this.error = '';
  }
  signup(){
    if(this.signupForm.valid){
      Accounts.createUser({
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      },(err)=>{
        if(err){
          this.zone.run(()=>{
            this.error=err;
          });
        }else{
          this.router.navigate(['/']);
        }
      });
    }else{
      this.signupForm.reset();
      this.snackBar.open("Empty password or invalid email.","Try again.");
    }
  }
}
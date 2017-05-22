import {Component,OnInit,NgZone} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Meteor} from 'meteor/meteor';
import {MdSnackBar} from '@angular/material';
import template from './login.component.html';
@Component({
  selector: 'login',
  template
})
export class LoginComponent implements OnInit{
  loginForm:FormGroup;
  error: string;
  constructor(private router:Router,private zone:NgZone,private formBuilder:FormBuilder,public snackBar:MdSnackBar){}
  ngOnInit(){
    this.loginForm = this.formBuilder.group({
      email:['',Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')],
      password:['',Validators.required]
    });
    this.error='';
  }
  login(){
    if(this.loginForm.valid){
      Meteor.loginWithPassword(this.loginForm.value.email,this.loginForm.value.password,(err)=>{
        this.zone.run(()=>{
          if(err){
            this.error=err;
          }else{
            this.router.navigate(['/']);
          }
        });
      });
    }else{
      this.loginForm.reset();
      this.snackBar.open("Empty password or invalid email.","Try again!");
    }
  }
}
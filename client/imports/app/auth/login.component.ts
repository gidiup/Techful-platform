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
  phoneForm:FormGroup;
  phone:string;
  verifyForm:FormGroup;
  isStepTwo:boolean=false;
  loginForm:FormGroup;
  error: string;
  constructor(private router:Router,private zone:NgZone,private formBuilder:FormBuilder,public snackBar:MdSnackBar){}
  ngOnInit(){
    this.phoneForm=this.formBuilder.group({
      phone:['',Validators.required]
    });
    this.verifyForm=this.formBuilder.group({
      code:['',Validators.required]
    });
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
  send(){
    if (this.phoneForm.valid){
      Accounts.requestPhoneVerification(this.phoneForm.value.phone,(err)=>{
        this.zone.run(()=>{
          if(err){
            this.error=err.reason || err;
          }else{
            this.phone=this.phoneForm.value.phone;
            this.error='';
            this.isStepTwo=true;
          }
        });
      });
    }
  }
  verify(){
    if(this.verifyForm.valid){
      Accounts.verifyPhone(this.phone,this.verifyForm.value.code,(err)=>{
        this.zone.run(()=>{
          if(err){
            this.error=err.reason || err;
          }else{
            this.router.navigate(['/']);
          }
        });
      });
    }
  }
}
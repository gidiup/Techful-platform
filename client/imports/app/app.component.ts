import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MeteorObservable} from 'meteor-rxjs';
import style from './app.component.scss';
import template from './app.component.html';
import {InjectUser} from "angular2-meteor-accounts-ui";
@Component({
  selector:'app',
  template,
  styles:[style]
})
@InjectUser('user')
export class AppComponent{
  constructor(private router:Router){
    MeteorObservable.autorun().subscribe(()=>{
      if(Meteor.userId()){
        this.router.navigate(['/']);
        return;
      }else{
        this.router.navigate(['/login']);
        return;
      }
    })
  }
  facebook(){
    Meteor.loginWithFacebook({
      requestPermissions:['public_profile','email']
    },(err)=>{
      if(err){
        console.log(err);
      }else{
        console.log("facebook loged in");
      }
    });
  }
  google(){
    Meteor.loginWithGoogle({
      requestPermissions:['profile','email']
    },(err)=>{
      if(err){
        console.log(err);
      }else{
        console.log("google loged in");
      }
    });
  }
  logout(){
    Meteor.logout();
  }
}

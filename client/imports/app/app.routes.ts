import {Route,Router,CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {Meteor} from 'meteor/meteor';
import {MainComponent} from './mainComponents/main.component';
import {SignupComponent} from "./auth/signup.component";
import {RecoverComponent} from "./auth/recover.component";
import {LoginComponent} from "./auth/login.component";
@Injectable()
export class checkUser implements CanActivate{
  constructor(private router:Router){}
  canActivate():boolean{
    if(Meteor.userId()){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}
export const routes:Route[]=[
  {path:'',component:MainComponent,canActivate:[checkUser]},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:'recover',component:RecoverComponent}
];

import {Route,Router,CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {Meteor} from 'meteor/meteor';
import {MainComponent} from './mainComponents/main.component';
import {AppComponent} from './appComponents/app.component';
import {SignupComponent} from "./auth/signup.component";
import {RecoverComponent} from "./auth/recover.component";
import {LoginComponent} from "./auth/login.component";
import {LandingComponent} from "./auth/landing.component";
@Injectable()
export class checkUser implements CanActivate{
  constructor(private router:Router){}
  canActivate():boolean{
    if(Meteor.userId()){
      return true;
    }else{
      this.router.navigate(['/landing']);
      return false;
    }
  }
}
export const routes:Route[]=[
  {path:'app',component:MainComponent,canActivate:[checkUser]},
  {path:'',component:AppComponent,canActivate:[checkUser]},
  {path:'login',component:LoginComponent},
  {path:'landing',component:LandingComponent},
  {path:'signup',component:SignupComponent},
  {path:'recover',component:RecoverComponent}
];

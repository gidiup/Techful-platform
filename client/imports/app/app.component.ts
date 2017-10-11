import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MeteorObservable} from 'meteor-rxjs';
import {Subscription} from 'rxjs/Subscription';
import {MdSnackBar} from '@angular/material'
import {Customers} from '../../../both/collections/customers.collection';
import {Customer} from '../../../both/models/customer.model';
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
  customerSub:Subscription;
  customer:Customer;
  constructor(private router:Router,public snackBar:MdSnackBar){
    MeteorObservable.autorun().subscribe(()=>{
      if(Meteor.userId()){
        if(this.customerSub){
          this.customerSub.unsubscribe();
        }
        this.customerSub=MeteorObservable.subscribe('user',Meteor.userId()).subscribe(()=>{
          this.customer=Customers.findOne();
          if(this.customer){
            if(this.customer.email){
              let codeIndex=location.href.indexOf("?code=");
              if(codeIndex==-1){
                this.router.navigate(['/app']);
              }else{
                let code_=location.href.substr(codeIndex+6);
                MeteorObservable.call('uberAccessToken',code_,location.href.substr(0,codeIndex)).subscribe((response)=>{
                  if(response){
                    Customers.update(this.customer._id,{
                      $set:{
                        uberAccessToken:response[0]
                      }
                    })
                  }
                },(err)=>{
                  console.log(err);
                })
              }
            }else{
              this.router.navigate(['/']);
            }
          }else{
            this.router.navigate(['/']);
          }
        })
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
        this.snackBar.open(err.message || err,"OK")
      }else{
        this.snackBar.open("Facebook loged in","OK",{duration:9999})
      }
    })
  }
  google(){
    Meteor.loginWithGoogle({
      requestPermissions:['profile','email']
    },(err)=>{
      if(err){
        this.snackBar.open(err.message || err,"OK")
      }else{
        this.snackBar.open("Google loged in","OK",{duration:9999})
      }
    })
  }
  logout(){
    Meteor.logout()
  }
}

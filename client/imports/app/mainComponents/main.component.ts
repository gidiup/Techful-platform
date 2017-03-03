import {Component,OnInit,OnDestroy} from '@angular/core';
import {MouseEvent} from "angular2-google-maps/core";
import {Subscription} from 'rxjs/Subscription';
import {MeteorObservable} from 'meteor-rxjs';
import {Customers} from '../../../../both/collections/customers.collection';
import {Customer} from '../../../../both/models/customer.model';
import template from './main.component.html';
import style from './main.component.scss';
const DEFAULT_ZOOM=8;
const DEFAULT_LAT=51.678418;
const DEFAULT_LNG=7.809007;
@Component({
  selector:'main',
  template,
  styles:[style]
})
export class MainComponent implements OnInit,OnDestroy{
  tech:Customer;
  techSub:Subscription;
  lat_:number=DEFAULT_LAT;
  lng_:number=DEFAULT_LNG;
  zoom:number=DEFAULT_ZOOM;
  constructor(){}
  ngOnInit(){
    if(this.techSub){
      this.techSub.unsubscribe();
    }
    this.techSub=MeteorObservable.subscribe('techs',Meteor.userId()).subscribe(()=>{
      MeteorObservable.autorun().subscribe(()=>{
        this.tech=Customers.findOne();
        if(this.tech){
          this.lat_=this.tech.location.lat;
          this.lng_=this.tech.location.lng;
        }else{
          Customers.insert({
            _id:Meteor.userId(),
            location:{
              lat:this.lat_,
              lng:this.lng_
            }
          });
        }
      });
    });
  }
  save(){
    Customers.update(Meteor.userId(),{
      $set:{
        location:this.tech.location
      }
    });
  }
  mapClicked($event:MouseEvent){
    this.tech.location.lat=$event.coords.lat;
    this.tech.location.lng=$event.coords.lng;
    this.lat_=$event.coords.lat;
    this.lng_=$event.coords.lng;
  }
  ngOnDestroy(){
    this.techSub.unsubscribe();
  }
}
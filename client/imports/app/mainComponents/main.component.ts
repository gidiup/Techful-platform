import {Component,OnInit,OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {MeteorObservable} from 'meteor-rxjs';
import {Customers} from '../../../../both/collections/customers.collection';
import {Customer} from '../../../../both/models/customer.model';
import {Tech} from '../../../../both/models/tech.model';
import template from './main.component.html';
import style from './main.component.scss';
@Component({
  selector:'main',
  template,
  styles:[style]
})
export class MainComponent implements OnInit,OnDestroy{
  config:Object={
    slidesPerView:'auto',
    spaceBetween:30
  };
  jobIndex:number=1;
  height:number=0;
  width:number=0;
  techs:Tech[];
  customer:Customer;
  techSub:Subscription;
  customerSub:Subscription;
  markers:{lat_:number,lng_:number}[]=[];
  hideFixedBar:boolean=false;
  firstPage:boolean=true;
  categoriesPage:boolean=false;
  submitParameters:string[]=[];
  thanksPage:boolean=false;
  constructor(){}
  ngOnInit(){
    this.height=window.innerHeight-125;
    let correctingWidth=0;
    if(window.innerWidth>666){
      correctingWidth=48;
    };
    this.width=window.innerWidth-correctingWidth;
    if(this.customerSub){
      this.customerSub.unsubscribe();
    };
    this.customerSub=MeteorObservable.subscribe('user',Meteor.userId()).subscribe(()=>{
      MeteorObservable.autorun().subscribe(()=>{
        this.customer=Customers.findOne();
        if(!this.customer){
          Customers.insert({
            _id:Meteor.userId()
          });
        }
      });
    })
  }
  activateJob(event_){
    if(event_.index==1){
      this.jobIndex=0;
    }
  }
  ngOnDestroy(){
    this.customerSub.unsubscribe();
  }
}
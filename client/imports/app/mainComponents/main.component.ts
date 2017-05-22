import {Component,OnInit,OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {MeteorObservable} from 'meteor-rxjs';
import {Observable,Subject} from "rxjs";
import {MdSnackBar} from '@angular/material';
import {upload} from '../../../../both/methods/images.methods';
import {Customers} from '../../../../both/collections/customers.collection';
import {Customer} from '../../../../both/models/customer.model';
import {Orders} from '../../../../both/collections/orders.collection';
import {Order} from '../../../../both/models/order.model';
import {Tech} from '../../../../both/models/tech.model';
import {Techs} from '../../../../both/collections/techs.collection';
import {Thumb} from "../../../../both/models/image.model";
import {Thumbs} from "../../../../both/collections/images.collection";
import {Stripe} from "../../../../both/models/stripe.model";
import {Stripes} from "../../../../both/collections/stripes.collection";
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
  submitParameters:any;
  jobIndex:number=1;
  height:number=0;
  width:number=0;
  customer:Customer;
  customerSub:Subscription;
  orders:Observable<Order[]>;
  previousOrders:Observable<Order[]>;
  orderSub:Subscription;
  techSub:Subscription;
  oneTechSub:Subscription;
  provider:Tech;
  hideFixedBar:boolean=false;
  firstPage:boolean=false;
  categoriesPage:boolean=false;
  thanksPage:boolean=false;
  jobsList:boolean=true;
  order_:Order;
  orderAddress:string;
  showConfirm:string="";
  orderProviders:Observable<Tech[]>;
  shownProviders:number=2;
  zoom:number=18;
  acceptChore:boolean=false;
  oneStar:boolean=false;
  twoStars:boolean=false;
  threeStars:boolean=false;
  fourStars:boolean=false;
  fiveStars:boolean=false;
  tip:number;
  serviceFee:number=0;
  sumWithoutTip:number=0;
  totalSum:any=0;
  thankYou:boolean=false;
  atIt:boolean=false;
  fileIsOver:boolean=false;
  uploading:boolean=false;
  file:Subject<string>=new Subject<string>();
  thumb:Thumb;
  thumbsSubscription:Subscription;
  thumbs:string[]=[];
  stripeSubscription:Subscription;
  stripe:Stripe;
  map:any;
  showMap:boolean=false;
  tabIndex:number=2;
  swiper_:boolean=true;
  showPast:boolean=false;
  addressPage:boolean=false;
  constructor(public snackBar:MdSnackBar){}
  ngOnInit(){
    let oldGeo;
    setInterval(()=>{
      let geo=Geolocation.latLng();
      if(geo){
        if(!oldGeo){
          oldGeo=geo;
          Customers.update(Meteor.userId(),{
            $set:{
              "location.lat":geo.lat,
              "location.lng":geo.lng
            }
          });
        }else if(geo.lat!==oldGeo.lat || geo.lng!==oldGeo.lng){
          oldGeo=geo;
          Customers.update(Meteor.userId(),{
            $set:{
              "location.lat":geo.lat,
              "location.lng":geo.lng
            }
          });
        }
      }
    },9999);
    let correctingWidth=0;
    if(window.innerWidth>666){
      correctingWidth=48;
      this.height=window.innerHeight-125;
    }else{
      this.height=window.innerHeight-117;
    }
    this.width=window.innerWidth-correctingWidth;
    if(this.customerSub){
      this.customerSub.unsubscribe();
    }
    this.customerSub=MeteorObservable.subscribe('user',Meteor.userId()).subscribe(()=>{
      MeteorObservable.autorun().subscribe(()=>{
        this.customer=Customers.findOne();
        if(this.customer && !this.categoriesPage && !this.thanksPage){
          this.firstPage=true;
        }
        // if(!this.customer.uberAccessToken){
        //   let codeIndex=location.href.indexOf("?code=");
        //   if(codeIndex==-1){
        //     MeteorObservable.call('uberUrl',location.href).subscribe((response)=> {
        //       location.href=String(response);
        //     },(err)=> {
        //       console.log(err);
        //     })
        //   }
        // }else{
        //   let param_={
        //     "scope":['request'],
        //     "access_token":this.customer.uberAccessToken,
        //     "fare_id":"abcd",
        //     "product_id":"a1111c8c-c720-46c3-8534-2fcdd730040d",
        //     "start_latitude":37.761492,
        //     "start_longitude":-122.423941,
        //     "end_latitude":37.775393,
        //     "end_longitude":-122.417546
        //   };
        //   // MeteorObservable.call('uberMap',param_,location.href).subscribe((map)=>{
        //   //   console.log(map);
        //   //   // this.map=String(response);
        //   //   // this.showMap=true;
        //   // },(err)=>{
        //   //   console.log(err);
        //   // })
        //   MeteorObservable.call('uberCreateRequest',param_,location.href).subscribe((requestId)=>{
        //     if(requestId){
        //       MeteorObservable.call('uberMap',requestId,location.href).subscribe((map)=>{
        //         console.log(map);
        //         // this.map=String(response);
        //         // this.showMap=true;
        //       },(err)=>{
        //         console.log(err);
        //       })
        //     }
        //   },(err)=>{
        //     console.log(err);
        //   })
        // }
      });
    })
    if(this.orderSub){
      this.orderSub.unsubscribe();
    }
    this.orderSub=MeteorObservable.subscribe('myOrders',Meteor.userId()).subscribe(()=>{
      MeteorObservable.autorun().subscribe(()=>{
        this.orders=Orders.find({status_:{$ne:"completed"}}).zone()
        let completed=Orders.find({status_:"completed"})
        this.previousOrders=completed.zone()
        let fetched=completed.fetch()
        let oldProvidersArray:string[]=[];
        fetched.forEach((oldOrder)=>{
          oldProvidersArray.push(oldOrder.providerId)
        })
        MeteorObservable.subscribe('providersSubscription',oldProvidersArray).subscribe(()=>{
          this.showPast=true;
        })
      });
    })
    this.file.subscribe((fileId)=>{
      MeteorObservable.autorun().subscribe(()=>{
        if(this.thumbsSubscription){
          this.thumbsSubscription.unsubscribe();
          this.thumbsSubscription=undefined;
        }
        this.thumbsSubscription=MeteorObservable.subscribe("thumbs",fileId).subscribe(()=>{
          MeteorObservable.autorun().subscribe(()=>{
            this.thumb=Thumbs.findOne({originalStore:'images',originalId:fileId});
            if(this.thumb && this.thumb.url){
              this.thumbs.push(this.thumb.url);
            }
          })
        });
      })
    })
  }
  activateJob(event_){
    if(event_.index==1){
      this.jobIndex=0;
    }
  }
  reload(){
    this.firstPage=true;
    this.jobIndex=1;
    this.swiper_=false;
    this.thankYou=false;
    this.thanksPage=false;
    this.refresh(()=>{
      this.tabIndex=1;
      this.swiper_=true;
      this.jobIndex=0;
    });
  }
  refresh(doneCallback:()=>void){
    setTimeout(function(){
      doneCallback();
    },0)
  }
  search(text){
  //
  }
  favoriteWorker(technicianId){
    if(this.customer.favorites){
      let alreadyExists=this.customer.favorites.includes(technicianId);
      if(!alreadyExists){
        this.customer.favorites.push(technicianId)
        Customers.update(Meteor.userId(),{
          $set:{
            favorites:this.customer.favorites
          }
        })
      }
    }else{
      Customers.update(Meteor.userId(),{
        $set:{
          favorites:[technicianId]
        }
      })
    }
  }
  toChore(order){
    if(order.status_!==' Due to arrive' && order.status_!==' Chore in progress'){
      this.order_=order;
      if(this.order_.providers && this.order_.providers.length>0){
        this.orderAddress=this.order_.address1+", "+this.order_.city+", "+this.order_.state+", "+this.order_.index;
        if(this.order_.status_=="Providers Available"){
          if(this.techSub){
            this.techSub.unsubscribe();
          }
          this.techSub=MeteorObservable.subscribe('providersSubscription',this.order_.providers).subscribe(()=>{
            MeteorObservable.autorun().subscribe(()=>{
              this.orderProviders=Techs.find().zone();
              this.jobsList=false;
            });
          })
        }else{
          if(this.oneTechSub){
            this.oneTechSub.unsubscribe();
          }
          this.oneTechSub=MeteorObservable.subscribe('provider',this.order_.providers[0]).subscribe(()=>{
            MeteorObservable.autorun().subscribe(()=>{
              this.provider=Techs.findOne(this.order_.providers[0]);
              this.jobsList=false;
            });
          })
        }
      }
    }else{
      this.snackBar.open("Waiting on the technician.","ok",{duration:9999});
    }
  }
  showHideConfirm(param){
    if(param==this.showConfirm){
      this.showConfirm="";
    }else{
      this.showConfirm=param;
    }
  }
  confirmProvider(providerId,providerName){
    let temporaryProviders=[];
    temporaryProviders.push(providerId);
    if(this.order_.now){
      Orders.update(this.order_._id,{
        $set:{
          date:Date.now(),
          status_:' Due to arrive',
          providerId:providerId,
          providerName:providerName,
          providers:temporaryProviders
        }
      })
    }else{
      Orders.update(this.order_._id,{
        $set:{
          status_:' Due to arrive',
          providerId:providerId,
          providerName:providerName,
          providers:temporaryProviders
        }
      })
    }
    this.shownProviders=2;
    this.jobsList=true;
  }
  acceptChore_(){
    let temporarySum=Number(this.order_.choreSum.slice(1));
    this.serviceFee=temporarySum*0.08;
    this.sumWithoutTip=temporarySum+this.serviceFee;
    this.totalSum=this.sumWithoutTip.toFixed(2);
    this.jobsList=true;
    this.acceptChore=true;
  }
  submitChore(){
    let mark=0;
    if(this.oneStar){
      mark=1;
    }else if(this.twoStars){
      mark=2;
    }else if(this.threeStars){
      mark=3;
    }else if(this.fourStars){
      mark=4;
    }else if(this.fiveStars){
      mark=5;
    }
    if(mark==0){
      this.snackBar.open("You must live the"," mark",{duration:9999});
    }else{
      if(this.stripeSubscription){
        this.stripeSubscription.unsubscribe();
      }
      this.snackBar.open("Starting the operation","",{duration:999});
      this.stripeSubscription=MeteorObservable.subscribe('stripeCustomerId',this.order_._id).subscribe(()=>{
        this.stripe=Stripes.findOne({orderId:this.order_._id});
        this.snackBar.open(" Credentials found","",{duration:999});
        if(this.stripe.usePrevious){
          MeteorObservable.call('retrieveStripeCustomer',this.stripe.customer).subscribe((response_)=>{
            if(response_.id){
              this.snackBar.open(" Old data retrieved!","",{duration:999});
              MeteorObservable.call('stripeCharge',response_.id,this.totalSum*100).subscribe((response)=> {
                this.snackBar.open("Success", "OK", {duration: 9999});
                Orders.update(this.order_._id,{
                  $set:{
                    disposalFee:0,
                    serviceFee:this.serviceFee,
                    tip:this.tip,
                    status_:"completed"
                  }
                })
                Techs.update(this.provider._id,{
                  $addToSet:{
                    marks:mark
                  }
                })
                this.acceptChore = false;
                this.thankYou = true;
              }), (err)=> {
                this.snackBar.open(err,"",{duration: 9999});
                this.acceptChore = false;
              }
            }
          }),(err)=>{
            this.snackBar.open(err,"",{duration:9999});
            this.acceptChore=false;
          }
        }else{
          MeteorObservable.call('stripeCharge',this.stripe.customer,this.totalSum*100).subscribe((response)=>{
            this.snackBar.open("Success","OK",{duration:9999});
            Orders.update(this.order_._id,{
              $set:{
                disposalFee:0,
                serviceFee:this.serviceFee,
                tip:this.tip,
                status_:"completed"
              }
            })
            Techs.update(this.provider._id,{
              $addToSet:{
                marks:mark
              }
            })
            this.acceptChore=false;
            this.thankYou=true;
          },(err)=>{
            this.snackBar.open(err,"",{duration:9999});
            this.acceptChore=false;
          })
        }
      });
    }
  }
  submitAtIt(describeAtIt,priceAtIt){
    let price=Number(priceAtIt.value);
    if(describeAtIt.value=="" || price==0){
      this.snackBar.open("Empty!","ok",{duration:9999});
    }else{
      let temporaryProviders=[];
      temporaryProviders.push(this.provider._id);
      let orderId=Orders.collection.insert({
        now:true,
        location:{
          lat:this.customer.location.lat,
          lng:this.customer.location.lng
        },
        status_:' Chore in progress',
        name:"WHILE YOU'RE AT IT",
        parentName:describeAtIt.value,
        categoryName:"WHILE YOU'RE AT IT",
        date:Date.now(),
        creator:Meteor.userId(),
        creatorName:this.customer.firstName,
        creatorPhoto:this.customer.photo,
        address1:this.customer.address1,
        address2:this.customer.address2,
        city:this.customer.city,
        state:this.customer.state,
        index:this.customer.zipCode,
        choreSum:"$"+price,
        description:describeAtIt.value,
        images:this.thumbs,
        providerName:this.provider.firstName,
        providers:temporaryProviders,
        cardLast4:this.order_.cardLast4
      })
      Stripes.insert({
        orderId:orderId,
        customer:this.stripe.customer,
        usePrevious:true
      })
      this.submitParameters=[];
      this.submitParameters.push(this.order_.cardLast4);
      this.submitParameters.push("WHILE YOU`RE AT IT");
      this.submitParameters.push(describeAtIt.value);
      this.submitParameters.push("$"+price);
      this.submitParameters.push(this.order_.address1+", "+this.order_.city+", "+this.order_.state+", "+this.order_.index);
      this.atIt=false;
      this.thanksPage=true;
    }
  }
  onFileDrop(file:File):void{
    this.uploading=true;
    upload(file)
        .then((result)=>{
          this.uploading=false;
          this.file.next(result._id);
        })
        .catch((error)=>{
          this.uploading=false;
          console.log(`Something went wrong!`,error);
        });
  }
  fileOver(fileIsOver:boolean):void{
    this.fileIsOver=fileIsOver;
  }
  ngOnDestroy(){
    this.customerSub.unsubscribe();
    this.orderSub.unsubscribe();
    if(this.stripeSubscription){
      this.stripeSubscription.unsubscribe();
    }
    if(this.oneTechSub){
      this.oneTechSub.unsubscribe();
    }
    if(this.techSub){
      this.techSub.unsubscribe();
    }
  }
}
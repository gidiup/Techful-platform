import {Component,OnInit,OnDestroy,EventEmitter,Output} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {MdDialog,MdDialogRef,MdSnackBar} from '@angular/material';
import {Customers} from '../../../../both/collections/customers.collection';
import {Customer} from '../../../../both/models/customer.model';
import {Orders} from '../../../../both/collections/orders.collection';
import {Order} from '../../../../both/models/order.model';
import {upload} from '../../../../both/methods/images.methods';
import {Thumb} from "../../../../both/models/image.model";
import {Thumbs} from "../../../../both/collections/images.collection";
import {Subject,Subscription} from 'rxjs';
import {MeteorObservable} from 'meteor-rxjs';
import template from './address.component.html';
import style from './address.component.scss';
@Component({
  selector:'address',
  template,
  styles:[style]
})
export class AddressComponent implements OnInit,OnDestroy{
  promoCodes=[
    {value:'11111',viewValue:'Promo1'},
    {value:'22222',viewValue:'Promo2'},
    {value:'33333',viewValue:'Promo3'}
  ];
  config:Object={
    slidesPerView:'auto',
    spaceBetween:30
  };
  selectedPromo:string;
  height:number=0;
  submitPay:boolean=false;
  pay:boolean=false;
  photosNotes:boolean=false;
  when:boolean=false;
  whenDate:boolean=false;
  saveAddress:boolean=false;
  addressForm:FormGroup;
  payForm:FormGroup;
  choosedParentCategory:string="";
  choosedCategory:string="";
  choosedPrice:string="";
  addressList:boolean=false;
  newAddress:boolean=false;
  fileIsOver:boolean=false;
  uploading:boolean=false;
  file:Subject<string>=new Subject<string>();
  thumbsSubscription:Subscription;
  customerSubscription:Subscription;
  customer:Customer;
  order:Order;
  thumb:Thumb;
  thumbs:string[]=[];
  thumbIds:string[]=[];
  submitParams:string[]=[];
  _name_:string="";
  adrs1:string="";
  adrs2:string="";
  _city_:string="";
  _state_:string="";
  _index_:string="";
  homeAddress:boolean=true;
  description:string="To protect your privacy, please don't include contact information in your job notes";
  @Output() onBack:EventEmitter<any>=new EventEmitter();
  @Output() onSubmit:EventEmitter<string[]>=new EventEmitter<string[]>();
  constructor(private formBuilder:FormBuilder,public dialog:MdDialog,public snackBar:MdSnackBar){}
  ngOnInit(){
    this.height=window.innerHeight-125;
    this.addressForm=this.formBuilder.group({
      address1:['',Validators.required],
      address2:[''],
      city:['',Validators.required],
      state:['',Validators.required],
      index_:[null,Validators.required],
      name:[''],
    });
    this.payForm=this.formBuilder.group({
      name:['',Validators.required],
      cardN:[null,Validators.pattern('[0-9]{16}')],
      exp:[null,Validators.pattern('[0-9]{2}')],
      date:[null,Validators.pattern('[0-9]{2}')],
      cvv:[null,Validators.pattern('[0-9]{3}')]
    });
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
              this.thumbIds.push(this.thumb._id);
              this.thumbs.push(this.thumb.url);
            }
          })
        });
      });
    });
    if(this.customerSubscription){
      this.customerSubscription.unsubscribe();
    };
    this.customerSubscription=MeteorObservable.subscribe('user',Meteor.userId()).subscribe(()=>{
      MeteorObservable.autorun().subscribe(()=>{
        this.customer=Customers.findOne();
        if(this.when==false){
          this.addressList=true;
        }
      })
    });
  }
  back(){
    this.onBack.emit(null);
  }
  newAddress_(name,adrs1,adrs2,city,state,index){
    this._name_=name;
    this.adrs1=adrs1;
    this.adrs2=adrs2;
    this._city_=city;
    this._state_=state;
    this._index_=index;
    this.addressForm=this.formBuilder.group({
      address1:[this.adrs1,Validators.required],
      address2:[this.adrs2],
      city:[this._city_,Validators.required],
      state:[this._state_,Validators.required],
      index_:[this._index_,Validators.required],
      name:[this._name_],
    });
    this.addressList=false;
    this.newAddress=true;
  }
  next(){
    if(this.addressForm.valid){
      this.whenDate=true;
      this.when=true;
      if(this.saveAddress){
        Customers.update(Meteor.userId(),{
          $addToSet:{
            addresses:{
              name:this.addressForm.value.name,
              address1:this.addressForm.value.address1,
              address2:this.addressForm.value.address2,
              city:this.addressForm.value.city,
              state:this.addressForm.value.state,
              index_:this.addressForm.value.index_
            }
          }
        });
        if(this.homeAddress){
          Customers.update(Meteor.userId(),{
            $set:{
              "homeLocation.name":this.addressForm.value.name,
              "homeLocation.address1":this.addressForm.value.address1,
              "homeLocation.address2":this.addressForm.value.address2,
              "homeLocation.city":this.addressForm.value.city,
              "homeLocation.state":this.addressForm.value.state,
              "homeLocation.index_":this.addressForm.value.index_
            }
          });
        }
      }
    }else{
      this.snackBar.open("Empty filds!","OK.",{duration:999});
    }
  }
  nextPay(){
    if(this.payForm.valid){
      let last4numbers=this.payForm.value.cardN.substring(this.payForm.value.cardN.length-4);
      this.submitParams.push(last4numbers);
      this.pay=false;
      this.submitPay=true;
    }else{
      this.snackBar.open("You typed wrong data.","OK!",{duration:9999});
    }
  }
  openDialog(){
    let dialogRef=this.dialog.open(areYouSurePopup);
    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.whenDate=false;
        this.photosNotes=true;
      }else{
        console.log(result);
      }
    });
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
  successfulSubmit(){
    Orders.insert({
      date:Date.now(),
      creator:Meteor.userId(),
      address1:this.addressForm.value.address1,
      address2:this.addressForm.value.address2,
      city:this.addressForm.value.city,
      state:this.addressForm.value.state,
      index:this.addressForm.value.index_,
      sum:this.choosedPrice,
      description:this.description,
      images:this.thumbs
    });
    this.submitParams.push(this.choosedParentCategory);
    this.submitParams.push(this.choosedCategory);
    this.submitParams.push(this.choosedPrice);
    let address=this.addressForm.value.address1+", "+this.addressForm.value.city+", "+this.addressForm.value.state+", "+this.addressForm.value.index_;
    this.submitParams.push(address);
    this.saveAddress=false;
    this.when=false;
    this.newAddress=false;
    this.whenDate=false;
    this.photosNotes=false;
    this.pay=false;
    this.submitPay=false;
    this.addressList=true;
    this.onSubmit.emit(this.submitParams);
  }
  ngOnDestroy(){
    if(this.thumbsSubscription){
      this.thumbsSubscription.unsubscribe();
    }
    this.customerSubscription.unsubscribe();
  }
}
@Component({
  selector:'dialog-overview-example-dialog',
  template:`
    <div fxLayout="column">
        <h2 fxLayoutAlign="center" class="font-normal">Are You Sure?</h2>
        <p>When you select a provider for this job, you must have any necessary supplies ready and be prepared for them to arrive at your location in about an hour of being chosen.</p>
        <div fxLayout="row">
            <button md-raised-button fxFlex="50%" aria-label="no" (click)="answer(false)">No</button><button md-raised-button fxFlex="50%" aria-label="yes" (click)="answer(true)">Yes</button>
        </div>
    </div>
  `
})
export class areYouSurePopup{
  constructor(public dialogRef:MdDialogRef<areYouSurePopup>){}
  answer(answr){
    if(answr){
      this.dialogRef.close(answr);
    }else{
      this.dialogRef.close(answr);
    }
  }
}
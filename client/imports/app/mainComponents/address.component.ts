import {Component,OnInit,OnDestroy,EventEmitter,Output,Inject,Optional} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {MatDialog,MatDialogRef,MAT_DIALOG_DATA,MatSnackBar} from '@angular/material';
import {Customers} from '../../../../both/collections/customers.collection';
import {Customer} from '../../../../both/models/customer.model';
import {Order} from '../../../../both/models/order.model';
import {upload} from '../../../../both/methods/images.methods';
import {Thumb} from "../../../../both/models/image.model";
import {Thumbs} from "../../../../both/collections/images.collection";
import {Orders} from '../../../../both/collections/orders.collection';
import {Stripes} from '../../../../both/collections/stripes.collection';
import {Notifications} from '../../../../both/collections/notifications.collection';
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
  parentParentCategory:string="";
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
  submitParams:string[]=[];
  _name_:string="";
  adrs1:string="";
  adrs2:string="";
  _city_:string="";
  _state_:string="";
  _index_:string="";
  homeAddress:boolean=true;
  nowChore:boolean;
  schedule:boolean=false;
  description:string="To protect your privacy, please don't include contact information in your job notes";
  date_:any;
  addressFields:boolean=false;
  usePreviousCard:boolean=false;
  stripeCustomer:string="";
  @Output() onBack:EventEmitter<any>=new EventEmitter();
  @Output() onSubmit:EventEmitter<string[]>=new EventEmitter<string[]>();
  constructor(private formBuilder:FormBuilder,public dialog:MatDialog,public snackBar:MatSnackBar){}
  ngOnInit(){
    if(window.innerWidth>666){
      this.height=window.innerHeight-125;
    }else{
      this.height=window.innerHeight-117;
    }
    //pk_live_L8XPo5K8JbfCBGFS4qdo7DMR
    Stripe.setPublishableKey('pk_test_GbzLgFkClr4SBIMivxkGKbsc');
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
        if(!this.submitPay){
          this.customer=Customers.findOne()
        }
        if(!this.when && !this.addressFields){
          this.addressList=true
        }
      })
    });
  }
  back(){
    this.onBack.emit(null);
  }
  newAddress_(name,adrs1,adrs2,city,state,index){
    this.addressList=false;
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
    this.newAddress=true;
    this.addressFields=true;
  }
  next(){
    if(this.addressForm.valid){
      this.whenDate=true;
      this.when=true;
      if(this.saveAddress){
        if(this.homeAddress){
          Customers.update(Meteor.userId(),{
            $set:{
              address1:this.addressForm.value.address1,
              address2:this.addressForm.value.address2,
              city:this.addressForm.value.city,
              state:this.addressForm.value.state,
              zipCode:this.addressForm.value.index_
            }
          });
        }else{
          Customers.update(Meteor.userId(),{
            $addToSet:{
              addresses:{
                name:this.addressForm.value.name,
                address1:this.addressForm.value.address1,
                address2:this.addressForm.value.address2,
                city:this.addressForm.value.city,
                state:this.addressForm.value.state,
                zipCode:this.addressForm.value.index_
              }
            }
          });
        }
      }
    }else{
      this.snackBar.open("Empty filds!","OK.",{duration:9999});
    }
  }
  nextPay(){
    if(this.payForm.valid){
      if(Stripe.card.validateCardNumber(this.payForm.value.cardN) && Stripe.card.validateExpiry(this.payForm.value.exp,this.payForm.value.date)){
        let last4numbers_=this.payForm.value.cardN.substring(this.payForm.value.cardN.length-4);
        Customers.update(Meteor.userId(),{
          $set:{
            last4Numbers:last4numbers_
          }
        })
        this.submitParams.push(last4numbers_);
        this.pay=false;
        this.submitPay=true;
        Stripe.card.createToken({
            number:this.payForm.value.cardN,
            cvc:this.payForm.value.cvv,
            exp_month:this.payForm.value.exp,
            exp_year:this.payForm.value.date
        },(status,response)=>{
            if(response.error){
              this.snackBar.open(response.error.message,"",{duration:9999});
            }else{
              this.stripeCustomer=response.id
              Customers.update(Meteor.userId(),{
                $set:{
                  lastStripeCustomer:response.id
                }
              })
            }
        })
      }else{
        this.snackBar.open("You typed wrong card or date/month number","",{duration:9999});
      }
    }else{
      this.snackBar.open("You typed wrong data.","OK!",{duration:9999});
    }
  }
  openDialog(secondPopup){
    let dialogRef=this.dialog.open(areYouSurePopup,{data:secondPopup});
    dialogRef.afterClosed().subscribe(result=>{
      if(!secondPopup){
        if(result){
          this.schedule=false;
          this.whenDate=false;
          this.photosNotes=true;
        }else{
          console.log(result);
        }
      }else{
        this.photosNotes=false;
        if(result){
          this.submitParams.push(this.customer.last4Numbers);
          this.usePreviousCard=true;
          this.submitPay=true;
          if(this.customer.lastStripeCustomer.indexOf("tok_")!==-1){
            MeteorObservable.call('firstStripeCustomer',this.customer.lastStripeCustomer,this.customer.email).subscribe((response)=>{
              if(response.id){
                this.stripeCustomer=response.id
                Customers.update(Meteor.userId(),{
                  $set:{
                    lastStripeCustomer:response.id
                  }
                })
              }
            },(err)=>{
              console.log(err);
            })
          }
        }else{
          this.pay=true;
        }
      }
    })
  }
  onFileDrop(file:File):void{
    if(file){
      this.uploading = true;
      upload(file)
          .then((result)=> {
            this.uploading = false;
            this.file.next(result._id);
          })
          .catch((error)=> {
            this.uploading = false;
            console.log(`Something went wrong!`, error);
          });
    }
  }
  fileOver(fileIsOver:boolean):void{
    this.fileIsOver=fileIsOver;
  }
  shedule_(){
    this.schedule=false;
    this.whenDate=false;
    this.photosNotes=true;
  }
  successfulSubmit(){
    let customerPhoto="img/user-icon.png";
    if(this.customer.photo!==""){
      customerPhoto=this.customer.photo;
    }
    let date;
    MeteorObservable.call('serverTime').subscribe((response)=>{
        if(this.date_){
          date=Date.parse(this.date_);
        }else{
          date=response
        }
        let orderId=Orders.collection.insert({
          now:this.nowChore,
          location:{
            lng:this.customer.location.lng,
            lat:this.customer.location.lat
          },
          status_:'Looking For Providers',
          name:this.choosedCategory,
          parentName:this.choosedParentCategory,
          categoryName:this.parentParentCategory,
          date:date,
          creator:Meteor.userId(),
          creatorName:this.customer.firstName,
          creatorPhoto:customerPhoto,
          address1:this.addressForm.value.address1,
          address2:this.addressForm.value.address2,
          city:this.addressForm.value.city,
          state:this.addressForm.value.state,
          index:this.addressForm.value.index_,
          choreSum:this.choosedPrice,
          description:this.description,
          images:this.thumbs,
          cardLast4:this.submitParams[0]
        });
        let shouldAddCat:boolean=true;
        if(this.customer.favoriteCategories){
          this.customer.favoriteCategories.forEach((cat)=>{
            if(cat.choosedCategory==this.choosedCategory){
              shouldAddCat=false;
            }
          })
        }
        if(this.usePreviousCard){
          if(this.stripeCustomer.indexOf("tok_")==-1){//other tries
            if(shouldAddCat){
              Customers.update(Meteor.userId(),{
                $addToSet:{
                  favoriteCategories:{
                    parentParentCategory:this.parentParentCategory,
                    choosedPrice:this.choosedPrice,
                    choosedParentCategory:this.choosedParentCategory,
                    choosedCategory:this.choosedCategory
                  }
                }
              })
            }
            Stripes.insert({
              orderId:orderId,
              customer:this.customer.lastStripeCustomer,
              usePrevious:true
            })
          }else{//second try
            if(shouldAddCat){
              Customers.update(Meteor.userId(),{
                $addToSet:{
                  favoriteCategories:{
                    parentParentCategory:this.parentParentCategory,
                    choosedPrice:this.choosedPrice,
                    choosedParentCategory:this.choosedParentCategory,
                    choosedCategory:this.choosedCategory
                  }
                }
              })
            }
            Stripes.insert({
              orderId:orderId,
              customer:this.stripeCustomer,
              usePrevious:false
            })
          }
        }else{//first try
          if(shouldAddCat){
            Customers.update(Meteor.userId(),{
              $addToSet:{
                favoriteCategories:{
                  parentParentCategory:this.parentParentCategory,
                  choosedPrice:this.choosedPrice,
                  choosedParentCategory:this.choosedParentCategory,
                  choosedCategory:this.choosedCategory
                }
              }
            })
          }
          Stripes.insert({
            orderId:orderId,
            customer:this.stripeCustomer,
            usePrevious:false
          })
        }
        Notifications.insert({
          orderId:orderId,
          myOrAvailable:false
        })
        Notifications.insert({
          orderId:orderId,
          forWhom:Meteor.userId()
        })
    })
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
    this.addressList=false;
    this.onSubmit.emit(this.submitParams);
    alert("Credit card is approved");
  }
  descriptionNext(){
    if(this.description!=="To protect your privacy, please don't include contact information in your job notes" && this.description!==""){
      if(this.customer.lastStripeCustomer){
        this.openDialog(this.customer.last4Numbers)
      }else{
        this.photosNotes=false;
        this.pay=true;
      }
    }else{
      this.snackBar.open("Please add the","description",{duration:9999});
    }
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
    <div *ngIf="!data" fxLayout="column">
        <h2 fxLayoutAlign="center" class="font-normal">Are You Sure?</h2>
        <p class="textCenter">When you select a provider for this job, you must have any necessary supplies ready and be prepared for them to arrive at your location in about an hour of being chosen.</p>
        <div fxLayout="row">
            <button md-raised-button fxFlex="50%" aria-label="no" (click)="answer(false)" class="aqua">No</button>
            <button md-raised-button fxFlex="50%" aria-label="yes" (click)="answer(true)" class="aqua">Yes</button>
        </div>
    </div>
    <div *ngIf="data" fxLayout="column">
        <h2 fxLayoutAlign="center" class="font-normal">Do you want to use the credit/debit card (...{{data}}) from your last chore?</h2>
        <p class="textCenter">If you wish to try a new pay card press 'No'</p>
        <div fxLayout="row">
            <button md-raised-button fxFlex="50%" aria-label="no" (click)="answer(false)" class="aqua">No</button>
            <button md-raised-button fxFlex="50%" aria-label="yes" (click)="answer(true)" class="aqua">Yes</button>
        </div>
    </div>
  `
})
export class areYouSurePopup{
  constructor(public dialogRef:MatDialogRef<areYouSurePopup>,@Optional() @Inject(MAT_DIALOG_DATA) public data:any){}
  answer(answr){
    this.dialogRef.close(answr)
  }
}
import {Component,OnInit,OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {MeteorObservable} from 'meteor-rxjs';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {InjectUser} from "angular2-meteor-accounts-ui";
import {upload} from '../../../../both/methods/images.methods';
import {Customers} from '../../../../both/collections/customers.collection';
import {Customer} from '../../../../both/models/customer.model';
import {Thumb} from "../../../../both/models/image.model";
import {Thumbs} from "../../../../both/collections/images.collection";
import template from './app.component.html';
import style from './app.component.scss';
@Component({
  selector:'goapp',
  template,
  styles:[style]
})
@InjectUser('user')
export class AppComponent implements OnInit,OnDestroy{
  hideStep1:boolean=false;
  hideStep2:boolean=true;
  hideStep3:boolean=true;
  hideStep4:boolean=true;
  hideStep5:boolean=true;
  height:string="0px";
  customer:Customer;
  customerSub:Subscription;
  infoForm:FormGroup;
  thumb:Thumb;
  photo:string="";
  thumbsSubscription:Subscription;
  fileIsOver:boolean=false;
  uploading:boolean=false;
  file:Subject<string>=new Subject<string>();
  constructor(private router:Router,private formBuilder:FormBuilder,public snackBar:MdSnackBar){}
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
    let user_=Meteor.user();
    let email="";
    if(user_.emails){
      email=user_.emails[0].address;
    }
    this.infoForm=this.formBuilder.group({
      email:[email,Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')],
      firstName:['',Validators.required],
      middleName:[''],
      lastName:['',Validators.required],
      monthDate:["1",Validators.required],
      dayDate:["",Validators.required],
      yearDate:["",Validators.required],
      address1:['',Validators.required],
      address2:[''],
      city:['',Validators.required],
      state:['',Validators.required],
      zipCode:[null,Validators.required],
      bio:[''],
      phone:['',Validators.required]
    });
    this.height=window.innerHeight-64+"px";
    if(this.customerSub){
      this.customerSub.unsubscribe();
    }
    this.customerSub=MeteorObservable.subscribe('user',Meteor.userId()).subscribe(()=>{
      MeteorObservable.autorun().subscribe(()=>{
        this.customer=Customers.findOne();
        if(this.customer){
              this.photo=this.customer.photo;
              this.infoForm=this.formBuilder.group({
                email:[this.customer.email,Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')],
                firstName:[this.customer.firstName,Validators.required],
                middleName:[this.customer.middleName],
                lastName:[this.customer.lastName,Validators.required],
                monthDate:[this.customer.monthDate,Validators.required],
                dayDate:[this.customer.dayDate,Validators.required],
                yearDate:[this.customer.yearDate,Validators.required],
                address1:[this.customer.address1,Validators.required],
                address2:[this.customer.address2],
                city:[this.customer.city,Validators.required],
                state:[this.customer.state,Validators.required],
                zipCode:[this.customer.zipCode,Validators.required],
                bio:[this.customer.bio],
                phone:[this.customer.phone,Validators.required]
              })
        }
      });
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
              this.photo=this.thumb.url;
            }
          })
        });
      });
    });
  }
  infoSave(){
    if(this.customer){
      Customers.update(Meteor.userId(),{
        $set:{
          email:this.infoForm.value.email,
          photo:this.photo,
          firstName:this.infoForm.value.firstName,
          middleName:this.infoForm.value.middleName,
          lastName:this.infoForm.value.lastName,
          monthDate:this.infoForm.value.monthDate,
          dayDate:this.infoForm.value.dayDate,
          yearDate:this.infoForm.value.yearDate,
          address1:this.infoForm.value.address1,
          address2:this.infoForm.value.address2,
          city:this.infoForm.value.city,
          state:this.infoForm.value.state,
          zipCode:this.infoForm.value.zipCode,
          bio:this.infoForm.value.bio,
          phone:this.infoForm.value.phone
        }
      });
      this.hideStep2=false;
      this.hideStep1=true;
    }else{
      if(this.infoForm.valid){
        MeteorObservable.call('sendCode','Welcome your invitation code is: ',this.infoForm.value.phone).subscribe((response)=>{
          let code=prompt("We sent the code to your phone",'');
          if(code==response){
            Customers.insert({
                            _id:Meteor.userId(),
                            email:this.infoForm.value.email,
                            photo:this.photo,
                            firstName:this.infoForm.value.firstName,
                            middleName:this.infoForm.value.middleName,
                            lastName:this.infoForm.value.lastName,
                            monthDate:this.infoForm.value.monthDate,
                            dayDate:this.infoForm.value.dayDate,
                            yearDate:this.infoForm.value.yearDate,
                            address1:this.infoForm.value.address1,
                            address2:this.infoForm.value.address2,
                            city:this.infoForm.value.city,
                            state:this.infoForm.value.state,
                            zipCode:this.infoForm.value.zipCode,
                            bio:this.infoForm.value.bio,
                            phone:this.infoForm.value.phone
            });
            this.hideStep2=false;
            this.hideStep1=true;
          }else{
            this.snackBar.open("Wrong code","OK!",{duration:9999});
          }
        },(err)=>{
          alert(err);
          //delete this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          Customers.insert({
            _id:Meteor.userId(),
            email:this.infoForm.value.email,
            photo:this.photo,
            firstName:this.infoForm.value.firstName,
            middleName:this.infoForm.value.middleName,
            lastName:this.infoForm.value.lastName,
            monthDate:this.infoForm.value.monthDate,
            dayDate:this.infoForm.value.dayDate,
            yearDate:this.infoForm.value.yearDate,
            address1:this.infoForm.value.address1,
            address2:this.infoForm.value.address2,
            city:this.infoForm.value.city,
            state:this.infoForm.value.state,
            zipCode:this.infoForm.value.zipCode,
            bio:this.infoForm.value.bio,
            phone:this.infoForm.value.phone
          });
          this.hideStep2=false;
          this.hideStep1=true;
        })
      }else{
        this.snackBar.open("Empty filds!","OK.",{duration:9999});
      }
    }
  }
  onFileDrop(file:File):void{
    if(file){
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
  }
  fileOver(fileIsOver:boolean):void{
    this.fileIsOver=fileIsOver;
  }
  route(){
    this.router.navigate(['/app']);
  }
  ngOnDestroy(){
    this.customerSub.unsubscribe();
    if(this.thumbsSubscription){
      this.thumbsSubscription.unsubscribe();
    }
  }
}
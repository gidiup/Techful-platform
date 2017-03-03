import "angular2-meteor-polyfills";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {MeteorObservable} from 'meteor-rxjs';
import {enableProdMode} from "@angular/core";
import {AppModule} from "./imports/app/app.module";
enableProdMode();
Meteor.startup(()=>{
   const subscription=MeteorObservable.autorun().subscribe(()=>{
      if (Meteor.loggingIn()){
         return;
      }
      setTimeout(() => subscription.unsubscribe());
      const platform=platformBrowserDynamic();
      platform.bootstrapModule(AppModule);
   });
});
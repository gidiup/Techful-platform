import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AccountsModule} from 'angular2-meteor-accounts-ui';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {AppComponent} from "./app.component";
import {routes,checkUser} from './app.routes';
import {MAIN_DECLARATIONS} from './mainComponents';
import {SHARED_DECLARATIONS} from './shared';
import {MaterialModule} from "@angular/material";
import {CovalentStepsModule} from '@covalent/core';
import {FlexLayoutModule} from "@angular/flex-layout";
import {AUTH_DECLARATIONS} from "./auth/index";
import {FileDropModule} from "angular2-file-drop";
let moduleDefinition;
moduleDefinition={
    imports:[
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        AccountsModule,
        AgmCoreModule.forRoot({apiKey:'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'}),
        MaterialModule,
        CovalentStepsModule.forRoot(),
        FlexLayoutModule,
        FileDropModule
    ],
    declarations:[
      AppComponent,
      ...MAIN_DECLARATIONS,
      ...SHARED_DECLARATIONS,
      ...AUTH_DECLARATIONS
    ],
    providers:[
      checkUser
    ],
    bootstrap:[
      AppComponent
    ]
}
@NgModule(moduleDefinition)
export class AppModule{}
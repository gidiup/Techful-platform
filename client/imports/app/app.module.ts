import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AccountsModule} from 'angular2-meteor-accounts-ui';
import {AgmCoreModule} from '@agm/core/core.umd.js';
import {AppComponent} from "./app.component";
import {routes,checkUser} from './app.routes';
import {SwiperModule} from 'angular2-useful-swiper';
import {MAIN_DECLARATIONS} from './mainComponents';
import {SHARED_DECLARATIONS} from './shared';
import {APP_DECLARATIONS} from './appComponents';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatChipsModule} from "@angular/material/chips";
import {MatListModule} from "@angular/material/list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {AUTH_DECLARATIONS} from "./auth/index";
import {areYouSurePopup} from "./mainComponents/address.component";
import {FileDropModule} from "angular2-file-drop";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
let moduleDefinition;
moduleDefinition={
    imports:[
        AgmCoreModule.forRoot({
            apiKey:'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
        }),
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        AccountsModule,
        MatDialogModule,
        MatTooltipModule,
        MatTabsModule,
        MatInputModule,
        MatToolbarModule,
        MatButtonToggleModule,
        MatDatepickerModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatButtonModule,
        MatCardModule,
        MatSidenavModule,
        MatChipsModule,
        MatListModule,
        FlexLayoutModule,
        FileDropModule,
	    SwiperModule
    ],
    declarations:[
      AppComponent,
      ...MAIN_DECLARATIONS,
      ...APP_DECLARATIONS,
      ...SHARED_DECLARATIONS,
      ...AUTH_DECLARATIONS
    ],
    providers:[
        checkUser
    ],
    bootstrap:[
      AppComponent
    ],
    entryComponents:[
        areYouSurePopup
    ]
}
@NgModule(moduleDefinition)
export class AppModule{}
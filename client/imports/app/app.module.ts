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
import {MatSnackBarModule,MatDialogModule,MatTooltipModule,MatTabsModule,MatInputModule,MatToolbarModule,MatButtonToggleModule,MatDatepickerModule,MatSelectModule,
    MatSlideToggleModule,MatButtonModule,MatCardModule,MatSidenavModule,MatChipsModule,MatListModule,MatNativeDateModule,MatStepperModule} from "@angular/material";
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
        MatNativeDateModule,
        MatStepperModule,
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
        areYouSurePopup,
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
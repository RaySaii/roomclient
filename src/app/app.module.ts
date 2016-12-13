import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ChatComponent } from './index/chat.component';
import { RoomComponent } from './index/room.component';
import { RegisterComponent } from './register/register.component';
import { DynamicFormComponent } from './test/dynamic-form.component';
import { DynamicFormQuestionComponent } from './test/dynamic-form-question.component';
import { LoginComponent } from './login/login.component'
import { DataDrivenComponent } from "./test/data-driven/data-driven.component";
import { UserComponent } from './index/user.component';
import { NewsComponent } from './index/news.component'

import { AuthGuard } from "./services/auth-guard.service";

import { MomentModule } from 'angular2-moment';
import { MyTimePipe } from './time.pipe';
import { CookieService } from "angular2-cookie/services/cookies.service";
import { NgProgressModule } from 'ng2-progressbar';
import { LoadingAnimateModule, LoadingAnimateService } from 'ng2-loading-animate';


@NgModule({
    declarations: [
        AppComponent,
        ChatComponent,
        RoomComponent,
        RegisterComponent,
        DynamicFormComponent,
        DynamicFormQuestionComponent,
        LoginComponent,
        DataDrivenComponent,
        UserComponent,
        MyTimePipe,
        NewsComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        ReactiveFormsModule,
        MomentModule,
        NgProgressModule,
        LoadingAnimateModule.forRoot()
    ],
    providers: [LoadingAnimateService, AuthGuard, CookieService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

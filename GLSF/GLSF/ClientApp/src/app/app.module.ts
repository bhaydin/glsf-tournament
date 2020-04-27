import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { WebcamModule } from 'ngx-webcam';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { DataEntryComponent } from './dataEntry/dataEntry.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CameraDialog } from './dataEntry/camera';
import { CreateTournamentComponent } from './createTournament/createTournament.component'
import { CreateBoatComponent } from './createBoat/createBoat.component'
import { CreateStationComponent } from './createStation/createStation.component'
import { CheckInComponent } from './checkIn/checkIn.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { EditFishDialog } from './home/editFish';
import { DatePipe } from '@angular/common';
import { AuthGuard, AdminGuard } from './_helpers/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    DataEntryComponent,
    MenuComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
	  CameraDialog,
	  CreateTournamentComponent,
	  CreateBoatComponent,
	  CreateStationComponent,
	  CameraDialog,
	  EditFishDialog,
	  CreateTournamentComponent,
	  CreateBoatComponent,
		CreateStationComponent,
		CheckInComponent,
  ],
    imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
		WebcamModule,
    FormsModule,
    ReactiveFormsModule,
		MaterialModule,
    NgxMaterialTimepickerModule,
    RouterModule.forRoot([
    { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
		{ path: 'data_entry', component: DataEntryComponent, canActivate: [AdminGuard] },
		{ path: 'tournament', component: CreateTournamentComponent, canActivate: [AdminGuard] },
		{ path: 'boat', component: CreateBoatComponent, canActivate: [AdminGuard] },
		{ path: 'station', component: CreateStationComponent, canActivate: [AdminGuard] },
		{ path: 'checkIn', component: CheckInComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    ],
        { onSameUrlNavigation: 'reload' })
	],
	entryComponents: [
		CameraDialog,
		EditFishDialog,
	],
	providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
	bootstrap: [AppComponent]
})
export class AppModule {}


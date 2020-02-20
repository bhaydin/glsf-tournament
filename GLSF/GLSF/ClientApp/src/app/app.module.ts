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
import { TournamentsComponent } from './tournamentInfo/tournaments.component';
import { CameraDialog } from './dataEntry/camera';
import { CreateTournamentComponent } from './createTournament/createTournament.component'
import { CreateBoatComponent } from './createBoat/createBoat.component'
import { CreateStationComponent } from './createStation/createStation.component'
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
<<<<<<< HEAD
import { Requests } from './http/Requests';

=======
import { EditFishDialog } from './home/editFish';
import { DatePipe } from '@angular/common';
>>>>>>> origin/unverifiedTable

// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { AuthGuard } from './_helpers';

@NgModule({
  declarations: [
    AppComponent,
    DataEntryComponent,
    MenuComponent,
    HomeComponent,
    TournamentsComponent,
    LoginComponent,
<<<<<<< HEAD
    RegisterComponent,
	CameraDialog,
	CreateTournamentComponent,
	CreateBoatComponent,
	CreateStationComponent,
=======
		CameraDialog,
		EditFishDialog,
		CreateTournamentComponent,
		CreateBoatComponent,
		CreateStationComponent,
>>>>>>> origin/unverifiedTable
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
		{ path: 'data_entry', component: DataEntryComponent, canActivate: [AuthGuard] },
		{ path: 'tournaments', component: TournamentsComponent, canActivate: [AuthGuard] },
		{ path: 'tournament', component: CreateTournamentComponent, canActivate: [AuthGuard] },
		{ path: 'boat', component: CreateBoatComponent, canActivate: [AuthGuard] },
		{ path: 'station', component: CreateStationComponent, canActivate: [AuthGuard] },
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

    // provider used to create fake backend
    // fakeBackendProvider

  ],
	bootstrap: [AppComponent]
})
export class AppModule {}


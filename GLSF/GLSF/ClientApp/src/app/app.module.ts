import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DataEntryComponent } from './dataEntry/dataEntry.component';
import { UnverifiedDataComponent } from './unverifiedData/unverifiedData.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { TournamentsComponent } from './tournamentInfo/tournaments.component';
import { WebcamModule } from 'ngx-webcam';
import { MaterialModule } from './material.module';
import { CameraDialog } from './dataEntry/camera';
import { CreateTournamentComponent } from './createTournament/createTournament.component'
import { CreateBoatComponent } from './createBoat/createBoat.component'
import { CreateStationComponent } from './createStation/createStation.component'
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { Requests } from './http/Requests'


// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { AuthGuard } from './_helpers';



@NgModule({
  declarations: [
    AppComponent,
    DataEntryComponent,
    UnverifiedDataComponent,
    MenuComponent,
    HomeComponent,
    TournamentsComponent,
    LoginComponent,
		CameraDialog,
		CreateTournamentComponent,
		CreateBoatComponent,
		CreateStationComponent,
  ],
    imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
		WebcamModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forRoot([
    { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'unverifiedData', component: UnverifiedDataComponent, pathMatch: 'full', canActivate: [AuthGuard] },
		{ path: 'data_entry', component: DataEntryComponent, canActivate: [AuthGuard] },
		{ path: 'tournaments', component: TournamentsComponent, canActivate: [AuthGuard] },
		{ path: 'tournament', component: CreateTournamentComponent, canActivate: [AuthGuard] },
		{ path: 'boat', component: CreateBoatComponent, canActivate: [AuthGuard] },
		{ path: 'station', component: CreateStationComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent}
    ],
        { onSameUrlNavigation: 'reload' })
	],
	entryComponents: [CameraDialog],
	providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider

  ],
	bootstrap: [AppComponent]
})
export class AppModule {}


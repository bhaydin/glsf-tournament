import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DataEntryComponent } from './dataEntry/dataEntry.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { TournamentsComponent } from './tournamentInfo/tournaments.component';
import { WebcamModule } from 'ngx-webcam';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { CameraDialog } from './dataEntry/camera';
import { CreationPageComponent } from './createPage/creationPage.component'
import { CreateTournamentComponent } from './createPage/createTournament/createTournament.component'
import { CreateGroupComponent } from './createPage/createGroup/createGroup.component'
import { ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';



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
		CameraDialog,
		CreationPageComponent,
		CreateTournamentComponent,
    CreateGroupComponent,
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
		{ path: 'data_entry', component: DataEntryComponent, canActivate: [AuthGuard] },
		{ path: 'tournaments', component: TournamentsComponent, canActivate: [AuthGuard] },
    { path: 'create', component: CreationPageComponent, canActivate: [AuthGuard] },
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


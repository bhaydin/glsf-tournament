import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DataEntryComponent } from './dataEntry/dataEntry.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { WebcamModule } from 'ngx-webcam';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { CameraDialog } from './dataEntry/camera';

@NgModule({
  declarations: [
    AppComponent,
    DataEntryComponent,
    MenuComponent,
    HomeComponent,
		TournamentsComponent,
		CameraDialog,
  ],
    imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
		WebcamModule,
		FormsModule,
    MaterialModule,
    RouterModule.forRoot([
		{ path: '', component: HomeComponent, pathMatch: 'full' },
		{ path: 'data_entry', component: DataEntryComponent },
    { path: 'tournaments', component: TournamentsComponent },
    ],
        { onSameUrlNavigation: 'reload' })
	],
	entryComponents: [CameraDialog],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}


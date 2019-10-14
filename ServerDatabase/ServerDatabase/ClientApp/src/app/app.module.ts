import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DpDatePickerModule } from 'ng2-date-picker';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { WebsiteComponent } from './website/website.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { TournamentsComponent } from './tournaments/tournaments.component';

@NgModule({
  declarations: [
    AppComponent,
    WebsiteComponent,
    MenuComponent,
    HomeComponent,
    TournamentsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FormsModule,
    DpDatePickerModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'data', component: WebsiteComponent },
      { path: 'tournaments', component: TournamentsComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

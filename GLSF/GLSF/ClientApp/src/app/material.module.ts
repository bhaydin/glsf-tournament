import { NgModule } from '@angular/core';
import { MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
@NgModule({
	imports: [
		MatDatepickerModule,
		MatCheckboxModule,
		MatSelectModule,
		MatFormFieldModule,
		MatNativeDateModule,
		MatInputModule,
		BrowserAnimationsModule
	],
	exports: [
		MatDatepickerModule,
		MatCheckboxModule,
		MatSelectModule,
		MatFormFieldModule,
		MatNativeDateModule,
		MatInputModule,
		BrowserAnimationsModule
	],
	providers: [
		MatDatepickerModule,
		MatCheckboxModule,
		MatSelectModule
  ],
})

export class MaterialModule { }

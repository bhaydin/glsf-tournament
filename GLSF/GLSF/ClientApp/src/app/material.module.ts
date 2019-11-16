import { NgModule } from '@angular/core';
import { MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatCheckboxModule, MatSelectModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	imports: [
		MatDatepickerModule,
		MatCheckboxModule,
		MatSelectModule,
		MatFormFieldModule,
		MatNativeDateModule,
		MatInputModule,
		BrowserAnimationsModule,
	],
	exports: [
		MatDatepickerModule,
		MatCheckboxModule,
		MatSelectModule,
		MatFormFieldModule,
		MatNativeDateModule,
		MatInputModule,
		BrowserAnimationsModule,
	],
	providers: [
		MatDatepickerModule,
		MatCheckboxModule,
		MatSelectModule
  ],
})

export class MaterialModule { }

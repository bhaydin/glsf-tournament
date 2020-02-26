import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WebcamUtil, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';

export interface DialogData {
	base64: string;
}

@Component({
	selector: 'app-camera',
	templateUrl: './camera.html',
	styleUrls: ['./camera.css']
})


export class CameraDialog implements OnInit {
	noOtherWebcam = false;
	showRetry = false;
	toggleWebcam = true;
	previewed = false;
	base64: string = '';
	cycleWebcam: boolean;
	private triggerSubject: Subject<void> = new Subject<void>();
	private nextWebcamSubject: Subject<boolean | string> = new Subject<boolean | string>();


	constructor( public dialogRef: MatDialogRef<CameraDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

	ngOnInit() {
	  WebcamUtil.getAvailableVideoInputs()
		.then((mediaDevices: MediaDeviceInfo[]) => {
			this.noOtherWebcam = mediaDevices && mediaDevices.length > 1;
		});
	}

	retakeImage() {
		this.previewed = false;
		this.base64 = '';
	}

	takePicture() {
		this.triggerSubject.next();
	}

	swapCamera() {
		this.nextWebcamSubject.next();
	}
    
	get triggerObservable() {
		return this.triggerSubject.asObservable();
	}

	get webcamObservable() {
		return this.nextWebcamSubject.asObservable();
	}

	onNoClick() {
		this.dialogRef.close();
	}

	displayImage(image) {
		this.base64 = image.imageAsDataUrl;
		this.previewed = true;
	}

  handleInitError(error: WebcamInitError) {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
		  this.showRetry = true;
    }
	}

	onSaveImage() {
		this.dialogRef.close(this.base64);
	}
}

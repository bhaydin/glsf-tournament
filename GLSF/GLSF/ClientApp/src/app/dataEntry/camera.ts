import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WebcamUtil, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';

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


	constructor(public dialogRef: MatDialogRef<CameraDialog>, @Inject(MAT_DIALOG_DATA) data) {
		this.base64 = data;
	}

  //Looks to check if the device has more than one webcam
	ngOnInit() {
	  WebcamUtil.getAvailableVideoInputs()
		.then((mediaDevices: MediaDeviceInfo[]) => {
			this.noOtherWebcam = mediaDevices && mediaDevices.length > 1;
		});
	}

  //Deletes image selected
	retakeImage() {
		this.previewed = false;
		this.base64 = '';
	}

  //Takes a picture of current webcam
	takePicture() {
		this.triggerSubject.next();
	}

  //Changes camera visible
	swapCamera() {
		this.nextWebcamSubject.next();
	}

  //Takes a picture
	get triggerObservable() {
		return this.triggerSubject.asObservable();
	}

  //Switches webcam
	get webcamObservable() {
		return this.nextWebcamSubject.asObservable();
	}

  //Closes webcam dialogue and removes picture
	onNoClick() {
		this.dialogRef.close();
	}

  //Displays newly taken picture
	displayImage(image) {
		this.base64 = image.imageAsDataUrl;
		this.previewed = true;
	}

  //If there are no webcams do this
  handleInitError(error: WebcamInitError) {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
		  this.showRetry = true;
    }
	}

  //Saves image
	onSaveImage() {
		this.dialogRef.close(this.base64);
	}
}

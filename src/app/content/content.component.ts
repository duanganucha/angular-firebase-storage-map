import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'firebase';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  servertime = firebase.database.ServerValue.TIMESTAMP;

  position: Position = {
    latitude: 13.0390905,
    longitude: 101.490104,
    zoom: 6
  }


  ngOnInit() {
    this.resetform();
  }
  setCurrentPosition() {
    if (navigator.geolocation) {
      console.log(" connect GEO")
      navigator.geolocation.getCurrentPosition((position) => {
        this.position.latitude = position.coords.latitude;
        this.position.longitude = position.coords.longitude;
        this.position.zoom = 6;
      });
    } else {
      console.log("Cannot to connect GEO")
    }
  }

  items: Observable<any>;

  student: Student = new Student(
  );
  // Main task 
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;

  // State for dropzone CSS toggling
  isUploaded: boolean = false;

  isEdit: boolean = false;

  constructor(private storage: AngularFireStorage, private db: AngularFireDatabase,
  ) {
    this.items = db.list('/students', ref => ref.orderByChild('timestamp')).snapshotChanges().map(result => {
      return result.reverse();
    })
  }


  startUpload(event: FileList) {
    var starttime = Date.now();
    // The File object
    const file = event.item(0)

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ')
      return;
    }

    // The storage path
    const path = `upload/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'EMS 3d !' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata })

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(snap => {
        console.log(snap)
        // if (snap.bytesTransferred = snap.totalBytes) {
        // Update firestore on completion
        // this.db.collection('photos').add( { path, size: snap.totalBytes })
        this.downloadURL.subscribe((url) => {
          this.student.imageUrl = url.toString();
          this.student.imageName = path;
          this.isUploaded = true;
          console.log(` "image URl ": ${this.student.imageUrl}`);

          var endtime = Date.now();
          var timetotal = Math.abs(starttime - endtime);
          console.log("Total time milisec :" + timetotal);

          this.student.timetotal = timetotal;
        })
        // }

      })
    )

    // The file's download URL
    this.downloadURL = this.task.downloadURL();
  }
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }

  onClickDelete(item) {
    console.log("key : " + JSON.stringify(item));
    let itemRef = this.db.list('students');
    itemRef.remove(item.key);
    var desertRer = this.storage.ref(item.payload.val().imageName);

    desertRer.delete().subscribe(() => {
      console.log("deleted");
    })
  }

  key : String;
  onClickEdit(item) {
    //Show Data
    
    this.key = item.key;

    this.isEdit = true;
    this.isUploaded = true;

    this.student.firstname = item.payload.val().firstname;
    this.student.lastname = item.payload.val().lastname;
    this.student.tel = item.payload.val().tel;
    this.student.course = item.payload.val().course;
    this.position.latitude = item.payload.val().latitude;
    this.position.longitude = item.payload.val().longitude;

  }
  onClickChange(item) {

    item.key = this.key
    
    let itemRef = this.db.list('students');
    // itemRef.update(item.key, { payment: "Paid" });

    itemRef.update(item.key, {
      firstname: this.student.firstname, 
      lastname: this.student.lastname,
      tel: this.student.tel,
      course: this.student.course ,
      latitude: this.position.latitude, 
      longitude: this.position.longitude
    });

    this.isEdit = false;
    this.resetform();
  
  }



  onClickSubmit() {
    // this.student.servertime = this.servertime
    this.student.latitude = this.position.latitude;
    this.student.longitude = this.position.longitude;
    this.student.servertime = firebase.database.ServerValue.TIMESTAMP;
    let itemRef = this.db.list('students');
    itemRef.push(this.student);

    //Reset 
    this.resetform();

  }

  resetform(){
    this.isUploaded = false;
    this.snapshot = null;
    this.percentage = null;
    this.student.firstname = "";
    this.student.lastname = "";
    this.student.tel = "";
    this.student.imageUrl = "";
    this.student.course = "";
    this.position.latitude = null;
    this.position.longitude = null;
  }

  onClickPayment(item) {
    
    let itemRef = this.db.list('students');
    itemRef.update(item.key, { servertime: this.servertime });
  }
}

class Student {
  position: Position;
  firstname = "";
  lastname = "";
  tel = "";
  course = "";
  imageName = ""
  imageUrl = "";
  payment = "Waiting";
  clienttime = Date.now();
  servertime :any;
  timetotal: Number;
  latitude: Number;
  longitude: Number;

}

class Position {
  latitude: Number;
  longitude: Number;
  zoom: Number;
}

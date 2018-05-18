import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  items: Observable<any>;



  
  position : Position =  {
    latitude: 13.0390905,
    longitude: 101.490104,
    zoom:10
  }
  constructor( private db: AngularFireDatabase) {
    this.items = db.list('/positions', ref => ref.orderByChild('timestamp')).snapshotChanges().map(result => {
      return result.reverse();
    })
  }
  ngOnInit() {

  
  }

  onClickSubmit() {
    this.position.latitude = this.position.latitude;
    this.position.longitude = this.position.longitude;

    let itemRef = this.db.list('positions');
    itemRef.push(this.position);
  }
}

class Position {
  latitude : Number;
  longitude : Number ;
  zoom : Number;
}

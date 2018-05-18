import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { FileSizePipe } from './file-size.pipe';

import { AgmCoreModule } from '@agm/core';
import { MapComponent } from './map/map.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    FileSizePipe,
    MapComponent
  ],
  imports: [
    BrowserModule,FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCF3aH2Bk1v1-AOIaeDWFXzfsNjK0dh558'
    })
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

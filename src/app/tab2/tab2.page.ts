import { Component } from '@angular/core';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private fb: Facebook) {}

  logout() {

  }
}

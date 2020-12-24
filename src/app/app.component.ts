import { Component } from '@angular/core';

import {NavController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,private navController:NavController,
    private router:Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(localStorage.getItem('userCredentialS')!== null) {
        console.log('userpresent')
        this.router.navigateByUrl('/alltabs/tabs/tab1');
      } else
        {
          this.router.navigateByUrl('/');

      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

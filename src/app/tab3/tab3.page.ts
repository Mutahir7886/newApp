import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private router:Router) {}

    logout() {
    console.log('logout')
      localStorage.removeItem('userCredentialS')
      localStorage.removeItem('userFriends')
      localStorage.removeItem('profileToken')
      localStorage.removeItem('userData')
      this.router.navigateByUrl('');
    }
}

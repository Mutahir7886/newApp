import { Component } from '@angular/core';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {apiUrls} from "../../environments/apis/api.urls";
import {HttpService} from "../../shared/services/http.service";
import {ModalController} from "@ionic/angular";
import {ModalPageComponent} from "./modal-page/modal-page.component";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  myUserId = JSON.parse(localStorage.getItem('userData'))._id
  groupList:any =[];
  friendList:any =[]


  constructor(private fb: Facebook,
              private httpService:HttpService,
              public modalController: ModalController) {

    this.httpService.get(apiUrls.Groups + this.myUserId + '/group-list').subscribe(data => {
      console.log('data from getGroups api', data)
      this.groupList=data
    }, error => {
      console.log('error in query api', error)
    });

    this.httpService.get(apiUrls.userFriends + this.myUserId + '/friend-list').subscribe(data => {
      console.log('data from userFriends api', data)
      this.friendList = data.friends

    }, error => {
      console.log('error in query api', error)

    })

  }

  fetchGroupData(){
    this.httpService.get(apiUrls.Groups + this.myUserId + '/group-list').subscribe(data => {
      console.log('data from getGroups api', data)
      this.groupList=data
    }, error => {
      console.log('error in query api', error)
    });
  }
  ionViewDidEnter(){
    this.fetchGroupData()
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPageComponent,
      componentProps: {
        'friendList':this.friendList,
      }
    });
    await modal.present();

    await modal.onDidDismiss().then((res: any) => {
      this.fetchGroupData()
    });
  }
  createGroup() {
    this.presentModal();
  }

  deleteGroup(indexToDelete,item) {
    console.log('group list before delete',this.groupList)
    console.log('group item',item)
    console.log('group item',this.myUserId)
    this.groupList.splice(indexToDelete,1)
    console.log('group delete after delete',this.groupList)
  }

  checkForAdmin(group) {
   for (let participant of group.participants){
     if (participant.user_details._id==this.myUserId){
       if(participant.is_admin==true){
         return true
       }
     }
   }
   return false
  }

  leaveGroup() {

  }
}

import {Component} from '@angular/core';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {apiUrls} from "../../environments/apis/api.urls";
import {HttpService} from "../../shared/services/http.service";
import {ModalController} from "@ionic/angular";
import {ModalPageComponent} from "./modal-page/modal-page.component";
import {cloneDeep} from 'lodash';
import {Router} from "@angular/router";

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

    myUserId = JSON.parse(localStorage.getItem('userData'))._id
    groupList: any = [];
    friendList: any = []
    showGroups = false;


    constructor(private fb: Facebook,
                private httpService: HttpService,
                public modalController: ModalController,
                private router: Router) {

        this.fetchGroupData()
        this.fetchFriendsData()
        //here add friendlist=localstoroge


    }


    fetchGroupData() {
        this.httpService.get(apiUrls.Groups + this.myUserId + '/group-list').subscribe(data => {
            console.log('data from getGroups api', data)
            this.groupList = data
        }, error => {
            console.log('error in query api', error)
        });
    }

    fetchFriendsData() {
        this.httpService.get(apiUrls.userFriends + this.myUserId + '/friend-list').subscribe(data => {
            console.log('data from userFriends api', data)
            this.friendList = data.friends
        }, error => {
            console.log('error in query api', error)
        })
    }

    ionViewDidEnter() {
        this.fetchGroupData()
        this.fetchFriendsData()
    }

    async presentModal() {
        const friendList = cloneDeep(this.friendList)
        const modal = await this.modalController.create({
            component: ModalPageComponent,
            componentProps: {
                'friendList': friendList,
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

    deleteGroup(indexToDelete, groupId) {
        console.log('group list before delete', this.groupList)
        console.log('group Id', groupId)
        console.log('group item', this.myUserId)
        this.httpService.delete(apiUrls.Groups + groupId + '/' + this.myUserId).subscribe(data => {
            console.log('success on delete group', data)
            this.groupList.splice(indexToDelete, 1)

        }, error => {
            console.log('fail on delete group', error)

        })
        console.log('group delete after delete', this.groupList)
    }

    checkForAdmin(group) {
        for (let participant of group.participants) {
            if (participant.user_details._id == this.myUserId) {
                if (participant.is_admin == true) {
                    return true
                }
            }
        }
        return false
    }

    leaveGroup(indexToChange, groupId) {
        this.httpService.put(apiUrls.Groups + groupId + '/' + this.myUserId + '/leave-group', {}).subscribe(data => {
            console.log('success on delete group', data)
            this.groupList.splice(indexToChange, 1)


        }, error => {
            console.log('fail on delete group', error)

        })
    }

    showDetails(grpDetails) {
        const grpId = grpDetails._id
        this.router.navigate(['details/' + grpId]);
    }
}

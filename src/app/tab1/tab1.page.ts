import {Component} from '@angular/core';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Uid} from "@ionic-native/uid/ngx";
import {Device} from '@ionic-native/device/ngx';
import {apiUrls} from "../../environments/apis/api.urls";
import {HttpService} from "../../shared/services/http.service";

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    // user_login: any = {};
    // UserImage: any;
    // private gotUserImage: boolean = false;
    userFriends: any;
    querySearch: any;
    myId = JSON.parse(localStorage.getItem('userData'))._id
    searchResults: any
    showFriends=false;

    constructor(private fb: Facebook,
                private uid: Uid,
                private androidPermissions: AndroidPermissions,
                private device: Device,
                private httpService: HttpService
    ) {
        if (localStorage.getItem('userFriends')) {
            console.log('setting user Friends from Local storage')
            this.userFriends = JSON.parse(localStorage.getItem('userFriends'))
            console.log(this.userFriends)
        }
       this.fetchFriendData();


    }

    fetchFriendData(){
        this.httpService.get(apiUrls.userFriends + this.myId + '/friend-list').subscribe(data => {
            console.log('data from userFriends api', data)
            this.userFriends = data.friends
            localStorage.setItem('userFriends', JSON.stringify(data.friends))
            console.log('userFriends',this.userFriends)
        }, error => {
            console.log('error in query api', error)

        })
    }

    ionViewWillEnter(){
        this.fetchFriendData()
    }
    ionViewDidLeave() {
        this.querySearch = ''
        this.searchResults = null
    }

    searchFriends() {
        console.log(this.myId)
        console.log(this.querySearch)
        console.log(apiUrls.searchUser)
        this.httpService.get(apiUrls.searchUser + this.myId + '/search?term=' + this.querySearch).subscribe(data => {
            console.log('all users with query', data)
            this.searchResults = data.rows
            console.log('searchResults', this.searchResults)
        }, error => {
            console.log('error in query api', error)

        })
    }

    isFriend(username: string) {
        for (let friend of this.userFriends) {
            if (friend.friend_details.username === username) {
                return true;
            }
        }
        return false;
    }

    addFriend(FriendFbID, friendID) {
        this.httpService.post(apiUrls.addFriends + this.myId + '/add-friend', {
            friend_id: friendID,
            fb_id: FriendFbID,
            type: 1
        }).subscribe(data => {
            console.log('data from add friend api', data)
            console.log('this.userFriends before adding this', this.userFriends)
            this.userFriends.push(data)
            console.log('this.userFriends after adding this', this.userFriends)
            localStorage.setItem('userFriends', JSON.stringify(this.userFriends))


            // this.router.navigate(['alltabs/tabs/tab1']);
        }, error => {
            console.log(error)

        });

    }

    userEnteredSearch($event: Event) {
        console.log($event['data']);
        if($event['data']){
            this.searchResults = null;
        }
    }
}


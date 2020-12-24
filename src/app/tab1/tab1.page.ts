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
        this.httpService.get(apiUrls.userFriends + this.myId + '/friend-list').subscribe(data => {
            console.log('data from userFriends api', data)
            this.userFriends = data.friends
            localStorage.setItem('userFriends', JSON.stringify(data.friends))


        }, error => {
            console.log('error in query api', error)

        })


    }

    ionViewDidLeave() {
        this.querySearch = ''
        this.searchResults = null
    }

    // login() {
    //     console.log('234')
    //     // console.log('Device UUID is: ' + this.device.uuid);
    //     this.facebookLogin()
    //
    // }
    //
    // async facebookLogin() {
    //
    //     this.fb.login(['public_profile', 'email', 'user_friends'])
    //         .then(res => {
    //             this.fb.api('/' + res.authResponse.userID + '/?fields=id,email,name', [])
    //                 .then(userCredentials => {
    //                     this.fb.api('/' + res.authResponse.userID + '/?fields=picture.width(200).height(200)', [])
    //                         .then(userPicture => {
    //                             this.user_login.deviceid=this.device.uuid
    //                             this.user_login.authResponse = res
    //                             this.user_login.email = userCredentials.email
    //                             this.user_login.id = userCredentials.id;
    //                             this.user_login.name = userCredentials.name;
    //                             this.user_login.picture_url = userPicture.picture.data.url;
    //                             console.log('data to pass',this.user_login)
    //                             this.getFriends(res.authResponse.userID)
    //
    //                         })
    //                         .catch(e => {
    //                             console.log(e, 'error');
    //                         });
    //                 })
    //                 .catch(e => {
    //                     console.log(e, 'error');
    //                 });
    //         })
    //         .catch(e => {
    //             console.log('Error logging into Facebook', e)
    //         });
    //
    // }
    //
    // getUserDetailFromFB(userid: any) {
    //     this.fb.api('/' + userid + '/?fields=id,email,name', [])
    //         .then(res => {
    //             console.log(res, 'public_profile');
    //             // this.user_login.email=res.email;
    //             // this.user_login.id=res.id;
    //             // this.user_login.name=res.name;
    //             // console.log(this.user_login, 'user_login');
    //             let name = res.name.split(' ');
    //         })
    //         .catch(e => {
    //             console.log(e, 'error');
    //         });
    // }
    //
    // getUserProfilePicFB(userid: any) {
    //     this.fb.api('/' + userid + '/?fields=picture.width(200).height(200)', [])
    //         .then(res => {
    //             console.log(res, 'user_picture');
    //             this.UserImage = res.picture.data.url;
    //             console.log(this.UserImage, 'user_picture');
    //
    //             // this.user_login.picture_url=res.picture.data.url;
    //             // console.log(this.user_login, 'user_login');
    //
    //         })
    //         .catch(e => {
    //             console.log(e, 'error');
    //         });
    // }
    //
    // getFriends(userid: any) {
    //     this.fb.api('/' + userid + '/friends', [])
    //         .then(res => {
    //             console.log(res, 'friends of this user');
    //         })
    //         .catch(e => {
    //             console.log(e, 'error');
    //         });
    // }


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
}


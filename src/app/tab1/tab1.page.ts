import {Component} from '@angular/core';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {UniqueDeviceID} from '@ionic-native/unique-device-id/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Uid} from "@ionic-native/uid/ngx";
import {Device} from '@ionic-native/device/ngx';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    // user_login:any ={};
    UserImage: any;
    private gotUserImage: boolean =false;

    constructor(private fb: Facebook,
                private uid: Uid,
                private androidPermissions: AndroidPermissions,
                private device: Device
    ) {


    }

    login() {
        console.log('234')
        console.log('Device UUID is: ' + this.device.uuid);
        this.facebookLogin()

    }

    async facebookLogin() {

        this.fb.login(['public_profile', 'email', 'user_friends'])
            .then(res => {
                console.log(res);
                this.getUserDetailFromFB(res.authResponse.userID);
                this.getUserProfilePicFB(res.authResponse.userID);
                this.getFriends(res.authResponse.userID);
            })
            .catch(e => {
                console.log('Error logging into Facebook', e)
            });

    }

    getUserDetailFromFB(userid: any) {
        this.fb.api('/' + userid + '/?fields=id,email,name', [])
            .then(res => {
                console.log(res, 'public_profile');
                // this.user_login.email=res.email;
                // this.user_login.id=res.id;
                // this.user_login.name=res.name;
                // console.log(this.user_login, 'user_login');
                let name = res.name.split(' ');
            })
            .catch(e => {
                console.log(e, 'error');
            });
    }

    getUserProfilePicFB(userid: any) {
        this.fb.api('/' + userid + '/?fields=picture.width(200).height(200)', [])
            .then(res => {
                console.log(res, 'user_picture');
                this.UserImage = res.picture.data.url;
                console.log(this.UserImage, 'user_picture');

                // this.user_login.picture_url=res.picture.data.url;
                // console.log(this.user_login, 'user_login');

            })
            .catch(e => {
                console.log(e, 'error');
            });
    }

    getFriends(userid: any) {
        this.fb.api('/' + userid + '/friends', [])
            .then(res => {
                console.log(res, 'friends');
            })
            .catch(e => {
                console.log(e, 'error');
            });
    }


}

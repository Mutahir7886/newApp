import {Component, OnInit} from '@angular/core';
import {Facebook} from "@ionic-native/facebook/ngx";
import {Uid} from "@ionic-native/uid/ngx";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";
import {Device} from "@ionic-native/device/ngx";
import {NavController} from "@ionic/angular";
import {Router} from "@angular/router";
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../../shared/services/http.service";

@Component({
    selector: 'app-login-fb',
    templateUrl: './login-fb.component.html',
    styleUrls: ['./login-fb.component.scss'],
})
export class LoginFbComponent implements OnInit {
    user_login: any = {};
    UserImage: any;
    userFriends:any =[];
    loader=false
    private gotUserImage: boolean = false;

    constructor(private fb: Facebook,
                private uid: Uid,
                private androidPermissions: AndroidPermissions,
                private device: Device,
                private router: Router,
                private httpService:HttpService) {
    }

    ngOnInit() {
    }

    login() {
        console.log('234')
        this.facebookLogin()

    }

    async facebookLogin() {

        this.fb.login(['public_profile', 'email', 'user_friends'])
            .then(res => {
                this.loader=true
                this.fb.api('/' + res.authResponse.userID + '/?fields=id,email,name', [])
                    .then(userCredentials => {
                        this.fb.api('/' + res.authResponse.userID + '/?fields=picture.width(200).height(200)', [])
                            .then(userPicture => {
                                this.fb.api('/' + res.authResponse.userID + '/friends', [])
                                    .then(userFriends => {
                                        console.log(userFriends)
                                        userFriends.data.forEach(value=>{
                                            this.userFriends.push(value.id)
                                        })
                                        console.log('userfirends',this.userFriends)
                                        this.httpService.post(apiUrls.signUp, {
                                            fb_id:userCredentials.id,
                                            name: userCredentials.name,
                                            email: userCredentials.email,
                                            profileType: 0,
                                            profile:userPicture.picture.data.url,
                                            device_token:this.device.uuid,
                                            friends:this.userFriends
                                        }).subscribe(data => {
                                            this.loader=false
                                            if(data.device){
                                                // redirect to homepage
                                                localStorage.setItem('userData', JSON.stringify(data.user))
                                                localStorage.setItem('profileToken', JSON.stringify(data.device.auth_token))
                                                localStorage.setItem('userFriends', JSON.stringify(data.user.friends))
                                                localStorage.setItem('userCredentialS', res.authResponse.userID)

                                                this.router.navigate(['alltabs/tabs/tab2']);
                                                console.log('already present user',data)
                                            }
                                            else {
                                                // redirect to profile-setup
                                                console.log(data)
                                                localStorage.setItem('userData', JSON.stringify(data))
                                                localStorage.setItem('userFriends', JSON.stringify(data.friends))
                                                localStorage.setItem('userCredentialS', res.authResponse.userID)
                                                this.router.navigate(['/loginPage']);
                                                console.log(data)
                                            }
                                        }, error => {
                                            this.loader=false
                                            this.userFriends=[]
                                            console.log('a', error)

                                        });
                                    })
                                    .catch(e => {
                                        console.log(e, 'error');
                                    });

                            })
                            .catch(e => {
                                console.log(e, 'error');
                            });
                    })
                    .catch(e => {
                        console.log(e, 'error');
                    });
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
                console.log(res, 'friends of this user');
            })
            .catch(e => {
                console.log(e, 'error');
            });
    }

}

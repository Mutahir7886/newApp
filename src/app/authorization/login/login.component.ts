import {Component, OnInit} from '@angular/core';
import {NavController} from "@ionic/angular";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../../../shared/services/http.service";
import {apiUrls} from "../../../environments/apis/api.urls";
import {Device} from "@ionic-native/device/ngx";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    formGroup: FormGroup;
    email:string;
    device_token:string;
    name:string;
    userId:string;

    constructor(private router: Router,
                private navController: NavController,
                private formBuilder: FormBuilder,
                private httpService: HttpService,
                private device: Device) {
        this.formGroup = this.formBuilder.group({
            username: ['', [Validators.required,]],
        });
    }

    ngOnInit() {
        this.email = JSON.parse(localStorage.getItem('userData')).email
        this.device_token = this.device.uuid
        this.name = JSON.parse(localStorage.getItem('userData')).name
        this.userId = JSON.parse(localStorage.getItem('userData'))._id
        console.log(this.email)
        console.log(this.device_token)
        console.log(this.name)
        console.log(this.username.value)
    }

    get username(): FormControl {
        return this.formGroup.get('username') as FormControl;
    }

    login(formGroup) {
        console.log('qwe',this.username.value)
        this.httpService.post(apiUrls.profileSetup + this.userId + '/profile-setup', {
            email: this.email,
            username: this.username.value,
            device_token: this.device_token
        }).subscribe(data => {
            console.log('Profile set',data)
            localStorage.setItem('profileToken', JSON.stringify(data.device.auth_token))
            localStorage.setItem('userFriends', JSON.stringify(data.user.friends))
            this.router.navigate(['alltabs/tabs/tab1']);
        }, error => {
            console.log(error)


        });
        console.log('12311')

    }

}

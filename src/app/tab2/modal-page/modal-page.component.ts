import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../../shared/services/http.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {filter as LodashFilter} from 'lodash';

@Component({
    selector: 'app-modal-page',
    templateUrl: './modal-page.component.html',
    styleUrls: ['./modal-page.component.scss'],
})
export class ModalPageComponent implements OnInit {
    friendListInModal: any = [];
    groupName: string='';
    participants: any = [];
    myUserId = JSON.parse(localStorage.getItem('userData'))._id
    searchFriendForm: FormGroup;
    dispArray=[];

    constructor(
        private modalCtrl: ModalController,
        private navParams: NavParams,
        private httpService:HttpService,
        private formBuilder: FormBuilder) {
        this.searchFriendForm = this.formBuilder.group({
            Search: [''],
        });
        this.friendListInModal = this.navParams.get('friendList')
        console.log('modal data', this.friendListInModal)
        this.searchFriends()
    }
    ionViewDidLeave() {

        this.participants=[];
        this.groupName='';
    }
    ngOnInit() {
        this.Search.valueChanges
            .pipe(
                debounceTime(500)
            )
            .subscribe((value: string) => {
                console.log(value)
                this.searchFriends(value)
            });
    }

    get Search(): FormControl {
        return this.searchFriendForm.get('Search') as FormControl;
    }
    dismiss() {
        this.participants=[];
        this.groupName=''
        this.modalCtrl.dismiss({
            'dismissed': true
        });
    }

    addParticipants(friendAdded, index) {
        this.dispArray[index].selected = true;
        console.log('friend list', this.dispArray)
        this.participants.push(friendAdded)
        console.log('added participant', this.participants)
    }


    createGroup() {
        let participantToPass:any =[]
        console.log('group name',this.groupName)
        console.log('participants',this.participants)
        for(let eachParticipant of this.participants){
            participantToPass.push({'user_id':eachParticipant.friend_details._id})
        }
        console.log('participantsToPass',participantToPass)

        this.httpService.post(apiUrls.Groups + this.myUserId, {
            name: this.groupName,
            participants: participantToPass,
        }).subscribe(data => {
            this.dismiss()
            console.log('data from create group api', data)
            // this.router.navigate(['alltabs/tabs/tab1']);
        }, error => {
            console.log(error)
        });
    }

     searchFriends(value: string = '') {
        console.log('got value from search',value)
         console.log(this.friendListInModal)
         // let dispArray;
         this.dispArray = LodashFilter(this.friendListInModal, function (o) {
             return o.friend_details.name.toLowerCase().includes(value.toLowerCase());
         });
         console.log('after search',this.dispArray)
         // this.friendListInModal=dispArray

    }
}

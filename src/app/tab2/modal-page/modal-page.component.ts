import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../../shared/services/http.service";

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

    constructor(
        private modalCtrl: ModalController,
        private navParams: NavParams,
        private httpService:HttpService) {
        this.friendListInModal = this.navParams.get('friendList')
        console.log('modal data', this.friendListInModal)
    }
    ionViewDidLeave() {
        for (let element of this.friendListInModal){
            element.selected=false
        }
        this.participants=[];
        this.groupName='';
    }
    ngOnInit() {
    }

    dismiss() {
        // this.friendList=this.navParams.get('friendList')
        for (let element of this.friendListInModal){
            element.selected=false
        }
        this.participants=[];
        this.groupName=''

        this.modalCtrl.dismiss({
            'dismissed': true
        });
    }

    addParticipants(friendAdded, index) {
        console.log('added friend', friendAdded)
        console.log('name of group ', this.groupName)
        console.log('check object', this.friendListInModal[index])
        console.log('check index', index)
        this.friendListInModal[index].selected = true;
        console.log('friend list', this.friendListInModal)
        this.participants.push(friendAdded)
        console.log('added participant', this.participants)
    }

    // checkIfAdded(username) {
    //     for (let friend of this.participants) {
    //         if (friend.username === username) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

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
}

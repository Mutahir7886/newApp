import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {apiUrls} from "../../../environments/apis/api.urls";
import {HttpService} from "../../../shared/services/http.service";

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit {
  myUserId = JSON.parse(localStorage.getItem('userData'))._id
  groupId;
  groudDetail;
  admin;


  constructor(private activatedRoute: ActivatedRoute,
              private httpService: HttpService) {
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.groupId=params.id
      console.log(this.groupId);

    });
  }

  ngOnInit() {
    this.getGroupDetails()
  }

  getGroupDetails(){
    this.httpService.get(apiUrls.Groups + this.groupId +'/' + this.myUserId ).subscribe(data => {
      console.log('detail data from groups', data)
      this.groudDetail=data
    }, error => {
      console.log('error in query api', error)
    });
  }

  checkadmin() {
    for (let item of this.groudDetail.participants)
    {
      if (item.is_admin ==true){
         return item.user_details.name
      }
    }
  }
}

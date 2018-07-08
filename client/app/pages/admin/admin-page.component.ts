import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPage implements OnInit {
    ngOnInit(): void {
        console.log(this.constructor.name);
    }
}

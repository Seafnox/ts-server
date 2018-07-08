import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPage implements OnInit {
    ngOnInit(): void {
        console.log(this.constructor.name);
    }
}

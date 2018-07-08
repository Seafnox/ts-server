import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPage implements OnInit {
    ngOnInit(): void {
        console.log(this.constructor.name);
    }
}

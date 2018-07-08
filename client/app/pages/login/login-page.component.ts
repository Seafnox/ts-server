import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPage implements OnInit {
    ngOnInit(): void {
        console.log(this.constructor.name);
    }
}

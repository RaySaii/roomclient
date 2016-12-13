import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    // encapsulation:ViewEncapsulation.None,
    providers: [LoginService]
})
export class LoginComponent implements OnInit {

    error: string = '';

    user = {
        email_name: '',
        password: ''
    };

    constructor(
        private cookieService: CookieService,
        private router: Router, private route: ActivatedRoute, private loginService: LoginService) {
    }
    ngOnInit() {
        this.cookieService.removeAll();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }


    submit() {
        let user = this.user;
        this.loginService.login(user).subscribe(
            res => {
                let data = res.json().success;
                localStorage.setItem('token', data.id);
                localStorage.setItem('userId', data.userId);

                this.router.navigate(['../room'], { relativeTo: this.route });
            },
            err => {
                this.error = '请重新输入';
                setTimeout(() => this.error = '', 2000);
                console.error(err);
            }
        );
    }

    goRegister() {
        this.router.navigate(['../register'], { relativeTo: this.route });
    }


}

import {Component} from '@angular/core';
import {User} from "../models/user";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {RegisterService} from "../services/register.service";
import {Observable} from "rxjs";
import {Router, ActivatedRoute} from "@angular/router";
import set = Reflect.set;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    providers: [RegisterService]
})
export class RegisterComponent {
    user: User;
    userForm: FormGroup;
    password: string = '';
    emailSend: boolean = false;
    emailError: boolean = false;
    emailNot: boolean = false;

    constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, public registerService: RegisterService) {
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.userForm = this.fb.group({
            'username': ['',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(30),
                ]),
                this.checkUsed.bind(this)
            ],
            'email': ['',
                Validators.compose([
                    Validators.required,
                    Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
                ]),
                this.checkUsed.bind(this)
            ],
            'password': ['', [
                Validators.required,
                Validators.pattern("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$")
            ]],
            'confirm_password': ['', [
                Validators.required,
                this.conPass.bind(this)
            ]]
        })

        this.userForm.valueChanges.subscribe(data => {
            this.onValueChanged(data);
        });
        this.onValueChanged();
        this.userForm.get('password').valueChanges.subscribe(() => {
            let ctrl = this.userForm.get('confirm_password');
            this.userForm.get('password').valid ? ctrl.enable() : ctrl.disable();
        })
    }


    onValueChanged(data?: any) {
        if (!this.userForm) {
            return;
        }
        const form = this.userForm;
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + '';
                }
            }
        }
    }

    formErrors = {
        'username': '',
        'email': '',
        'password': '',
        'confirm_password': '',
    };
    validationMessages = {
        'username': {
            'required': '不能为空',
            'minlength': '必须大于4位',
            'maxlength': '不能超过30位',
        },
        'email': {
            'required': '不能为空',
            'pattern': '邮箱格式不正确',
            // 'isEmail': '格式不正确'
        },
        'password': {
            'required': '不能为空',
            'pattern': '8-16位字母与数字组合'
        },
        'confirm_password': {
            'required': '请确认密码',
            'notmatch': ''
        }
    };

    get value() {
        return JSON.stringify(this.userForm.value);
    }

    submit() {
        this.emailError = this.emailNot = this.emailSend = false;
        this.user = new User(this.userForm.value);
        console.log(1)
        this.registerService.register(this.user).subscribe(
            res => {
            },
            err => {
                console.log(err)
                if (err.status === 500) {
                    this.emailError = true;
                }
                if (err.status === 422) {
                    this.emailNot = true
                }
                return
            }
        )
        this.emailSend = true;
        setTimeout(() => this.router.navigate(['../login'], {relativeTo: this.route}), 1000)
    };

    conPass(c: FormControl) {
        if (c.value === this.password) {
            return null
        }
        else {
            return {notmatch: true}
        }
    }

    checkUsed(c: FormControl): Observable<any|Object> {
        return new Observable((obs: any) => {
            c.valueChanges
                .debounceTime(500)
                .distinctUntilChanged()
                .flatMap(value => value ? this.registerService.checkUsed(value) : Observable.of(0))
                .subscribe(
                    res => {
                        if (res === 0) {
                            obs.next({required: true})
                        } else {
                            res = res.json();
                            if (res.useable)
                                obs.next(null);
                            else
                                obs.next({used: true});
                        }
                        obs.complete();
                    },
                    err => {
                        console.log(err)
                    }
                )
        })
        // return c.valueChanges
        // // .filter(value => value.length >= 4)
        //     .do(value => console.log(value))
        //     .debounceTime(500)
        //     .distinctUntilChanged()
        //     .take(1)
        //     .switchMap(value => {
        //         if (value) {
        //             return this.registerService.checkUsed(value)
        //         }
        //         else {
        //             return Observable.of({required:"true"})
        //         }
        //     })
        //     .map((res) => {
        //         if (res) {
        //             console.log(res)
        //             res = res.json()
        //             if (res.useable)
        //                 return null;
        //             else
        //                 return {used: true}
        //         }
        //     })
        // // }
    }
}



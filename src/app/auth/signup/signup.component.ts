import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
 isLoading = false;
  constructor(private authService: AuthService) { }
  private authStatusSub: Subscription;
  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = authStatus;
      }
    );
  }
  onSignup(form: NgForm){
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email,form.value.password);
    form.resetForm();
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}



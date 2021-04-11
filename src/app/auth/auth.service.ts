import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
const BACKEND_URL = '/api' + '/user/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: String;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }
  createUser(email: string, password: string) {
    const authdata: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + 'signup', authdata).subscribe(
      (response) => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authdata: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + 'login',
        authdata
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration);
            // console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const now = new Date();
      const expiresIn =
        authInformation.expirationDate.getTime() - now.getTime();
      // console.log(authInformation, expiresIn);
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn);
        this.authStatusListener.next(true);
      }
    }
  }

  getAuthData(): any {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
    } else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId,
      };
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }
}

// As during heroku deploy the only node server is delivering
// the angular static pages and also running the backend server
// so there are no need of connecting to localhost:3000/API/POSTS....
//so the backend url is trimmed to only api/user/... or api/post/...

import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public isAuth: Subject<boolean> = new Subject<boolean>( );

  constructor(private auth: Auth) { }

  login(user: User) {
    return signInWithEmailAndPassword(this.auth, user.email, user.password);
  }

    public getIsAuth():Observable<boolean> {
      console.log('Obteniendo estado de autenticación!!!', this.isAuth);

    return this.isAuth.asObservable();
  }

  public cerrarSesion() {
    this.removeToken();
    this.isAuth.next(false);
  }

  public iniciarSesion( token: string ) {
    console.log('Iniciando sesión!!!', this.isAuth);
    this.isAuth.next(true);
    this.setToken(token);
    console.log('Sesión iniciada!!!', this.isAuth);

  }

  public setToken(token: string) {
    localStorage.setItem('token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public removeToken(): void {
    localStorage.removeItem('token');
    
  }

  public isToken(): boolean {
    return !!localStorage.getItem('token');
  }
}

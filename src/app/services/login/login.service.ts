import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  URL_API = 'http://localhost:4000/';

  constructor(private http: HttpClient, private router: Router) { }

  ingresar(usuario: any){
    console.log(usuario)
    return this.http.post<any>(this.URL_API, usuario)
  }

  ingresado(){
    // si el token existe en el localStoreage regresa un true, si no existe un false
    return !!localStorage.getItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }


}

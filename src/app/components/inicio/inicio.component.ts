import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";
import { LoginService } from '../../services/login/login.service'

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  noCoinciden = false;

  constructor(private loginService: LoginService, private router: Router) { }

  usuario = {
    nombreUsuario: '',
    contrasena: '',
    tipoUsuario: ''
  }

  ngOnInit(): void {
  }

  login() {
    this.loginService.ingresar(this.usuario).subscribe(
      res => {
        console.log("usuario valido")
        console.log(res.token)
        console.log(this.usuario);
        localStorage.setItem('token',res.token); // cuando el usuario cierre su sesion debe borrarse esto del localStorage
        localStorage.setItem('tipoUsuario', res.tipoUsuario);

        this.router.navigate(['/mapa-reportes']) 
      },
      err => {
        console.log("usuario NO valido")
        console.error(err);
        this.noCoinciden = true;
      }
      );

  }

  




}

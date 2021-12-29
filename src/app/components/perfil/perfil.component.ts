import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioComun } from 'src/app/models/usuario-comun';
import { UsuarioEspecial } from 'src/app/models/usuario-especial';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';
import { UsuarioComunService } from "../../services/usuario-comun/usuario-comun.service";
import { UsuarioEspecialService } from "../../services/usuario-especial/usuario-especial.service";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuarioComun: UsuarioComun = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: ''
  };

  usuarioEspecial: UsuarioEspecial = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: '',
    usuarioEspecial: {
      imagen: '',
    }
  };

  nombreUsuario: string = "";
  nombre: string = "";
  apellidoPaterno: string = "";
  apellidoMaterno: string = "";
  reputacion: number = 0;

  barraProgreso: number = 0;

  constructor(public usuarioComunService: UsuarioComunService, public usuarioEspecialService: UsuarioEspecialService, public loginService: LoginService, public router: Router) { }

  ngOnInit(): void {
    this.getUsuario();
  }

  getUsuario() {
    if(!this.loginService.ingresado()) {
      this.router.navigate(['']);
    }

    const tipoUsuario = this.loginService.getTipoUsuario();
    const usuario = this.loginService.getUsuarioActual();

    console.log(usuario)

    switch (tipoUsuario) {
      case "comun":
        this.usuarioComunService.getUsuario(usuario!).subscribe(
          res => {
            this.usuarioComun = <UsuarioComun>res;

            this.nombreUsuario = this.usuarioComun.nombreUsuario;
            this.nombre = this.usuarioComun.nombre;
            this.apellidoPaterno = this.usuarioComun.apellidoPaterno;
            this.apellidoMaterno = this.usuarioComun.apellidoMaterno;
            this.reputacion = this.usuarioComun.reputacion!;

            this.barraProgreso = this.reputacion*10;
          },
          err => {
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema recibiendo el usuario',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
        );

        break;

      case "especial":
        this.usuarioEspecialService.getUsuario(usuario!).subscribe(
          res => {
            this.usuarioEspecial = <UsuarioEspecial>res;

            this.nombreUsuario = this.usuarioEspecial.nombreUsuario;
            this.nombre = this.usuarioEspecial.nombre;
            this.apellidoPaterno = this.usuarioEspecial.apellidoPaterno;
            this.apellidoMaterno = this.usuarioEspecial.apellidoMaterno;
            this.reputacion = this.usuarioEspecial.reputacion!;

            this.barraProgreso = this.reputacion*10;
          },
          err => {
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema recibiendo el usuario',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
        );

        break;
    }
  }
}

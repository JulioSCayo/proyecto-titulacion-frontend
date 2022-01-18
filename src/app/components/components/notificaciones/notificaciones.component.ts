import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Notificacion } from "../../../models/notificacion";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  toggleMenu: boolean = false; // Variable para abrir y cerrar el menu y cambiar el icono
  clickDentro: boolean = false; // Variable para cerrar el menu tocando fuera
  
  hayNotificaciones: boolean = false; // Variable para identificar el icono a usar

  btnAbrirNotificaciones: boolean = true; // Variable icono para abrir las notificaciones
  btnCerrarNotificaciones: boolean = false; // Variable icono para cerrar las notificaciones

  idUsuario: string = '';

  notificaciones: Notificacion[] = [{
    tipoNotificacion: '',
    usuarios: [
          {
              _id: ''
          }
      ]
  }];

  // Cuando se hace click dentro del menu
  @HostListener('click')
  clickInside() {
    this.clickDentro = true;
  }

  // Cuando se hace click fuera del menu se cierra
  @HostListener('document:click')
  clickOutside() {
    if (!this.clickDentro && this.toggleMenu) {
      this.toggleMenu = false;
      this.btnCerrarNotificaciones = false;
      this.btnAbrirNotificaciones = true;
    }
    this.clickDentro = false;
  }

  constructor(public notificacionesService: NotificacionesService, public loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.getNotificaciones();
  }

  getNotificaciones() {
    if(!this.notificaciones)
          this.hayNotificaciones = false;

    if(!this.loginService.ingresado())
      this.btnAbrirNotificaciones = false;

    const tipoUsuario = this.loginService.getTipoUsuario();
    this.idUsuario = this.loginService.getUsuarioActual()!;

    if(tipoUsuario == 'admin')
      this.btnAbrirNotificaciones = false;

    this.notificacionesService.getNotificacionesUsuario(this.idUsuario).subscribe(
      res => {
        this.notificaciones = res;
        if(this.notificaciones)
          this.hayNotificaciones = true;
      },
      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema recibiendo las notificaciones',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        console.error(err);
      }
    );
  }

  borrarNotificacion(notificacion?: string) {
    console.log(notificacion);

    this.notificacionesService.editNotificacion(notificacion!, this.idUsuario).subscribe(
      res => {
        this.ngOnInit();
      },
      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema recibiendo las notificaciones',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        console.error(err);
      }
    );
  }
}

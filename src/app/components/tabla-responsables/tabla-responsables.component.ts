import { Component, OnInit } from '@angular/core';
import { UsuarioResponsableService } from "../../services/usuario-responsable/usuario-responsable.service";
import { UsuarioResponsable } from "../../models/usuario-responsable";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-responsables',
  templateUrl: './tabla-responsables.component.html',
  styleUrls: ['./tabla-responsables.component.css']
})
export class TablaResponsablesComponent implements OnInit {

  usuarios: UsuarioResponsable[] = [{
    institucion: '',
    nombreUsuario: '',
    contrasena: ''
  }];

  busqueda = "";

  constructor(public usuarioResponsableService: UsuarioResponsableService) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuarioResponsableService.getUsuarios().subscribe(
      res => {
        this.usuarios = <UsuarioResponsable[]>res;
        console.log(res);
      },
      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema recibiendo los usuarios',
          icon: 'error',
          confirmButtonText: 'Ok'
        });

        console.error(err);
      }
      );
  }

  deleteUsuario(id?: string) {
    Swal.fire({
      title: 'Seguro?',
      text: "No podrás recuperar al usuario eliminado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioResponsableService.deleteUsuario(id)?.subscribe(
          res => {
            Swal.fire({
              title: 'Eliminado',
              text: "Se eliminó al usuario",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                window.location.reload();
              }
            });
          },
          err => {
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema eliminando al usuario',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
          );
      }
    });
  }
}

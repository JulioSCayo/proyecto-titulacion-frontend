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
}

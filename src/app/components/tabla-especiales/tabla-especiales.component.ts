import { Component, OnInit } from '@angular/core';
import { UsuarioEspecialService } from "../../services/usuario-especial/usuario-especial.service";
import { UsuarioEspecial } from "../../models/usuario-especial";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-especiales',
  templateUrl: './tabla-especiales.component.html',
  styleUrls: ['./tabla-especiales.component.css']
})
export class TablaEspecialesComponent implements OnInit {

  usuarios: UsuarioEspecial[] = [{
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: '',
    imagen: ''
  }];

  constructor(public usuarioEspecialService: UsuarioEspecialService) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuarioEspecialService.getUsuarios().subscribe(
      res => {
        this.usuarios = <UsuarioEspecial[]>res;
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

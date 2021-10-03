import { Component, OnInit } from '@angular/core';
import { UsuarioEspecialService } from "../../services/usuario-especial/usuario-especial.service";
import { UsuarioEspecial } from "../../models/usuario-especial";
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

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
    usuarioEspecial: {
      imagen: '',
    }
  }];

  busqueda = ""; // Pipe

  constructor(public usuarioEspecialService: UsuarioEspecialService) { }

  ngOnInit(): void {
    this.getUsuarios(); // Se cargan los usuarios especiales en la tabla
  }

  // getUsuarios() {
  //   this.usuarioEspecialService.getUsuarios().subscribe(
  //     res => {
  //       this.usuarios = <UsuarioEspecial[]>res;
  //       // console.log(this.usuarios.sort(({usuarioEspecial.validado: A}, {usuarioEspecial.validado:B})=> A-B))
  //       // console.log(this.usuarios.sort((a,b) => this.usuarios.usuarioEspecial.valido(a) -this.usuarios.usuarioEspecial.valido(b)))
  //       console.log(this.usuarios)

  //       // let op = userArray.sort(({disabled:A}, {disabled:B})=> A-B)
  //     },
  //     err => {
  //       Swal.fire({
  //         title: 'Oh no!',
  //         text: 'Ocurrio un problema recibiendo los usuarios',
  //         icon: 'error',
  //         confirmButtonText: 'Ok'
  //       });

  //       console.error(err);
  //     }
  //     );
  // }

  getUsuarios() {
    this.usuarioEspecialService.getUsuarios().subscribe(
      res => {
        this.usuarios = <UsuarioEspecial[]>res;
        // console.log(this.usuarios)
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

  imagenEspecial(imagen: string) {
    let url = 'http://localhost:4000/' + imagen;
    window.open(url);
  }

  aceptarUsuario(usuario: UsuarioEspecial) {
    Swal.fire({
      title: 'Seguro?',
      text: "Se aceptará al usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aceptar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        usuario.usuarioEspecial.validado = true;
        this.usuarioEspecialService.editUsuario(usuario)?.subscribe(
          res => {
            Swal.fire({
              title: 'Aceptado',
              text: "Se aceptó al usuario",
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
            usuario.usuarioEspecial.validado = false;
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema aceptando al usuario',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
          );
      }
    });
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
        this.usuarioEspecialService.deleteUsuario(id)?.subscribe(
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

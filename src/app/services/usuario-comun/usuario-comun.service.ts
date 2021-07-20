import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UsuarioComun } from "../../models/usuario-comun";

@Injectable({
  providedIn: 'root'
})
export class UsuarioComunService {

  URL_API = 'http://localhost:4000/registro';

  selectedUsuario: UsuarioComun = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: '',
    reputacion: 2
  };

  usuarios: UsuarioComun[] = [];

  constructor(private http: HttpClient) { }

  createUsuario(usuarios: UsuarioComun) {
    usuarios.reputacion = 2;
    return this.http.post<UsuarioComun[]>(this.URL_API, usuarios);
  }

  getUsuario() {

  }

  editUsuario() {

  }

  deleteUsuario(_id: string) {

  }
}

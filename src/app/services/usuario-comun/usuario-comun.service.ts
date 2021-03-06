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
    contrasena: ''
  };

  usuarios: UsuarioComun[] = [];

  constructor(private http: HttpClient) { }

  createUsuario(usuarios: UsuarioComun) {
    return this.http.post<UsuarioComun[]>(this.URL_API, usuarios);
  }

  getUsuarios() {
    return this.http.get<UsuarioComun[]>(this.URL_API);
  }

  getUsuario() {
    
  }

  editUsuario() {

  }

  deleteUsuario(_id?: string) {
    this.URL_API = this.URL_API + '/' + _id;
    return this.http.delete(this.URL_API);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UsuarioEspecial } from "../../models/usuario-especial";

@Injectable({
  providedIn: 'root'
})
export class UsuarioEspecialService {

  URL_API = 'http://localhost:4000/registro-especial';

  selectedUsuario: UsuarioEspecial = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: '',
    imagen: ''
  };

  usuarios: UsuarioEspecial[] = [];

  constructor(private http: HttpClient) { }

  createUsuario(formData: FormData) {
    return this.http.post(this.URL_API, formData);
  }

  getUsuario() {

  }

  editUsuario() {

  }

  deleteUsuario(_id: string) {

  }
}

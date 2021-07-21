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
    imagen: undefined
  };

  usuarios: UsuarioEspecial[] = [];

  constructor(private http: HttpClient) { }

  createUsuario(usuario: UsuarioEspecial, form: FormData) {
    usuario.imagen = <File>form.get('imagen'); // Creo que esto no está jalando, tenemos que mandar la imagen como archivo, no como string, pero se envía como objeto vacío

    return this.http.post<FormData[]>(this.URL_API, usuario);
  }

  getUsuario() {

  }

  editUsuario() {

  }

  deleteUsuario(_id: string) {

  }
}

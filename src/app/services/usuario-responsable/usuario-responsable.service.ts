import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UsuarioResponsable } from "../../models/usuario-responsable";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioResponsableService {
  numResp = 0;
  usuarioTemp = "";

  URL_API = 'http://localhost:4000/registro-responsable';

  selectedUsuario: UsuarioResponsable = {
    institucion: "",
    nombreUsuario: "",
    contrasena: ""
  };

  usuarios: UsuarioResponsable[] = [];

  constructor(private http: HttpClient) { }

  createUsuario(usuarios: UsuarioResponsable) {
    this.numResp = 0;
    usuarios.contrasena = "Aqui ponemos la contraseña temporal"
    usuarios.nombreUsuario = "Aqui ponemos el nombre de usuario temporal"

    // contamos cuantos responsables existen de la intitucion seleccionada
    this.getUsuario().subscribe(data =>
      data.forEach(i => {
        if(i.institucion == usuarios.institucion){
          this.numResp++;
          // console.log(i , this.numResp)
        }
      })
    );

    setTimeout(() =>{
    console.log("El numero de responsables del "+ usuarios.institucion +" es de: ", this.numResp);
    switch(usuarios.institucion){                                                          // Nomenclaturas del nombre de usuario
      case 'SIAPA': this.usuarioTemp = "SP" + (this.numResp + 1).toString().padStart(4, "0000") + "R"; break;           //SP00xxR
      case 'Infrectructura': this.usuarioTemp = "IF" + (this.numResp + 1).toString().padStart(4, "0000") + "R"; break;  //IF00xxR
      case 'Bomberos': this.usuarioTemp = "BM" + (this.numResp + 1).toString().padStart(4, "0000") + "R"; break;        //BM00xxR
      case 'CFE': this.usuarioTemp = "CF" + (this.numResp + 1).toString().padStart(4, "0000") + "R"; break;             //CF00xxR
    }

    usuarios.nombreUsuario = this.usuarioTemp;
    usuarios.contrasena = this.usuarioTemp;
    console.log('Primero: ', this.usuarioTemp);
  }, 100);

    var start = new Date().getTime();
    var end = 0;
    while( (end-start) < 500){
      end = new Date().getTime();
    }

    console.log('Segundo: ', this.usuarioTemp);
    return this.http.post<UsuarioResponsable[]>(this.URL_API, usuarios);
  }

  getUsuarios() {
    return this.http.get<UsuarioResponsable[]>(this.URL_API);
  }

  getUsuario(): Observable<UsuarioResponsable[]> {
    return this.http.get<UsuarioResponsable[]>(this.URL_API);
  }

  editUsuario() {

  }

  deleteUsuario(_id: string) {

  }
}
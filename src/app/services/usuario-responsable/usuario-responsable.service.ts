import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { NgForm } from "@angular/forms"
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
    contrasena: "",
    reporteAsignado: {
        folio: "",
        tipoProblema: "",
        urgencia: 0,
        fechaCreacion: new Date(500000000000),
        estado: "",
        ubicacion: {
            longitud: 0,
            latitud: 0
        }
    }
  };

  usuarios: UsuarioResponsable[] = [];

  constructor(private http: HttpClient) { }


  async createUsuario(usuarios: UsuarioResponsable) {
    this.numResp = 0; 
    console.log("----------------------------------------------------------");
    usuarios.contrasena = "Aqui ponemos la contraseña temporal"
    usuarios.nombreUsuario = "Aqui ponemos el nombre de usuario temporal"
    usuarios.reporteAsignado = {folio : ""}

      // contamos cuantos responsables existen de la intitucion seleccionada
    this.getUsuario().subscribe(data =>
      data.forEach(i => {
        if(i.institucion == usuarios.institucion){
          this.numResp++;
          console.log(i , this.numResp)
        }
      }),
    );

      //hacemos asincrono esta parte del codigo para agregarlo al loop de eventos junto con la cuenta de usuarios responsables
    setTimeout(() =>{
      console.log("El numero de responsable del "+ usuarios.institucion +" es de: ", this.numResp);
      switch(usuarios.institucion){                                                          // Nomenclaturas del nombre de usuario
        case 'SIAPA': this.usuarioTemp = "SP" + (this.numResp + 1).toString().padStart(4, "0000") + "R"; break;           //SP00xxR
        case 'Infrectructura': this.usuarioTemp = "IF" + (this.numResp + 1).toString().padStart(4, "0000") + "R"; break;  //IF00xxR
        case 'Bomberos': this.usuarioTemp = "BM" + (this.numResp + 1).toString().padStart(4, "0000") + "R"; break;        //BM00xxR
        case 'CFE': this.usuarioTemp = "CF" + (this.numResp + 1).toString().padStart(4, "0000") + "R"; break;             //CF00xxR
      }

    usuarios.nombreUsuario = this.usuarioTemp;
    usuarios.contrasena = this.usuarioTemp;
    console.log(this.usuarioTemp)
    }, 100)

    
    // los dos bloques de codigos anteriores son asincronos, entonces retorna antes de que termine el algoritmo de sacar el nombre
    
    console.log("prueba de asincronismo")
    return this.http.post<UsuarioResponsable[]>(this.URL_API, usuarios);
  }





  

  getUsuario(): Observable<UsuarioResponsable[]> {

    return this.http.get<UsuarioResponsable[]>(this.URL_API);
  }

  editUsuario() {

  }

  deleteUsuario(_id: string) {

  }
}









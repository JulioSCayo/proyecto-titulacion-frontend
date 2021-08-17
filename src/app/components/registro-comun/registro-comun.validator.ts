import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractControl} from '@angular/forms'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { UsuarioComun } from 'src/app/models/usuario-comun';
import { UsuarioComunService } from "../../services/usuario-comun/usuario-comun.service";


// @Injectable({
//     providedIn: 'root'
//   })
export class MiValidaciones{
    
    // URL_API = 'http://localhost:4000/registro-responsable';
    // static getUsuario: any;
    // static getCorreo: any;
    
    
    constructor(private http: HttpClient, public usuarioComunService: UsuarioComunService) {     }

    // validacion personalizada para asignar un tamaño minimo de caracteres
    static CaracteresMinimos(control: AbstractControl){
        const valor = String(control.value);
        console.log(valor)

        if(valor.length < 6){
            return {Menor: true}
        }
        
        return null;
    }


    static UsuarioRepetido(control: AbstractControl){
      const nombre = String(control.value)
      console.log(nombre)

      // this.verUsuarioUnico(nombre).subscribe(
      //   res => {

      //   },
      //   err => {
      //     console.error(err);
      //   }
      // );


    }


    // validacion personalizada para confirmar contraseña
    static Iguales(controlName: string, matchingControlName: string, registrarForm: FormGroup){
        return(FormGroup: { controls: { [x: string]: any; }; }) =>{
          const control = FormGroup.controls[controlName];
          const matchingControl = FormGroup.controls[matchingControlName];
    
          if(matchingControl.errors && !matchingControl.errors.mustMatch){
            return;
          }
          if(control.value !== matchingControl.value){
            matchingControl.setErrors({mustMatch: true})
          }else{
            matchingControl.setErrors(null);
          }
        };
      }


    // static UsuarioUnico(controlName: string, registrarForm: FormGroup){
    //   return(FormGroup: { controls: { [x: string]: any; }; }) =>{
    //     const usuario = FormGroup.controls[controlName];

        
    //   };
    // }




    /*
    // validacion personalizada para que no se repita el nombre de usuario
    static UsuarioUnico(control: AbstractControl){
        const nombre = String(control.value);

        this.getUsuario().subscribe((data: any[]) =>
            data.forEach(i => {
            if(i.nombreUsuario == nombre){
                console.log(i);
                return {usuarioExistente: true}
            }
        }),
          );
            console.log("UsuarioUnico prueba")
            return null;
    }
    */
    
    
    /*
    // validacion personalizada para que no se repita el correo
    static CorreoUnico(control: AbstractControl){
        // let http = new HttpClient();
        const correo = String(control.value);

        let peticion = this.http.get<UsuarioComun[]>("http://localhost:4000/registro-responsable");

        peticion.subscribe((data: any[]) =>
            data.forEach(i => {
            if(i.nombreUsuario == correo){
                console.log(i)
                return {correoExistente: true}
            }
            }),
          );
            console.log("CorreoUnico prueba")
            return null;
    }
    */

    
    
   verUsuarioUnico(nombre: any){
    console.log(nombre)
    return this.http.post<any>('http://localhost:4000/usuarioRepetido', nombre)
  }

}

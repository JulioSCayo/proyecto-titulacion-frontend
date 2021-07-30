import { Component, OnInit } from '@angular/core';
import { UsuarioComunService } from "../../services/usuario-comun/usuario-comun.service";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

import { MiValidaciones } from "./registro-comun.validator";

@Component({
  selector: 'app-registro-comun',
  templateUrl: './registro-comun.component.html',
  styleUrls: ['./registro-comun.component.css']
})
export class RegistroComunComponent implements OnInit {
  registrarForm!: FormGroup;
  submitted = false;
  
  constructor(private formBuilder: FormBuilder, public usuarioComunService: UsuarioComunService, private http: HttpClient, private router: Router) { }
  
  ngOnInit(): void {
  
    this.registrarForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required]],
      contrasena: ['', Validators.required],
      confirmarContrasena: ['', Validators.required],
    },  
    {
      // validator: this.Iguales("contrasena", "confirmarContrasena"),
      // validatorb: this.UsuarioUnico("nombreUsuario"),
      // validatorc: this.CorreoUnico("correoElectronico")

      validator: [this.Iguales("contrasena", "confirmarContrasena")/*, this.UsuarioUnico("nombreUsuario"), this.CorreoUnico("correoElectronico")*/] 

    }); 
  }

  Iguales(controlName: string, matchingControlName: string){
    return(FormGroup: { controls: { [x: string]: any; }; }) =>{
      const control = FormGroup.controls[controlName];
      const matchingControl = FormGroup.controls[matchingControlName];

      if(matchingControl.errors && !matchingControl.errors.mustMatch){
        return;
      }
      if(control.value !== matchingControl.value){
        matchingControl.setErrors({mustMatch: true})
        this.registrarForm.setErrors({mustMatch: true})
      }else{
        matchingControl.setErrors(null);
        this.registrarForm.setErrors({mustMatch: null})
        // this.registrarForm.setErrors(null)
      }
      
      console.log(this.registrarForm.hasError('mustMatch'))
    };
  }



  // // validacion personalizada para que no se repita el nombre de usuario
  // UsuarioUnico(controlName: string){
  //   console.log("ptm ya")
  //   return(FormGroup: { controls: { [x: string]: any; }; }) =>{
  //   const control = FormGroup.controls[controlName];
  //   console.log("UsuarioUnico prueba")

  //   this.usuarioComunService.getUsuario().subscribe(data =>
  //       data.forEach(i => {
  //         if(i.nombreUsuario == String(control.value)){
  //           console.log("USUARIO REPETIDO")
  //           control.setErrors({nombreRepetido: true})
  //           this.registrarForm.setErrors({nombreRepetido: true})
  //         }
  //       })
  //     );
  //   }

  //     // control.setErrors({repetido: null})
  //     this.registrarForm.setErrors({nombreRepetido: null})
  // }


  
  // // validacion personalizada para que no se repita el nombre de usuario
  // CorreoUnico(controlName: string){
  //   return(FormGroup: { controls: { [x: string]: any; }; }) =>{
  //   const control = FormGroup.controls[controlName];
  //   console.log("UsuarioUnico prueba")

  //   this.usuarioComunService.getUsuario().subscribe(data =>
  //       data.forEach(i => {
  //           if(i.correoElectronico == String(control.value)){
  //             console.log("CORREO REPETIDO")
  //             control.setErrors({correoRepetido: true})
  //             this.registrarForm.setErrors({correoRepetido: true})
  //           }
  //         })
  //       );
  //     }

  //     // control.setErrors({repetido: null})
  //     this.registrarForm.setErrors({correoRepetido: null})
  // }



  CreateUsuario(): any {
    console.log(this.registrarForm?.value);
    this.usuarioComunService.createUsuario(this.registrarForm.value).subscribe(
      res => {
        Swal.fire({
          title: 'Solicitud enviada!',
          text: 'Hemos recibido tu solicitud de registro a "nombredelaapp" como usuario especial',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        console.log("respuesta del backend, esperamos token")
        console.log(res)
        
        this.router.navigate(['/']);
      },
      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema enviando tu solicitud',
          icon: 'error',
          confirmButtonText: 'Ok'
        });

        console.error(err);
      }
      );
  }
}

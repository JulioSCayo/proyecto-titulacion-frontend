import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UsuarioEspecialService } from "../../services/usuario-especial/usuario-especial.service";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-especial',
  templateUrl: './registro-especial.component.html',
  styleUrls: ['./registro-especial.component.css']
})
export class RegistroEspecialComponent implements OnInit {

  @Input() span = 'Seleccionar archivo de imagen';

  @ViewChild('file', {
    read: ElementRef
  }) file?: ElementRef;

  selectedImage?: File;

  constructor(public usuarioEspecialService: UsuarioEspecialService, private router: Router) { }

  ngOnInit(): void {
  }

  onImageSelected(event: Event) {
    this.selectedImage = this.file?.nativeElement.files[0];

    if(this.selectedImage?.name) {
			this.span = this.selectedImage?.name;
    }
  }

  createUsuario(nombre: HTMLInputElement, apellidoPaterno: HTMLInputElement, apellidoMaterno: HTMLInputElement, correoElectronico: HTMLInputElement, nombreUsuario: HTMLInputElement, contrasena: HTMLInputElement) {
    const formData = new FormData;
    formData.append('nombre', nombre.value);
    formData.append('apellidoPaterno', apellidoPaterno.value);
    formData.append('apellidoMaterno', apellidoMaterno.value);
    formData.append('correoElectronico', correoElectronico.value);
    formData.append('nombreUsuario', nombreUsuario.value);
    formData.append('contrasena', contrasena.value);
    formData.append('imagen', this.file?.nativeElement.files[0]);
    formData.append('usuarioEspecial.validado', 'false');
    formData.append('usuarioEspecial.imagen', 'prueba')

    this.usuarioEspecialService.createUsuario(formData).subscribe(
        res => {
          Swal.fire({
            title: 'Solicitud enviada!',
            text: 'Hemos recibido tu solicitud de registro a "nombredelaapp" como usuario especial',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          
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

    // this.usuarioEspecialService.createUsuario(form.value, fd).subscribe(
    //   res => {
    //     Swal.fire({
    //       title: 'Solicitud enviada!',
    //       text: 'Hemos recibido tu solicitud de registro a "nombredelaapp" como usuario especial',
    //       icon: 'success',
    //       confirmButtonText: 'Ok'
    //     });
        
    //     this.router.navigate(['/']);
    //   },
    //   err => {
    //     Swal.fire({
    //       title: 'Oh no!',
    //       text: 'Ocurrio un problema enviando tu solicitud',
    //       icon: 'error',
    //       confirmButtonText: 'Ok'
    //     });

    //     console.error(err);
    //   }
    // );
  }

  getUsuario() {
    // this.employeeService.getEmployees().subscribe(
    //   res => {
    //     this.employeeService.employees = res;
    //   },
    //   err => console.error(err)
    // );
  }

  editUsuario() {

  }

  deleteUsuario(id: string) {
    // if(confirm("Are you sure you want to delete it?")) {
    //   this.employeeService.deleteEmployee(id);
    // }
  }
}

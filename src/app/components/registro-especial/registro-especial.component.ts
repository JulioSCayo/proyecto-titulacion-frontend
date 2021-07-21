import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UsuarioEspecialService } from "../../services/usuario-especial/usuario-especial.service";
import { NgForm } from "@angular/forms"
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

  createUsuario(form: NgForm) {
    const fd = new FormData;
    fd.append('imagen', this.file?.nativeElement.files[0], this.selectedImage?.name);

    this.usuarioEspecialService.createUsuario(form.value, fd).subscribe(
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

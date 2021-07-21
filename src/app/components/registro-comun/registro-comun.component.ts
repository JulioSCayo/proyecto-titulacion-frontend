import { Component, OnInit } from '@angular/core';
import { UsuarioComunService } from "../../services/usuario-comun/usuario-comun.service";
import { NgForm } from "@angular/forms"
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-comun',
  templateUrl: './registro-comun.component.html',
  styleUrls: ['./registro-comun.component.css']
})
export class RegistroComunComponent implements OnInit {

  constructor(public usuarioComunService: UsuarioComunService, private router: Router) { }

  ngOnInit(): void {
  }

  createUsuario(form: NgForm) {
    this.usuarioComunService.createUsuario(form.value).subscribe(
      res => {
        Swal.fire({
          title: 'Te has registrado!',
          text: 'Bienvenido a "nombredelaapp"',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        
        this.router.navigate(['/']);
      },
      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema enviando tu registro"',
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

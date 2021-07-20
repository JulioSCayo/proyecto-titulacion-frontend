import { Component, OnInit } from '@angular/core';
import { UsuarioComunService } from "../../services/usuario-comun/usuario-comun.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-registro-comun',
  templateUrl: './registro-comun.component.html',
  styleUrls: ['./registro-comun.component.css']
})
export class RegistroComunComponent implements OnInit {

  constructor(public usuarioComunService: UsuarioComunService) { }

  ngOnInit(): void {
  }

  createUsuario(form: NgForm) {
    this.usuarioComunService.createUsuario(form.value).subscribe(
      res => {
        console.log(res);
      },
      err => console.error(err)
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

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-barra-navegacion',
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent implements OnInit {

  paginaInicio: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if(this.router.url == '/') {
      this.paginaInicio = true;
    }
    else {
      this.paginaInicio = false;
    }
  }

  inicio() {
    this.router.navigate(['/']);
  }

  registrarte() {
    this.router.navigate(['/registro']);
  }
}

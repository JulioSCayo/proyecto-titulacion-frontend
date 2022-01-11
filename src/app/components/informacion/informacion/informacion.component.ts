import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {

  constructor() { }

  nombre: string = "";
  correo: string = "";
  comentario: string = "";

  nombreVacio: boolean = false;
  correoVacio: boolean = false;
  correoMal: boolean = false;
  comentarioVacio: boolean = false;
  comentarioLargo: boolean = false;

  ngOnInit(): void {
  }

  mandarCorreo() {
    var enviar = true;

    if(this.nombre.length == 0){
      this.nombreVacio = true;
      enviar = false;
    }
    else
    this.nombreVacio = false;

    if(this.correo.length == 0){
      this.correoVacio = true;
      enviar = false;
    }
    else {
      this.correoVacio = false;
      if(this.correo.includes("@") && this.correo.includes(".")) {
        this.correoMal = false;
      }
      else {
        this.correoMal = true;
        enviar = false;
      }
    }

    if(this.comentario.length == 0){
      this.comentarioVacio = true;
      this.comentarioLargo = false;
      enviar = false;
    }
    else {
      this.comentarioVacio = false;

      if(this.comentario.length > 150) {
        this.comentarioLargo = true;
        enviar = false;
      }
      else
        this.comentarioLargo = false;
    }

    if(enviar) {
      var left = (screen.width - 700) / 2;
      var top = (screen.height - 400) / 2;
              
      window.open('mailto:a18100272@ceti.mx?subject=Comentario de ' + this.nombre + ', Correo de contacto: ' + this.correo + '&body=' + this.comentario, "Enviar comentario", "width=700, height=400, top=" + top + ", left=" + left);
    }
  }
}

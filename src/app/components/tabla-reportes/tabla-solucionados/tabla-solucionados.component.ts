import { Component, OnInit } from '@angular/core';
import { Reporte } from 'src/app/models/reporte';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { AlgoritmoUrgencia } from '../../mapa-reportes/algoritmo-urgencia';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-tabla-solucionados',
  templateUrl: './tabla-solucionados.component.html',
  styleUrls: ['./tabla-solucionados.component.css']
})
export class TablaSolucionadosComponent implements OnInit {

  reportes: Reporte[] = [{
    ubicacion: {
      latitud: 0,
      longitud: 0
    },
    tipoProblema: "",
    credibilidad: 0,
    usuarios: [{
      _id: ""
    }]
  }];

  busqueda = ""; // Pipe

  usuariosInfo: any;

  // lista:string[] = ["Más reciente", "Antiguos", "Más urgentes", "Menos urgentes"];

  paises: string[] = ['Mexico', 'España', 'Venezuela'];
  default: string = 'Mexico';
  

  // paisFormulario: FormGroup;

  constructor(public reportesService: ReportesService, private modal:NgbModal) {}


  ngOnInit(): void {

    this.getReportes();
  }

  getReportes() {
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);
    let estado = "Solucionado$"+ localStorage.getItem("Usr");
    
    this.reportesService.getEstadoReportes(estado).subscribe(
      async res => {
          this.reportes = <Reporte[]>res;

          for(let reporte of this.reportes) {
            console.log(reporte);
          }
      }, 
      err => {
          console.log('No se pudo cargar los reportes');
          console.error(err);
      }
    );
  }


  openCentrado(contenido: any, reporte: any){
    this.reportesService.getInfoUsuariosReporte(reporte.usuarios).subscribe(
      async res => {
          this.usuariosInfo = res;
          for(let i = 0; i < (reporte.usuarios.length - this.usuariosInfo.length);  i++){
            this.usuariosInfo.push({
              _id: "Usuario Anonimo",
              nombreUsuario: "---",
              reputacion: "---"
            })
          }
      }, 
      err => {
          console.log('No se pudo cargar los reportes');
          console.error(err);
      }
    );

    this.modal.open(contenido,{centered:true});
  }




}

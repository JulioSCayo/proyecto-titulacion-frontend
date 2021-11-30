import { Component, OnInit } from '@angular/core';
import { Reporte } from 'src/app/models/reporte';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { AlgoritmoUrgencia } from '../../mapa-reportes/algoritmo-urgencia';

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

  constructor(public reportesService: ReportesService) { }

  ngOnInit(): void {
    this.getReportes();
  }

  getReportes() {
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);
    
    this.reportesService.getEstadoReportes("Solucionado").subscribe(
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
}

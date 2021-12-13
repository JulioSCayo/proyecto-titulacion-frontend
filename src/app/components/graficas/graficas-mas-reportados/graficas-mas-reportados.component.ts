import { HttpClient } from '@angular/common/http';
import { Component, OnInit,ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { Reporte } from 'src/app/models/reporte';


@Component({
  selector: 'app-graficas-mas-reportados',
  templateUrl: './graficas-mas-reportados.component.html',
  styleUrls: ['./graficas-mas-reportados.component.css']
})
export class GraficasMasReportadosComponent implements OnInit{

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

  constructor(public reportesService: ReportesService, private http: HttpClient) {}

  titulos: string[] | undefined
  cantidadReportes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0]
  
  ngOnInit(): void {
      this.reportesService.getEstadoReportes("Desatendido").subscribe(
        async res => {
          this.titulos = ["alumbrado", "inundacion", "fuga", "faltaAlcantarilla", "alcantarillaObstruida", "escombros", "vehiculo", "arbol", "socavon", "cables", "incendio"]
          
            this.reportes = <Reporte[]>res;
            this.reportes.forEach(e => {
              // e.tipoProblema
              switch (e.tipoProblema) {
                case "alumbrado":
                  this.cantidadReportes[0]++;
                break;

                case "inundacion":
                  this.cantidadReportes[1]++;
                break;

                case "fuga":
                  this.cantidadReportes[2]++;
                break;

                case "faltaAlcantarilla":
                  this.cantidadReportes[3]++;
                break;

                case "alcantarillaObstruida":
                  this.cantidadReportes[4]++;
                break;

                case "escombros":
                  this.cantidadReportes[5]++;
                break;

                case "vehiculo":
                  this.cantidadReportes[6]++;
                break;

                case "arbol":
                  this.cantidadReportes[7]++;
                break;

                case "socavon":
                  this.cantidadReportes[8]++;
                break;

                case "cables":
                  this.cantidadReportes[9]++;
                break;
              
                case "incendio":
                  this.cantidadReportes[10]++;
                break;
              
                default:
                  break;
              }
            });
            console.log(this.cantidadReportes)
        }, 
        err => {
            console.error('No se pudo cargar los reportes - ', err);
        }
      );
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        min:1,
        max: 11
      },
      y: {
        min: 1,
        max: 20
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType: ChartType = 'bar';

  // public barChartPlugins = [
  //   DataLabelsPlugin
  // ];

  public barChartData: ChartData<'bar'> = {
    labels: ["alumbrado", "inundacion", "fuga", "faltaAlcantarilla", "alcantarillaObstruida", "escombros", "vehiculo", "arbol", "socavon", "cables", "incendio"],
    datasets: [
      { data: this.cantidadReportes, label: 'Cantidad de reportes' },
      // { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  // public randomize(): void {
  //   // Only Change 3 values
  //   this.barChartData.datasets[0].data = [
  //     Math.round(Math.random() * 100),
  //     59,
  //     80,
  //     Math.round(Math.random() * 100),
  //     56,
  //     Math.round(Math.random() * 100),
  //     40 ];

  //   this.chart?.update();
  // }

}

import { Component, OnInit } from '@angular/core';
import { GraficasService } from 'src/app/services/graficas/graficas.service';

declare var google: any;

@Component({
  selector: 'app-grafica2',
  templateUrl: './grafica2.component.html',
  styleUrls: ['./grafica2.component.css']
})
export class Grafica2Component implements OnInit {

  fecha = new Date()

  mesBase: any = 0
  añoBase: any = 0

  auxiliar: any = [ ]
  conclusiones: any = [  ]

  ordenDatos: any = [
    ['Problema', 'Reportados', 'Solucionados'],
    ['Alumbrado', 0, 0],
    ['Inundacion', 0, 0],
    ['Fuga de agua', 0, 0],
    ['Falta de alcantarilla', 0, 0],
    ['Alcantarilla obstruida', 0, 0],
    ['Escombros', 0, 0],
    ['Vehiculo abandonado', 0, 0],
    ['Arbol caido', 0, 0],
    ['Socavón', 0, 0],
    ['Cables', 0, 0],
    ['Incendio', 0, 0]
  ]

  materialOptions = {
    width: 1350,
    chart: {
      title: 'Diferencia de reportes',
      subtitle: 'Problemas reportados a la izquierda, problemas solucionados a la derecha'
    },
    backgroundColor: 'transparent',
    series: {
      0: { axis: 'Reportados', color: '#f5714e' }, // Bind series 0 to an axis named 'Reportados'.
      1: { axis: 'Solucionados', color: '#42dcd5' } // Bind series 1 to an axis named 'Solucionados'.
    },
  };
  

  constructor(public graficasService: GraficasService) {
    this.mesBase = this.fecha.getMonth() + 1
    this.añoBase = this.fecha.getFullYear().toString()
   }

      //   EN ESTA GRAFICA BAJAR LAS CONCLUSIONES CUANDO SE ENTRE CON EL ADMIN
      //   EN CASO DE QUE SEA UN RERESPONSABLE PONERLAS A LA DERECHA DE LA GRAFICA Y REDUCIR EL TAMAÑO DE LA GRAFICA
      //   PARA QUE QUEPAN LAS DOS EN FILA
  ngOnInit(): void {
    let solucionados: any, elResto: any;

    
    this.graficasService.getReportesGrafica2(this.mesBase, this.añoBase).subscribe(
      res => {
        console.log(res)
        google.charts.load('current', {'packages':['corechart', 'bar']});
        google.charts.setOnLoadCallback( () => {
          var chartDiv = document.getElementById('chart_div');

          solucionados = res.solucionados
          elResto = res.elResto

          this.Convertir( elResto, solucionados)
  
          var data = google.visualization.arrayToDataTable(this.auxiliar);
  
          var materialChart = new google.charts.Bar(chartDiv);
          materialChart.draw(data, google.charts.Bar.convertOptions(this.materialOptions));

          this.Conclusiones();
        });
        },
      err => {
        console.error(err);
      });


    this.graficasService.disparadorDeMes.subscribe(res => {
      this.mesBase = res
      console.log(res, "---------------------------------------")
      this.graficasService.getReportesGrafica2(this.mesBase, this.añoBase).subscribe(
        res => {
          google.charts.load('current', {'packages':['corechart', 'bar']});
          google.charts.setOnLoadCallback( () => {
            var chartDiv = document.getElementById('chart_div');
            
            solucionados = res.solucionados
            elResto = res.elResto

            for(let que = 1; que < this.ordenDatos.length; que++){
              this.ordenDatos[que][1] = 0
              this.ordenDatos[que][2] = 0
            }

            this.Convertir(elResto, solucionados)

    
            var data = google.visualization.arrayToDataTable(this.auxiliar);
    
            var materialChart = new google.charts.Bar(chartDiv);
            materialChart.draw(data, google.charts.Bar.convertOptions(this.materialOptions));

            this.Conclusiones();
          });
          },
        err => {
          console.error(err);
        });
    })


    this.graficasService.disparadorDeAño.subscribe(res => {
      this.añoBase = res
      console.log(res)
      this.graficasService.getReportesGrafica2(this.mesBase, this.añoBase).subscribe(
        res => {
          console.log(res)
          google.charts.load('current', {'packages':['corechart', 'bar']});
          google.charts.setOnLoadCallback( () => {
            var chartDiv = document.getElementById('chart_div');

            solucionados = res.solucionados
            elResto = res.elResto

            for(let que = 1; que < this.ordenDatos.length; que++){
              this.ordenDatos[que][1] = 0
              this.ordenDatos[que][2] = 0
            }

            this.Convertir(elResto, solucionados)
    
            var data = google.visualization.arrayToDataTable(this.auxiliar);
    
            var materialChart = new google.charts.Bar(chartDiv);
            materialChart.draw(data, google.charts.Bar.convertOptions(this.materialOptions));

            this.Conclusiones();
          });
          },
        err => {
          console.error(err);
        });
    })


  }


  Convertir(a: any, b: any){
    a.forEach((e: any) => {
      switch (e.tipoProblema) {
        case "alumbrado":
          this.ordenDatos[1][1]++
          break;
        case "inundacion":
          this.ordenDatos[2][1]++
          break;
        case "fuga":
          this.ordenDatos[3][1]++
          break;
        case "faltaAlcantarilla":
          this.ordenDatos[4][1]++
          break;
        case "alcantarillaObstruida":
          this.ordenDatos[5][1]++
          break;
        case "escombros":
          this.ordenDatos[6][1]++
        break;
        case "vehiculo":
          this.ordenDatos[7][1]++
          break;
        case "arbol":
          this.ordenDatos[8][1]++
          break;
        case "socavon":
          this.ordenDatos[9][1]++
          break;
        case "cables":
          this.ordenDatos[10][1]++
          break;
        case "incendio":
          this.ordenDatos[11][1]++
          break;
        default:
          this.ordenDatos[12][1]++
          break;
      }
    });
    b.forEach((e: any) => {
      switch (e.tipoProblema) {
        case "alumbrado":
          this.ordenDatos[1][2]++
          break;
        case "inundacion":
          this.ordenDatos[2][2]++
          break;
        case "fuga":
          this.ordenDatos[3][2]++
          break;
        case "faltaAlcantarilla":
          this.ordenDatos[4][2]++
          break;
        case "alcantarillaObstruida":
          this.ordenDatos[5][2]++
          break;
        case "escombros":
          this.ordenDatos[6][2]++
        break;
        case "vehiculo":
          this.ordenDatos[7][2]++
          break;
        case "arbol":
          this.ordenDatos[8][2]++
          break;
        case "socavon":
          this.ordenDatos[9][2]++
          break;
        case "cables":
          this.ordenDatos[10][2]++
          break;
        case "incendio":
          this.ordenDatos[11][2]++
          break;
        default:
          this.ordenDatos[12][2]++
          break;
      }
    });

    this.auxiliar.length = 0
    this.auxiliar.push(['Problema', 'Reportados', 'Solucionados'])

    let institucionUsr = localStorage.getItem('Usr')

    let noElPrimero = false
    this.ordenDatos.forEach((element: any) => {
      if(noElPrimero){
          if(element[1] > 0){
            this.auxiliar.push(element)
          }else{
              if(institucionUsr!.substr(0,2) == "SP")
                if(element[0] == "Inundacion" || element[0] == "Fuga de agua" || element[0] == "Falta de alcantarilla" || element[0] == "Alcantarilla obstruida")
                  this.auxiliar.push(element)
              if(institucionUsr!.substr(0,2) == "CF")
                if(element[0] == "Alumbrado" || element[0] == "Cables")
                  this.auxiliar.push(element)
              if(institucionUsr!.substr(0,2) == "BM")
                if(element[0] == "Incendio")
                  this.auxiliar.push(element)
              if(institucionUsr!.substr(0,2) == "PC")
                if(element[0] == "Arbol caido" || element[0] == "Escombros")
                  this.auxiliar.push(element)   
              if(institucionUsr!.substr(0,2) == "SM")
                if(element[0] == "Vehiculo abandonado")
                  this.auxiliar.push(element)   
              if(institucionUsr!.substr(0,2) == "IF")
                if(element[0] == "Socavón")
                  this.auxiliar.push(element)   
              if(institucionUsr!.substr(0,2) == "Ad")
                  this.auxiliar.push(element)
          }
      }
      noElPrimero = true
    });
  }


  Conclusiones(){
    let copia = this.auxiliar
    let totalReportesSolucionados = 0, totalReportesHechos = 0
    let ultimoDiaDelMes
    // ['Problema', 'Reportados', 'Solucionados'],
    
    this.conclusiones.length = 0
    copia.shift()

    copia.forEach((e: any) => {
      totalReportesHechos += parseInt( e[1] ,10)
      totalReportesSolucionados += parseInt( e[2] ,10)
    });
    
    let datosMayorMenorReportados = this.auxiliar.sort(function (a: any, b: any){
      return (b[1] - a[1])
    });
    let datosMayorMenorSolucionados = this.auxiliar.sort(function (a: any, b: any){
      return (b[2] - a[2])
    });

    var getDaysInMonth = function(month: any, year: any) {
      return new Date(year, month, 0).getDate();
    };
     
    ultimoDiaDelMes = getDaysInMonth(this.mesBase, this.añoBase)

    console.log(ultimoDiaDelMes)
    console.log(datosMayorMenorReportados)

    if (datosMayorMenorReportados[0][1] == 0) {
      this.conclusiones.push("No existe ningún registro de reportes durante el mes y año seleccionados")
    } else {
      this.conclusiones.push(["Este mes se reportaron un total de " + totalReportesHechos + " problemas de los cuales fueron solucionados " + totalReportesSolucionados ])
      
        copia.forEach((e: any) => {
          if(e[1] > 0){
            this.conclusiones.push(["Se reportaron  " + e[1] + " problemas de " + e[0] + " de los cuales " + e[2] + " ya están resueltos, esto refleja una eficacia del " + (e[2]/e[1])*100 + "% en problemas de este tipo."])
          }
        });

    }

    // se han reportado 15 problemas de falta de alcantarillas de los cuales 14 ya están resueltos, esto muestra que el índice de eficacia de ese mes es de 93.3% en problemas de este tipo.


  }



}

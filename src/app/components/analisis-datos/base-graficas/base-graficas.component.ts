import { Component, OnInit } from '@angular/core';
import { GraficasService } from "../../../services/graficas/graficas.service";

@Component({
  selector: 'app-base-graficas',
  templateUrl: './base-graficas.component.html',
  styleUrls: ['./base-graficas.component.css']
})
export class BaseGraficasComponent implements OnInit {

  constructor(public graficasService: GraficasService) { }

  public graficas: string[] = ['Grafica 1', 'Grafica 2', 'Grafica 3', 'Grafica 4', 'Grafica 5'];
  public grafica!: "Grafica 1";
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public mesesBase: string[] = ['Enero ', 'Febrero ', 'Marzo ', 'Abril ', 'Mayo ', 'Junio ', 'Julio ', 'Agosto ', 'Septiembre ', 'Octubre ', 'Noviembre ', 'Diciembre '];
  public otroDeMeses: string[] = [' Enero', ' Febrero', ' Marzo', ' Abril', ' Mayo', ' Junio', ' Julio', ' Agosto', ' Septiembre', ' Octubre', ' Noviembre', ' Diciembre'];
  public mes!: "ninguno";
  public anos: string[] = ['2022', '2021', '2020', '2019'];
  public anosCambio: string[] = ['2022 ', '2021 ', '2020 ', '2019 '];
  public otroDeAnos: string[] = [' 2022 ', ' 2021 ', ' 2020 ', ' 2019 '];
  public ano!: "ninguno";
  prueba: any;

  graficaSeleccionada: any = "Grafica 1"

  fecha = new Date()
  mesBase: any
  anoBase: any

  ngOnInit(): void {
    // document.getElementById("selectGraficas")!.options.item(1).selected = 'selected';
    this.mesBase = this.fecha.getMonth() + 1
    this.anoBase = this.fecha.getFullYear().toString()

    this.anoBase = this.fecha.getFullYear()

  }



  async tipoGraficas(g:any): Promise<void>{
      this.graficaSeleccionada = g

      // this.meses = [""]
      this.anos = this.anosCambio
      this.anosCambio = this.otroDeAnos
      this.otroDeAnos = this.anos
      this.ReiniciarSelectMes()
      this.meses = this.prueba
      // this.mesesBase = this.otroDeMeses
  }
  
  async mesSeleccionado(m:any): Promise<void>{
      // CHECAR PARA QUE MANDE POR DEFAULT EL MES ACTUAL
      this.graficasService.disparadorDeMes.emit(m)
    }
    
  async anoSeleccionado(a:any): Promise<void>{
      this.graficasService.disparadorDeAño.emit(a)
    }
    
    
  Descargar(){
      console.log("hola")
      this.graficasService.disparadorDescargar.emit(this.graficaSeleccionada)
  }


  ReiniciarSelectMes(){
    this.mesesBase = this.otroDeMeses
    this.otroDeMeses = this.meses
    this.anoBase = this.otroDeAnos
    this.otroDeAnos = this.anos

    let ms = this.mesesBase
    let mesActualNombre = this.mesesBase[this.fecha.getMonth()]
    let mesActualNumero = this.fecha.getMonth()
      
    ms.splice(mesActualNumero, 1)

    ms.splice(0,0,mesActualNombre)

    this.prueba = ms
  }


}

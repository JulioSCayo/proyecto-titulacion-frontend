import { Component, OnInit } from '@angular/core';
import { Reporte } from 'src/app/models/reporte';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import Swal from 'sweetalert2';
import { AlgoritmoUrgencia } from '../../mapa-reportes/algoritmo-urgencia';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { stringify } from '@angular/compiler/src/util';
import { FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tabla-desatendidos',
  templateUrl: './tabla-desatendidos.component.html',
  styleUrls: ['./tabla-desatendidos.component.css']
})
export class TablaDesatendidosComponent implements OnInit {

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

  registrarForm!: FormGroup;
  submitted = false;


  // orden: string[] = ['Más reciente', 'Más antiguo', 'Más urgente', 'Menos urgente'];
  // default: string = 'Selecciona una opción';

  // ordenFormulario: FormGroup;
  // ordenFormulario!: FormGroup;
  // formBuilder: any;


  constructor(public reportesService: ReportesService,private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getReportes();


    this.registrarForm = this.formBuilder.group({
      ordenar: ['', Validators.required]
    },{ 
        validator: [this.modificacion]
      }); 

  }


  modificacion(control: AbstractControl){
    let opc = String(control.value);
    // console.log(opc);

    if(opc == "urgentes"){
      console.log("Entro al if")
    }


    switch (opc) {
      case 'reciente':
        
      break;

      case 'urgentes':
        
        let calis = this.reportes.sort(function (a: any, b: any){
            return (b.urgencia - a.urgencia)
          }).slice(0,5);

          this.reportes = calis;

          for(let reporte of this.reportes) {
            console.log(reporte);
          }
      break;
    
      default:
        console.log("entro por el default")
        break;
    }

  }
  
  chechar(): any {
    console.log(this.registrarForm?.value);
  }


  getReportes() {
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);
    
    this.reportesService.getEstadoReportes("Desatendido").subscribe(
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

  cambioEnProceso(reporte: Reporte) {
    Swal.fire({
      title: 'Seguro?',
      text: "Se cambiará el estado del reporte a 'En proceso'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aceptar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        reporte.estado = "En proceso";
        
        this.reportesService.editReporte(reporte)?.subscribe(
          res => {
            Swal.fire({
              title: 'En proceso!',
              text: "Se cambió el estado del reporte a 'En proceso'",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                window.location.reload();
              }
            });
          },
          err => {
            reporte.estado = "Desatendido";
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema cambiando el estado del reporte',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
          );
      }
    });
  }

  cambioDenegado(reporte: Reporte) {
    Swal.fire({
      title: 'Seguro?',
      text: "Se cambiará el estado del reporte a 'Denegado'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aceptar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        reporte.estado = "Denegado";
        this.reportesService.editReporte(reporte)?.subscribe(
          res => {
            Swal.fire({
              title: 'Denegado!',
              text: "Se cambió el estado del reporte a 'Denegado'",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                window.location.reload();
              }
            });
          },
          err => {
            reporte.estado = "Desatendido";
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema cambiando el estado del reporte',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
          );
      }
    });
  }
}

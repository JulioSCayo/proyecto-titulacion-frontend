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
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tabla-desatendidos',
  templateUrl: './tabla-desatendidos.component.html',
  styleUrls: ['./tabla-desatendidos.component.css']
})
export class TablaDesatendidosComponent implements OnInit {

  // title = 'appBootstrap';
  // closeResult: string = '';

  reportes: Reporte[] = [{
    ubicacion: {
      latitud: 0,
      longitud: 0
    },
    tipoProblema: "",
    credibilidad: 0,
    urgencia: 0,
    usuarios: [{
      _id: ""
    }]
  }];

  busqueda = ""; // Pipe

  registrarForm!: FormGroup;
  submitted = false;


  public orden: string[] = ['Más reciente', 'Más antiguo', 'Más urgente', 'Menos urgente'];
  public seleccionado!: "ninguno";
  // default: string = 'Selecciona una opción';

  constructor(public reportesService: ReportesService,
              private formBuilder: FormBuilder, 
              private http: HttpClient, 
              private router: Router,
              private modalService: NgbModal) {}

  
  ngOnInit(): void {
    try {
      localStorage.getItem("Usr");
      this.getReportes();
      
    } catch (error) {
      console.error(error);
    }

  }


  // open(content:any) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }
  // }



  async onSelect(orden:any): Promise<void> {
    // console.log(orden)
    let cont = 0, aux;
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);

    switch (orden) {
      case "Más urgente":
        cont = 0;

        for(let reporte of this.reportes) {  // calcula la urgencia de cada reporte y la guarda en un arreglo junto su id
          reporte.urgencia = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
        }

        aux = this.reportes;
        this.reportes = aux.sort(function (a: any, b: any){
          return (b.urgencia - a.urgencia)
        });

        console.log(this.reportes)
      break;

      case "Menos urgente":
        cont = 0;

        for(let reporte of this.reportes) {  // calcula la urgencia de cada reporte y la guarda en un arreglo junto su id
          reporte.urgencia = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
        }

        aux = this.reportes;
        this.reportes = aux.sort(function (a: any, b: any){
          return (a.urgencia - b.urgencia)
        });

        console.log(this.reportes)
      break;
    
      default:
        console.log("Opción no valida")
        break;
    }

  }


  //DEPENDIENDO EL USUARIO (INSTITUCION) SON LOS REPORTES QUE VA A PEDIR

  getReportes() {
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);
    let estado = "Desatendido$"+ localStorage.getItem("Usr");

    this.reportesService.getEstadoReportes(estado).subscribe(
      async res => {
          this.reportes = <Reporte[]>res;

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

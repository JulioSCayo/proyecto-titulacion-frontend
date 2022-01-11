import { NodeWithI18n, ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl } from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { Reporte } from 'src/app/models/reporte';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { AlgoritmoUrgencia } from "src/app/components/mapa-reportes/algoritmo-urgencia";
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http'
import { CrearRuta } from "src/app/components/ruta-automatica/crear-ruta";


@Component({
  selector: 'app-ruta-automatica',
  templateUrl: './ruta-automatica.component.html',
  styleUrls: ['./ruta-automatica.component.css']
})
export class RutaAutomaticaComponent implements OnInit {

  toggleDesactivarMapa: boolean = true;
  toggleCrearRuta: boolean = true;
  toggleFormRuta: boolean = false;
  toggleOpcionesRuta: boolean = false;
  toggleDetallesRuta: boolean = false;
  toggleSaltarReporte: boolean = false;
  toggleTerminarRuta: boolean = false;
  toggleOtraInstitucion: boolean = false;

  finJornada = new FormControl();

  reporte: Reporte = {
    ubicacion: {
        latitud: 0,
        longitud: 0
    },
    tipoProblema: "",
    credibilidad: 0,
    usuarios: [{
        _id: ""
    }]
  };

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

  urgenciaReporte = 0;

  constructor(public reportesService: ReportesService, private http: HttpClient) { }

  ngOnInit(): void {
    // this.reverseGeocoding()

    this.mapa();
  }

  async mapa() {
    // COORDENADAS DEL USUARIO PARA CENTRAR EL MAPA
    let longitud: number;
    let latitud: number;

    // CONSEGUIR COORDENADAS DEL USUARIO
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
      }, function(err){
        console.error(err);
      }, {enableHighAccuracy: true});
    }

    setTimeout(() => {
    // DECLARAR LOADER DEL MAPA CON LA APIKEY
    let loader = new Loader({
      apiKey: 'AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw'
      // apiKey: ''
    });

    // SE CARGA EL MAPA CENTRADO EN LA UBICACION DEL USUARIO
    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("mapa")!, {
        center: { lat: latitud, lng: longitud},
        disableDefaultUI: true,
        zoomControl: true,
        zoom: 15,
        styles: [
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
      });
    });


    if(localStorage.getItem("FinJornada")){
      this.toggleDesactivarMapa = false;
      this.toggleCrearRuta = false;
      this.crearRuta();
    }

    }, 1000);

  }


  formRuta() {
    this.toggleCrearRuta = false;
    this.toggleFormRuta = true;
  }


  async crearRuta() {
    let hoy = new Date;
    let horaValida = true;
    let fin;

    //si existe el item entonces va a hacer la ruta luego luego
    // en caso contrario sale el form de jornada
    if(!localStorage.getItem("FinJornada")){
              if(this.finJornada.value == null) {
                horaValida = false;
              }
              else {
                fin = this.finJornada.value.split(":");

                if(hoy.getHours() == fin[0]) {
                  if(hoy.getMinutes() >= fin[1])
                    horaValida = false;
                }
                else if(hoy.getHours() > fin[0])
                  horaValida = false;
              }
    }


    if(horaValida == false) {
      Swal.fire({
        title: 'Oh no!',
        text: 'La hora ingresada no es válida',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      if(!localStorage.getItem("FinJornada")){
        let durJornada = Math.abs((hoy.getHours() - fin[0])*60 + (hoy.getMinutes() - fin[1]))*60000;
        this.finTiempoJornada(durJornada);
      }

      this.toggleFormRuta = false;
      this.toggleDesactivarMapa = false;
      this.toggleOpcionesRuta = true;

      let ruta = new CrearRuta(this.reportesService, this.http);
      await ruta.CrearRuta();

      await this.reportesService.getReporteAsignado().subscribe(
        async res => {
            this.reporte = <Reporte>res[0];
            console.log("...");
            console.log(this.reporte._id);
            console.log("...");

            // Obtenemos la urgencia del problema
            let urgencia = new AlgoritmoUrgencia(this.reportesService);
            this.urgenciaReporte = await urgencia.PuntosUrgencia(this.reporte._id!);
        },
        err => {
            console.warn('error al obtener reporte ', err);
        }
      );
    }
  }





  finTiempoJornada(durJornada: number) {
    localStorage.setItem("FinJornada", durJornada.toString())
    setTimeout(() => {
      Swal.fire({
        title: 'Tiempo de jornada terminado',
        text: "Se llegó al final de la jornada, desea salir y guardar el reporte para la siguiente jornada? En caso de continuar con el problema actual no se asignarán más reportes al terminar.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, salir!',
        cancelButtonText: 'No, continuar!'
      }).then((result) => {
        if(result.isConfirmed) {
          localStorage.removeItem("FinJornada")
          Swal.fire({
            title: 'Terminó su jornada!',
            text: 'Se ha guardado el último reporte de la ruta para su próxima jornada.',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(() => {
            window.location.reload();
          });
        }
        else {
          localStorage.removeItem("FinJornada")
          Swal.fire({
            title: 'Continúa con el reporte actual!',
            text: 'No se le asignarán más reportes al terminar con este último.',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }
      });
    }, durJornada);
  }





  saltarReporte() {
    Swal.fire({
      title: 'Saltar reporte?',
      text: "Se asignará un nuevo reporte.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        Swal.fire({
          title: 'Se saltó el reporte!',
          text: 'Se asignará un nuevo reporte.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        this.toggleSaltarReporte = false;
        this.toggleDetallesRuta = false;
        this.toggleDesactivarMapa = false;
        this.toggleOpcionesRuta = true;
      }
    });
  }

  terminarRuta() {
    Swal.fire({
      title: 'Terminar ruta?',
      text: "Se guardará el reporte actual para su siguiente jornada.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        Swal.fire({
          title: 'Terminó su jornada!',
          text: 'Se ha guardado el último reporte de la ruta para su próxima jornada.',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
          window.location.reload();
        });
      }
    });
  }






  formDetallesRuta() {
    this.toggleOpcionesRuta = false;
    this.toggleDetallesRuta = true;
  }

  formTerminarRuta() {
    this.toggleDesactivarMapa = true;
    this.toggleOpcionesRuta = false;
    this.toggleTerminarRuta = true;
  }

  

  cambioSolucionado() {
    Swal.fire({
      title: 'Reporte solucionado?',
      text: "Se cambiará el estado del reporte a solucionado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reporte.estado = "Solucionado";
        let hoy = new Date(Date.now());
        this.reporte.fechaSolucion = hoy;

        this.reportesService.editReporte(this.reporte).subscribe(
          async res => {
            Swal.fire({
              title: 'Reporte solucionado!',
              text: 'Se cambió el estado del reporte a solucionado',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            window.location.reload();
          },
          err => {
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

  cambioDenegado() {
    Swal.fire({
      title: 'Reporte denegado?',
      text: "Se cambiará el estado del reporte a denegado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reporte.estado = "Denegado";
        this.reportesService.editReporte(this.reporte).subscribe(
          async res => {
            Swal.fire({
              title: 'Reporte denegado!',
              text: 'Se cambió el estado del reporte a denegado',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            window.location.reload();
          },
          err => {
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



  otraInstitucion(tipoProblema: string) {
    Swal.fire({
      title: 'Enviar reporte?',
      text: "Se enviará este reporte a otra institución",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        console.log("Otra institucion:");
        console.log(this.reporte._id);
        console.log("Tipo de problema nuevo: " + tipoProblema);

        this.reportesService.reasignarReporte(this.reporte._id, tipoProblema).subscribe(
          res => {
            Swal.fire({
              title: 'Reporte reasignado!',
              text: 'Se ha enviado este reporte a otra institución',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
    
            this.toggleOtraInstitucion = false;
            this.toggleDesactivarMapa = false;
            this.toggleDetallesRuta = true;
          },
          err => {
              console.warn('error al reasignar reporte ', err);
          }
        );
      }
    });
  }

  refuerzos() {
    Swal.fire({
      title: 'Pedir refuerzos?',
      text: "Se solicitará la ayuda de otra cuadrilla",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if(result.isConfirmed) {

        const urgencia = new AlgoritmoUrgencia(this.reportesService);
        const masUrgente = await urgencia.MasUrgente();

        const datos = this.reporte._id + "$" + masUrgente;

        this.reportesService.refuerzoReporte(datos).subscribe(
          res => {
            Swal.fire({
              title: 'Refuerzos llamados!',
              text: 'Se ha solicitado otra cuadrilla a este problema',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
    
            this.toggleOtraInstitucion = false;
            this.toggleDesactivarMapa = false;
            this.toggleDetallesRuta = true;
          },
          err => {
              console.warn('error al pedir el refuerzo del reporte ', err);
          }
        );
      };
    })
  }


  reverseGeocoding(){
    this.reportesService.reverseGeocoding().subscribe(
      res => {
        console.log(res)
      },
      err => {
          console.warn('error al hacer el geocoding ', err);
      }
    );
  }


}

import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { AlgoritmoUrgencia } from "src/app/components/mapa-reportes/algoritmo-urgencia";
import Swal from 'sweetalert2';


export class CrearRuta {

    constructor(public reportesService: ReportesService, private http: HttpClient) { }

    toggleCrearRuta: boolean = false;

    reporte: Reporte = {
        ubicacion: {
            latitud: 0,
            longitud: 0
        },
        tipoProblema: "",
        credibilidad: 0,
        asignado: "",
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
        asignado: "",
        usuarios: [{
            _id: ""
        }]
    }];

    urgenciaReporte = 0;


    async CrearRuta(){
        console.log("uno");

        this.reportesService.getReporteAsignado().subscribe(
            res => {
                // console.log(res);
                if(res == false){
                    this.toggleCrearRuta = true;
                    this.AsignarReporte();
                }else{
                    if(!navigator.geolocation){// obtiene la ubicacion actual del usuario
                        alert("No se puede obtener la Geolocalización");
                    }else{
                        var options = {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 0
                          };
                        navigator.geolocation.getCurrentPosition(//este metodo recibe 3 parametros,dos metodos y un objeto
                            async (pos) =>{
                                this.TrazarRuta(pos.coords, res[0].ubicacion);
                                this.reporte = res;
                                console.log("finalizo todo y en este momento debe retornar el valor de reporte");
                                return await this.reporte;
                            }, 
                            (err) =>{
                                console.warn('ERROR(' + err.code + '): ' + err.message);
                            },  
                            options);
                    }
                }
            },
            err => {
                console.warn('error al obtener reporte ', err);
            }
        )
        // return await this.reporte;
        console.log("dos");


    }


    
    AsignarReporte(){
        let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);

        new Promise((resolve, reject) => {
            // Obtiene  U-N-I-C-A-M-E-N-T-E LOS REPORTES QUE NO HAN SIDO ASIGNADOS
          this.reportesService.getReportesNoAsignados().subscribe(  
              async res => {
                  this.reportes = <Reporte[]>res;  //obtiene todos los reportes

                  let list: Object[] = [];
  
                  for(let reporte of this.reportes) {  // calcula la urgencia de cada reporte y la guarda en un arreglo junto su id
                    let urgenciaReporte = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
                    let obj = {id: reporte._id, urgencia:urgenciaReporte, ubicacion: reporte.ubicacion, distancia:0}
                    list.push(obj);
                  }

                    // ordena las urgencia de mayor a menor y pasa las primeras 5 a otro arreglo
                    let top5 = list.sort(function (a: any, b: any){
                        return (b.urgencia - a.urgencia)
                    }).slice(0,5);
                    console.log(top5)

                    //AHORA ASIGNA UNO DE ESOS REPORTES PARA SER RESUELTO
                    if(!navigator.geolocation){// obtiene la ubicacion actual del usuario
                        alert("No se puede obtener la Geolocalización");
                    }else{
                        // console.log(navigator.geolocation);
                        var options = {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 0
                          };
                          
                        navigator.geolocation.getCurrentPosition(//este metodo recibe 3 parametros,dos metodos y un objeto
                            (pos) =>{
                                let coordenadasActuales = pos.coords;
                                console.log("latitude: " +  coordenadasActuales.latitude.toString() + "longitude: " +  coordenadasActuales.longitude.toString());
                                // console.log("precision: " + coordenadasActuales.accuracy.toString().slice(-3) + " metros");

                                // calcula la distancia en km que hay entre la posicion actual y la ubicacion de cada reporte
                                // mediante la formula de haversine
                                top5.forEach( (e: any)=>{
                                    const RadioTierraKm = 6371.0;
                                  
                                    let difLatitud = (Math.PI / 180) * (coordenadasActuales.latitude - parseFloat(e.ubicacion.latitud));
                                    let difLongitud = (Math.PI / 180) * (coordenadasActuales.longitude - parseFloat(e.ubicacion.longitud));

                                    let a = Math.pow(Math.sin(difLatitud/2), 2) +
                                            Math.cos(((coordenadasActuales.latitude)*(Math.PI / 180))) *
                                            Math.cos((parseFloat(e.ubicacion.latitud)*(Math.PI / 180)))*
                                            Math.pow(Math.sin(difLongitud/2), 2);

                                    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

                                    let distanciaKM = RadioTierraKm * c;
                                    
                                    e.distancia = distanciaKM;
                                })

                                //ordena el top 5 por distancia, del mas cercano al mas lejano
                                let topDistancias = top5.sort(function (a: any, b: any){  
                                    return (a.distancia - b.distancia)
                                });
                                let idReporteMasCercano: string | undefined , contador = 0;

                                topDistancias.forEach((e: any) => {
                                    if(contador == 0)
                                        idReporteMasCercano = e.id

                                    contador++;
                                });

                                try {
                                    let update = this.reportes.find(element => element._id == idReporteMasCercano);
                                    this.reporte = this.reportes.find(element => element._id == idReporteMasCercano)!;
                                    if(update != undefined){
                                        update.asignado = localStorage.getItem('IDU')!;
                                        update.estado = "En ruta";

                                        this.reportesService.editReporte(update).subscribe(  
                                            async res => {
                                                console.log("El reporte fue asignado")
                                                console.log(res)
                                                this.TrazarRuta(coordenadasActuales, update?.ubicacion);

                                            console.log("finalizo la asignacion del reporte");
                                                
                                            },
                                            err => {
                                                console.warn("Error al momento de asignar el reporte")
                                            }
                                        );
                                    }
                                } catch (error) {
                                    console.warn(error);
                                }

                            }, 
                            (err) =>{
                                console.warn('ERROR(' + err.code + '): ' + err.message);
                            },  
                            options);
                    }
              }, 
              err => {
                  console.warn('No se pudo cargar los reportes ', err);
              }
          );
        });
    }


    TrazarRuta(origen:any, destino:any){
      // inicia la Configuración
        const directionsRenderer = new google.maps.DirectionsRenderer();
        const directionsService = new google.maps.DirectionsService();
        const map = new google.maps.Map(document.getElementById("mapa")!, {
          zoom: 14,
          center: { lat: origen.latitude, lng: origen.longitude },
          //   center: { lat: 20.523476, lng: -103.3585481 },
        });
        directionsRenderer.setMap(map);
      
        directionsService.route({
            origin:  { lat: origen.latitude, lng: origen.longitude },
            destination: { lat: destino.latitud, lng: destino.longitud },
            travelMode: google.maps.TravelMode["DRIVING"], // tambien se puede usar de otro modo WALKING - BICYCLING - TRANSIT
          },(response, status) => {
            if (status == "OK") {
              directionsRenderer.setDirections(response);
              console.log("finalizo a trazar ruta");
            } else {
              console.warn("Ocurrio un error al trazar la ruta " + status);
            }
          });
    }


}
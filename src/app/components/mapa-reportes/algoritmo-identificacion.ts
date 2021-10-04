import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { pipe } from 'rxjs';

// implements OnInit
export class AlgoritmoIdentificacion {

    constructor(public reportesService: ReportesService, private http: HttpClient) { }
 
    fecha = new Date();
    denegado: boolean = false;
    reportes: any[] = [];

    Identificacion(reporte: any){
        if(this.Leer() == true){ // si existe la variable en el LS con algun reporte hace el resto de metodos
            this.VerificarID(reporte._id);
            this.VerificarDistancia(reporte);
            this.VerificarTiempo();
        }

        // console.log(this.reportes)
        
        // guarda o no el id del nuevo reporte y da acceso a las siguientes validaciones y algoritmos
        this.AccederYGuardar(reporte._id);
        
        // console.log(this.reportes)
    }
    
    
    Leer() : boolean{
        if(localStorage.getItem("reportes")){   // si existe algun reporte aun si solucionar
            this.reportes = JSON.parse(localStorage.getItem('reportes') || '{}'); // convierte a arreglo la varible de LS
            // this.denegado = true
            return true
        }else{
            // this.denegado = false
            console.log("No existe ningun reporte");
            return false
        }
    }


    VerificarID( id_reporte: any){//  ESTE ES EL PASO UNO, PERO OJO CON EL COMENTARIO DE ARRIBA
        let identificador = id_reporte;
        console.log("ENTRO AL PASO 1")

        this.reportes.forEach(e => {
            if(e == identificador){ // si algun identificador coincide significa que este usuario habia hecho el reporte
                console.log("No se puede repotar este problema de nuevo");
                this.denegado = true
            }
        });
    }


 
    VerificarDistancia(reporteActual: any): any{   // ESTE ES EL PASO 2
        let latComparada, lngComparada
        console.log("ENTRO AL PASO 2")

        //busca cada uno de los reportes en el LS, para comparar las distancias de sus ubicaciones con el actual
        this.reportes.forEach((e: string | undefined) => {
            this.reportesService.getReporte(e).subscribe(
                (        res: any) => {
                    latComparada = res.ubicacion.latitud
                    lngComparada = res.ubicacion.longitud

                    //  (LatNueva  -  LataComparar) / 111,100 = distancia en metros entre las dos latitudes, igual con longitudes
                    if( ((reporteActual.ubicacion.latitud - latComparada) / 111100) < 30 && ((reporteActual.ubicacion.longitud - lngComparada) / 111100) < 30){
                        //la distancia es menor a 30m
                        if(reporteActual.tipoProblema == res.tipoProblema){
                            // el tipo de problema coincide y la distancia es menor a 30 m, no se puede reportar
                            this.denegado = true
                        }
                    }
                }, 
                (        err: any) => {
                console.error(err);
                }
                );
        });
    }


    VerificarTiempo(){    // ESTE ES EL PASO 3
        let tiempo;
        console.log("ENTRO AL PASO 3")

            tiempo = this.reportes[this.reportes.length - 1] 
    
            if((this.fecha.getTime() - tiempo) < 300000 ){
                console.log(" El reporte no se puede realizar, no han pasado mas de 5 min desde el ultimo")
                this.denegado = true;
            }else{
                console.log(" El reporte se puede realizar")
                this.denegado = false;
            }
    }


    VerificarFantasma(){  // ESTE ES EL PASO 4
        
    }


    AccederYGuardar(idReporte: any){
        setTimeout( () =>{  // hace el codigo asincrono, creo que aun es necesario
            if(this.denegado == true){
                console.log("-- NO SE PUEDE HACER EL REPORTE --")
            }else{
                console.log("-- SE PUEDE HACER EL REPORTE --")
                this.reportes.pop();
                this.reportes.push(idReporte)
                this.reportes.push(this.fecha.getTime())
                localStorage.setItem("reportes", JSON.stringify(this.reportes));
            }
        }, 1)
    }


}
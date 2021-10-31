import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {con} from '../modelos/coneccion';
import {EncriptadoService} from '../servicios/encriptado.service';
import {Area} from '../modelos/Area';
import {Vehiculo} from '../modelos/Vehiculo';
import {Guia} from '../modelos/Guia';
@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http:HttpClient,private encriptadoSer:EncriptadoService) { }
  url=con.ipser;
  getGias(where:string,tok:string){
    var val=this.encriptadoSer.encriptar(where);
    return this.http.get<any>(this.url + 'Reportes/Guias.php?where='+val,{ headers: { 'token': tok } })
    
  }
}

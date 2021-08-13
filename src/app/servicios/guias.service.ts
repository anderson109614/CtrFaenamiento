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
export class GuiasService {

  constructor(private http:HttpClient,private encriptadoSer:EncriptadoService) { }
  url=con.ipser;

  getPersona(cedula:any,tok:string){
    var val=this.encriptadoSer.encriptar(JSON.stringify(cedula));
    return this.http.get<any>(this.url + 'Guias/Personas.php?ced='+val,{ headers: { 'token': tok } })
    
  }
  
  guardarPersona(ced:string,nombres:string,tok:string)
  {
    var persona={ced:ced,nombres:nombres};
    var valp=this.encriptadoSer.encriptar(JSON.stringify(persona));
    
    return this.http.post<any>(this.url + 'Guias/Personas.php',{value:valp},{ headers: { 'token': tok } })

  }
  getArea(codigo:any,tok:string){
    var val=this.encriptadoSer.encriptar(JSON.stringify(codigo));
    return this.http.get<any>(this.url + 'Guias/Areas.php?cod='+val,{ headers: { 'token': tok } })
    
  }
  guardarArea(are:Area,tok:string)
  {
    
    var valp=this.encriptadoSer.encriptar(JSON.stringify(are));
    
    return this.http.post<any>(this.url + 'Guias/Areas.php',{value:valp},{ headers: { 'token': tok } })

  }
  getVehiculo(cedula:any,tok:string){
    var val=this.encriptadoSer.encriptar(JSON.stringify(cedula));
    return this.http.get<any>(this.url + 'Guias/Vehiculo.php?pla='+val,{ headers: { 'token': tok } })
    
  }
  guardarVehiculo(vehi:Vehiculo,tok:string)
  {
    
    var valp=this.encriptadoSer.encriptar(JSON.stringify(vehi));
    
    return this.http.post<any>(this.url + 'Guias/Vehiculo.php',{value:valp},{ headers: { 'token': tok } })

  }
  guardarGuia(guia:Guia,tok:string)
  {
    
    var valp=this.encriptadoSer.encriptar(JSON.stringify(guia));
    
    return this.http.post<any>(this.url + 'Guias/Guias.php',{value:valp},{ headers: { 'token': tok } })

  }
  actualizarrGuia(guia:Guia,tok:string)
  {
    
    var valp=this.encriptadoSer.encriptar(JSON.stringify(guia));
    
    return this.http.put<any>(this.url + 'Guias/Guias.php',{value:valp},{ headers: { 'token': tok } })

  }
  EliminarGuia(guia:Guia,tok:string)
  {
   
    
    return this.http.delete<any>(this.url + 'Guias/Guias.php?id='+guia.IdGia,{ headers: { 'token': tok } })

  }
  getGuias(tok:string){
    //var val=this.encriptadoSer.encriptar(JSON.stringify(cedula));
    return this.http.get<any>(this.url + 'Guias/Guias.php',{ headers: { 'token': tok } })
    
  }
}

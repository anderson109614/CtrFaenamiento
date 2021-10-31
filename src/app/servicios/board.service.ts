import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {con} from '../modelos/coneccion';
import { EncriptadoService } from './encriptado.service';
@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http:HttpClient,private encriptadoSer:EncriptadoService) { }
  url=con.ipser;
  getUsuariosCount(tok:string){
   
    return this.http.get<any>(this.url + 'board/Usuarios.php',{ headers: { 'token': tok } })
    
  }
  getTotalGias(tok:string){
   
    return this.http.get<any>(this.url + 'board/Guias.php',{ headers: { 'token': tok } })
    
  }
  getTotalGiasHoy(tok:string){
   
    return this.http.get<any>(this.url + 'board/Guias.php?hoy=1',{ headers: { 'token': tok } })
    
  }
  getConteoPorUsuarios(tok:string){
   
    return this.http.get<any>(this.url + 'board/Guias.php?user=1',{ headers: { 'token': tok } })
    
  }
  getConteoPorProductos(tok:string){
   
    return this.http.get<any>(this.url + 'board/Guias.php?producto=1',{ headers: { 'token': tok } })
    
  }
  getConteoPorProductosHoy(tok:string){
   
    return this.http.get<any>(this.url + 'board/Guias.php?productohoy=1',{ headers: { 'token': tok } })
    
  }
  getConteoListaBarras(tok:string){
   
    return this.http.get<any>(this.url + 'board/Guias.php?barras=1',{ headers: { 'token': tok } })
    
  }

}

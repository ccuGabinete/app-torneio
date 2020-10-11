import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Equipe } from 'src/app/models/equipe/equipe';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  public message = new String();
  public messageSource = new BehaviorSubject(this.message);
  currentMessage = this.messageSource.asObservable();

  constructor() {}

  mudarIDEquipe(id: string){
      this.messageSource.next(id);
  }
}

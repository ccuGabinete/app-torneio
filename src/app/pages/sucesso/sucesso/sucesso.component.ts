import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucesso',
  templateUrl: './sucesso.component.html',
  styleUrls: ['./sucesso.component.css']
})
export class SucessoComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onInscricao(): void {
    this.router.navigate(['/inscricao'])
  }

  onTorneios(): void {
    this.router.navigate(['/torneios'])
  }

}

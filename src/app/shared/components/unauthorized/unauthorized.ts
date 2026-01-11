import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Composant pour la page 403 - Accès non autorisé
 */
@Component({
  selector: 'app-unauthorized',
  imports: [CommonModule, RouterLink],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.scss',
})
export class Unauthorized {}


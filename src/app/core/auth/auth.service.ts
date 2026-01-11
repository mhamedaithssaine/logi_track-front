import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from '../models/auth.models';

/**
 * Service d'authentification
 * Gère : login, logout, refresh token, stockage des tokens, état utilisateur
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Observable pour l'état de l'utilisateur connecté
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Observable pour l'état d'authentification
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Clés de stockage
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  constructor() {
    // Vérifier si un utilisateur est déjà connecté au démarrage
    this.loadUserFromStorage();
  }

  /**
   * Connexion utilisateur
   * @param credentials Email et mot de passe
   * @returns Observable<AuthResponse>
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`, credentials)
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
        catchError((error) => {
          console.error('Erreur de connexion:', error);
          return throwError(() => this.formatError(error));
        })
      );
  }

  /**
   * Inscription utilisateur (CLIENT uniquement généralement)
   * @param registerData Données d'inscription
   * @returns Observable<RegisterResponse>
   * Note: L'inscription ne retourne pas de tokens, juste une confirmation
   */
  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`, registerData)
      .pipe(
        catchError((error) => {
          console.error('Erreur d\'inscription:', error);
          return throwError(() => this.formatError(error));
        })
      );
  }

  /**
   * Rafraîchissement du token
   * @returns Observable<RefreshTokenResponse>
   */
  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('Aucun refresh token disponible'));
    }

    const request: RefreshTokenRequest = { refreshToken };

    return this.http
      .post<RefreshTokenResponse>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.refresh}`,
        request
      )
      .pipe(
        tap((response) => {
          // Mettre à jour les tokens
          this.setAccessToken(response.accessToken);
          this.setRefreshToken(response.refreshToken);
        }),
        catchError((error) => {
          console.error('Erreur de refresh token:', error);
          // Si le refresh échoue, déconnecter l'utilisateur
          this.logout();
          return throwError(() => this.formatError(error));
        })
      );
  }

  /**
   * Déconnexion utilisateur
   */
  logout(): void {
    // Nettoyer le stockage
    this.clearStorage();

    // Réinitialiser les observables
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Rediriger vers la page de login
    this.router.navigate(['/auth/login']);
  }

  /**
   * Récupérer le token d'accès
   * @returns Access token ou null
   */
  getAccessToken(): string | null {
    // Préférer sessionStorage pour plus de sécurité (se vide à la fermeture du navigateur)
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY) || localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Récupérer le refresh token
   * @returns Refresh token ou null
   */
  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY) || localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Récupérer l'utilisateur actuel
   * @returns User ou null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   * @param role Rôle à vérifier
   * @returns boolean
   */
  hasRole(role: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Vérifier si l'utilisateur a l'un des rôles spécifiés
   * @param roles Liste de rôles
   * @returns boolean
   */
  hasAnyRole(roles: Array<'ADMIN' | 'WAREHOUSE_MANAGER' | 'CLIENT'>): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // ========== Méthodes privées ==========

  /**
   * Gérer le succès de l'authentification
   */
  private handleAuthSuccess(response: AuthResponse): void {
    // Stocker les tokens
    this.setAccessToken(response.accessToken);
    this.setRefreshToken(response.refreshToken);

    // Créer l'objet User
    const user: User = {
      id: response.userId,
      email: response.email,
      role: response.role,
    };

    // Stocker l'utilisateur
    this.setUser(user);

    // Mettre à jour les observables
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Stocker le token d'accès
   */
  private setAccessToken(token: string): void {
    // Utiliser sessionStorage par défaut (plus sécurisé)
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  /**
   * Stocker le refresh token
   */
  private setRefreshToken(token: string): void {
    // Utiliser sessionStorage par défaut
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Stocker l'utilisateur
   */
  private setUser(user: User): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Charger l'utilisateur depuis le stockage
   */
  private loadUserFromStorage(): void {
    const userStr = sessionStorage.getItem(this.USER_KEY) || localStorage.getItem(this.USER_KEY);
    const accessToken = this.getAccessToken();

    if (userStr && accessToken) {
      try {
        const user: User = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        this.clearStorage();
      }
    }
  }

  /**
   * Nettoyer le stockage
   */
  private clearStorage(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Formater les erreurs de l'API
   */
  private formatError(error: any): any {
    if (error.error && typeof error.error === 'object') {
      return error.error;
    }
    return {
      status: error.status || 500,
      message: error.message || 'Une erreur est survenue',
      timestamp: new Date().toISOString(),
    };
  }
}

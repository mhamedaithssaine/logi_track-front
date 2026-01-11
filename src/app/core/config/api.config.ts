/**
 * Configuration de l'API Backend
 * À adapter selon votre environnement
 */

export const API_CONFIG = {
  baseUrl: 'http://localhost:8080/api',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/clients/register',
      refresh: '/auth/refresh',
      logout: '/auth/logout',
    },
  },
} as const;


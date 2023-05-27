export const environment = {
    production: true,
    baseUrl: '/api/',
  
    authority: 'http://localhost:5001',
    redirectUrl: 'http://localhost:5001/auth/login/',
    postLogoutRedirectUri: 'http://localhost:5001/auth/login/',
    clientId: 'spa',
    scope: 'openid profile security data reporting offline_access',
    responseType: 'code'
  };
  
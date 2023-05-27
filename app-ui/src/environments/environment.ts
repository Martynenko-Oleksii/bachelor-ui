export const environment = {
    production: false,
  
    authority: 'https://localhost:7001',
    redirectUrl: 'http://localhost:4200/',
    postLogoutRedirectUri: 'http://localhost:4200/',
    clientId: 'spa',
    scope: 'openid profile security data reporting offline_access',
    responseType: 'code'
  };
  
export const environment = {
    production: true,
    securityApi: 'http://localhost:8081/',
    dataApi: 'http://localhost:8082/',
    reportingApi: 'https://localhost:7004/api/',
  
    authority: 'http://localhost:5001',
    redirectUrl: 'http://localhost:4200/home/',
    postLogoutRedirectUri: 'http://localhost:4200/',
    clientId: 'spa',
    scope: 'openid profile roles customer additional security data reporting offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true
  };
  
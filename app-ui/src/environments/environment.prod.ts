export const environment = {
    production: true,
    securityApi: 'http://aranod.kh.ua:8081/',
    dataApi: 'http://aranod.kh.ua:8082/',
    reportingApi: 'http://aranod.kh.ua:5004/api/',
  
    authority: 'http://aranod.kh.ua:5001',
    redirectUrl: 'http://aranod.kh.ua/home/',
    postLogoutRedirectUri: 'http://aranod.kh.ua/',
    clientId: 'spa',
    scope: 'openid profile roles customer additional security data reporting offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true
  };
  
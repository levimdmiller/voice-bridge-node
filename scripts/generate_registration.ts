const AppServiceRegistration = require('matrix-appservice').AppServiceRegistration;

// creating registration files
const reg = new AppServiceRegistration();
reg.setId(AppServiceRegistration.generateToken());
reg.setAppServiceUrl('https://domain.ca/matrix');
reg.setHomeserverToken(AppServiceRegistration.generateToken());
reg.setAppServiceToken(AppServiceRegistration.generateToken());
reg.setSenderLocalpart('pstn');
reg.addRegexPattern('users', '@pstn.*', true);
reg.addRegexPattern('rooms', '@pstn.*', true);
reg.setProtocols(['exampleservice']); // For 3PID lookups
reg.outputAsYaml('registration.yaml');

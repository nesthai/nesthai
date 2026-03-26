const ENV = {
    isLocal: window.location.hostname === "localhost" ||
             window.location.hostname === "127.0.0.1",
    isProd: !(window.location.hostname === "localhost" ||
              window.location.hostname === "127.0.0.1")
};
Object.freeze(ENV);

if (ENV.isProd) {
    console.log = function() {};
    console.warn = function() {};
} else {
    console.log("ENVIRONMENT LOCKED : DEV MODE");
}
if (ENV.isProd) {
    console.error("ENVIRONMENT LOCKED : PRODUCTION MODE");
}

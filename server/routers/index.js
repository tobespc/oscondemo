// The content of this file was generated by IBM Cloud
// Do not modify it as it might get overridden
module.exports = function(app, server){
    require('./public')(app);
    require('./health')(app);
    require('./osconendpoint')(app);
};

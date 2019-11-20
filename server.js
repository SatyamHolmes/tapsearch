const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/tapsearch'))

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/tapsearch/src/index.html'));
});

app.listen(process.env.PORT || 8080);
console.log('Server listening at port 8080');
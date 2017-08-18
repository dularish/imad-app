console.log('Loaded!');

var imgElement = document.getElementById('madiImage');
var marginleftvar = imgElement.style.marginLeft;
marginLeftvar = marginleftvar.substr(0, marginleftvar.lastIndexOf('px'));
imgElement.onclick = function () {
    var interval = setInterval(function () {
        marginleftvar = isNaN(parseInt(marginleftvar)) ? 0 : parseInt(marginleftvar);
        marginleftvar = parseInt(marginleftvar) + 5;
        imgElement.style.marginLeft = marginleftvar + 'px';
    }, 50);
};

var counterBtn = document.getElementById('counterBtn');
counterBtn.onclick = function(event){
 var counterReq = new XMLHttpRequest();
 counterReq.open('GET','http://' + window.location.host + '/counter');

counterReq.onreadystatechange = function () {
   if(counterReq.readyState == XMLHttpRequest.DONE){
       if(counterReq.status == 200){
           var span = document.getElementById('counterValueSpan');
           span.innerHTML = counterReq.responseText;
       }
   } 
};

 counterReq.send();

};
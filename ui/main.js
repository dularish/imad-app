console.log('Loaded!');
var imgElement = document.getElementById('madiImage');
if (imgElement) {
    var marginleftvar = imgElement.style.marginLeft;
    marginLeftvar = marginleftvar.substr(0, marginleftvar.lastIndexOf('px'));
    imgElement.onclick = function () {
        var interval = setInterval(function () {
            marginleftvar = isNaN(parseInt(marginleftvar)) ? 0 : parseInt(marginleftvar);
            marginleftvar = parseInt(marginleftvar) + 5;
            imgElement.style.marginLeft = marginleftvar + 'px';
        }, 50);
    };
}

var counterBtn = document.getElementById('counterBtn');
if (counterBtn) {


    counterBtn.onclick = function (event) {
        var counterReq = new XMLHttpRequest();
        counterReq.open('GET', 'http://' + window.location.host + '/counter');

        counterReq.onreadystatechange = function () {
            if (counterReq.readyState == XMLHttpRequest.DONE) {
                if (counterReq.status == 200) {
                    var span = document.getElementById('counterValueSpan');
                    span.innerHTML = counterReq.responseText;
                }
            }
        };

        counterReq.send();

    };
}
var commentsList = [];
var commentBtn = document.getElementById('commentButton');
function getCommentDiv(data) {
    var name = data['name'];
    var comment = data['comment'];


    var commentDiv = `<p style="
padding-top: 5;
padding-left: 5;
padding-bottom: 5;
background-color: mediumslateblue;
">${name}:<br>${comment}</p><br>`;

return commentDiv;
}
commentBtn.onclick = function (event) {
    var name =document.getElementById('commenter').value;
    var commentText = document.getElementById('commentArea').value;
    if(name && commentText){
    var dataToPass = { 'name':name, 'comment':commentText};
    commentsList.push(getCommentDiv(dataToPass));
    commentsList.forEach(function (element) {
        document.getElementById('commentsListDiv').innerHTML += element;
    }, this);
    commentsList = [];
    document.getElementById('commenter').value='';
    document.getElementById('commentArea').value= '';

}
else{
    if(name)
        alert('Please enter the comment');
    else
        alert('Please enter the name');
}
}


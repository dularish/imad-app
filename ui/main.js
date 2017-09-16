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

var submitBtn = document.getElementById('submit_btn');
if(submitBtn){

    submitBtn.onclick = function (event) {
        var username = document.getElementById('usernameBox').value;
        var password = document.getElementById('passwordBox').value;
        var loginreq = new XMLHttpRequest();
        loginreq.open('POST', 'http://' + window.location.host + '/ui/login/login-user',true);

        loginreq.onreadystatechange = function () {
            if (loginreq.readyState == XMLHttpRequest.DONE) {
                if (loginreq.status == 200) {
                    window.alert('User Successfully Logged in');
                }
                else
                    {
                        window.alert(loginreq.responseText);
                    }
            }
        };
        loginreq.setRequestHeader('Content-Type','application/json');
        loginreq.send(JSON.stringify({'username':username, 'password':password}));
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
var commentsInfo = [];
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

if(commentBtn){
    commentBtn.onclick = function (event) {
        var commentText = document.getElementById('commentArea').value;
        var articlename = window.location.href.match(/\/ui\/fromDB\/(article.*)/)[1];
        var commentsResponse;
        var commentreq = new XMLHttpRequest();
        commentreq.open('POST', 'http://' + window.location.host + '/ui/insertcomment',true);

        commentreq.onreadystatechange = function () {
            if (commentreq.readyState == XMLHttpRequest.DONE) {
                if (commentreq.status == 200) {
                    window.alert(commentreq.responseText);
                    getAllCommentsAndUpdateDiv(articlename);
                }
                else
                    {
                        window.alert(commentreq.responseText);
                    }
            }
        };


        commentreq.setRequestHeader('Content-Type','application/json');
        commentreq.send(JSON.stringify({'commenttext':commentText,'articlename': articlename}));

        
    }

    var updatecommentdiv = function (commentsResponse) {
        var jsoninfo = JSON.parse(commentsResponse);
        var rowcount = jsoninfo.rowCount;
        jsoninfo.rows.forEach(function(element) {
            var comment_username = element.username;
            var comment_time = element.recordedon;
            var comment_text = element.commenttext;
            var obj = {username: comment_username, comment:comment_text, time:comment_time};
            commentsInfo.push(obj);
        }, this);
        commentsInfo.forEach(function(element) {
            if(element.username && element.comment){

                var dataToPass = { 'name':element.username, 'comment':element.comment};
                commentsList.push(getCommentDiv(dataToPass));

            
            }
            else{
                if(name)
                    alert('Please enter the comment');
                else
                    alert('Please enter the name');
            }
        }, this); 
        document.getElementById('commentsListDiv').innerHTML = '';
        commentsList.forEach(function (element) {
            document.getElementById('commentsListDiv').innerHTML += element;
        }, this);
        commentsList = [];
        document.getElementById('commenter').value='';
        document.getElementById('commentArea').value= ''; 
    };
    var getAllCommentsAndUpdateDiv = function (articlename) {
        var getcommentreq = new XMLHttpRequest();
        getcommentreq.open('POST',"http://" + window.location.host + '/ui/comments/getcommentsForTheArticle',true);

        getcommentreq.onreadystatechange = function () {
            if (getcommentreq.readyState == XMLHttpRequest.DONE) {
                if (getcommentreq.status == 200) {
                    commentsResponse = getcommentreq.responseText;
                    updatecommentdiv(commentsResponse);
                }
                else
                    {
                        window.alert(getcommentreq.responseText);
                    }
            }
        };
        getcommentreq.setRequestHeader('Content-Type','application/json');
        getcommentreq.send(JSON.stringify({'articlename':articlename}));

    };
    }
/*
if(commentBtn){
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
}
*/

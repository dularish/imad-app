var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = ({
  user: 'dularish1993',
  host: 'db.imad.hasura-app.io',
  database: 'dularish1993',
  password: 'db-dularish1993-36500',
  //password: process.env.DB_PASSWORD,
  port: 5432,
});
var pool = new Pool(config);





var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({
  secret: 'someSecretValueIDontunderstand',
  saveUninitialized: true,
  auth:null,
  cookie: { maxAge: 1000*60*60*24*1}
}));
var article = {
  'article-one': {
    'title': 'Cats',
    'content': `
    <div>
        <h3>About cats</h3>
        <img src="https://static.pexels.com/photos/126407/pexels-photo-126407.jpeg" class="animalsImages" alt="Just a cat picture">
    </div>
    <div>
        <p>This is just an ariticle about cats. They may look really cute but at the end of the day they are animals just
            like Lion, they have natural hunting instincts. They may sometimes bring live prey to the owner. They do
            it to their kittens, to teach them how to hunt this can be seen as a form of treating the owner as a part
            of their family.
        </p>
        <p>I love cats</p>`
  },
  'article-two': {
    'title': 'Dogs',
    'content': `        <div>
    <h3>About dogs</h3>
    <img src="https://static.pexels.com/photos/67660/pexels-photo-67660.jpeg" class="animalsImages" alt="Just a dog picture">
               </div>
       <p>This is just an article about dogs. The innate quality that comes to our mind 
           whenever, we hear of dogs is loyalty. 'Loyal like a dog'. Dogs have been humans' best
           companion in the history. When wolves started to get close to humans, they
           thought they they could work together to each others' benefits. I cannot think of any
           other animal which is more close to humans than a dog.
       </p>
       <p>I love dogs</p>`
  }
};
var getTemplate = function (data) {
  var title = data.title;
  var content = data.content;
  var template = `
<html>

<head>
    <title>
        ${title}
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/ui/style.css">
   
</head>
<body>
    <a href="/">Get Back to Home</a>
<hr>
    <div class="container">
            ${content}
</div>
</div>
</body>

</html>
`;

  return template;
};

var getTemplate2 = function (data) {
  var title = data.title;
  var content = data.content;
  var template = `
  <html>
  
  <head>
      <title>
          ${title}
      </title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/ui/style.css">
      <link rel="stylesheet" href="/bootstrap.css"><!--For Grid -->
      <link rel="stylesheet" href="/2bootstrap.css"><!--For Normal Bootstrap -->
      <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">-->
      <!--The below are added from register page-->
      <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
      crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
      crossorigin="anonymous">
  
  <!-- Optional theme -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp"
      crossorigin="anonymous">
  
  <!-- Latest compiled and minified JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
      crossorigin="anonymous"></script>
  </head>
  <body>
      <a href="/">Get Back to Home</a>
  <hr>
  
      <div class="container">
          ${content}
      </div>
      <br><br><br><br><br><br><br><br><br>
      <div class="container border" style="padding-top: 10px;">
      <div id="commentsDiv">
      <h4>Comments:</h4>
      <br>
      <span id="tobereplaced" class="hidden">Please Login to comment</span>
  <div id="addingcommentsDiv">
      <div class="row" style="align-items:center; padding-top:10px; padding-bottom:10px;">
          <div class="col-lg-8 col-sm-8 col-xs-8">
              <h5>Please enter your comments below:</h5>
          </div>
          <div class="col-lg-4 col-sm-4 col-xs-4">
              <span id="tobereplaced">Commenting as : </span><span id="commenter"></span>
          </div>
      </div>
      <div class="row" style="align-items:center; padding-top:10px; padding-bottom:20px;">
          <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8  ">
              <!--offset-lg-2 offset-md-2 offset-sm-2 offset-xs-2-->
              <textarea id="commentArea" style="width:inherit" placeholder="Enter your comment here" rows=""></textarea>
          </div>
          <br>
          <div class="col-lg-4 col-md-4 col-sm-4">
              <input id="commentButton" type="button" value="Submit">
          </div>
      </div>
  </div>
  <div class="row" style="align-items:center; padding-top:10px; padding-bottom:20px;">
      <div id="commentsListDiv" class="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">

      </div>
  </div>
</div>
</div>
</div>
  <script type="text/javascript" src="/ui/main.js">
  </script>
  <script type="text/javascript">
      window.onload = (function () {
         //window.alert("document is ready"); 
  
         var loginuserreq = new XMLHttpRequest();
         loginuserreq.open('GET', 'http://' + window.location.host + '/ui/login/check-login',true);
  
         loginuserreq.onreadystatechange = function () {
              if (loginuserreq.readyState == XMLHttpRequest.DONE) {
                  if (loginuserreq.status == 200) {
                    $("#addingcommentsDiv").removeClass("hidden");
                    $("#tobereplaced").addClass("hidden");
                    if(!loginuserreq.responseText.match(/User not logged in/)){
                    document.getElementById('commenter').innerHTML += loginuserreq.responseText.match(/User logged in: (.+)/)[1];
                    getAllCommentsAndUpdateDiv(window.location.href.match(/\\/ui\\/fromDB\\/(article.*)/)[1]);
                  }
                  else{
                      $("#addingcommentsDiv").addClass("hidden");
                      getAllCommentsAndUpdateDiv(window.location.href.match(/\\/ui\\/fromDB\\/(article.*)/)[1]);
                      $("#tobereplaced").removeClass("hidden");
                  }
              }
                  else
                      {
                        $("#addingcommentsDiv").addClass("hidden");
                        getAllCommentsAndUpdateDiv(window.location.href.match(/\\/ui\\/fromDB\\/(article.*)/)[1]);
                        $("#tobereplaced").removeClass("hidden");
                      }
              }
          };
          loginuserreq.send();
      });
  </script>
  </body>
  
  </html>
`;

  return template;
};

app.get('/ui/testDB', function (req, resp) {
  pool.query('SELECT * FROM testTable', function (err, res)  {
  //console.log(err, res);
  //pool.end();
  if (err){
      return "error";
      resp.status(500).send(err.toString());
  }
  else
  {
      return "success";
      resp.send(JSON.stringify(res));
  }
});

});

var hashtext = function (password,salt) {
  var hashedText = crypto.pbkdf2Sync(password,salt,1000,512,'sha512');
  return ['pbkdf2','1000',salt,'512',hashedText.toString('hex')].join('$');
}

app.post('/ui/insertcomment', function (req,res) {
  
  var username = req.session.auth.username;
  var comment = req.body.commenttext;
  var articlename = req.body.articlename;

  pool.query('insert into tbl_comments(username,article_name,commenttext,recordedon) values($1,$2,$3,current_timestamp);',[username,articlename,comment], function (err,result) {
    if(err){
      if(err.toString().match(/duplicate key value violates unique constraint/g).length > 0){
        res.status(500).send("UserName already in use");
      }
      else{
        res.status(500).send(err.toString());
      }
    }
    else{
      res.send(result.rowCount.toString() + " rows changed");
    }
  });
});
app.post('/ui/comments/getcommentsForTheArticle', function (req,res) {
  
  var articlename = req.body.articlename;

  pool.query('select * from tbl_comments where article_name =$1;',[articlename], function (err,result) {
    if(err){
      if(err.toString().match(/duplicate key value violates unique constraint/g).length > 0){
        res.status(500).send("UserName already in use");
      }
      else{
        res.status(500).send(err.toString());
      }
    }
    else{
      res.send(JSON.stringify(result));
    }
  });
});

app.post('/ui/create/create-user', function (req,res) {
  
  var username = req.body.username;
  var password = req.body.password;
  var salt = crypto.randomBytes(8).toString('hex');
  var passwordToStore = hashtext(password,salt);

  pool.query('insert into usercredentials values($1,$2)',[username,passwordToStore], function (err,result) {
    if(err){
      if(err.toString().match(/duplicate key value violates unique constraint/g).length > 0){
        res.status(500).send("UserName already in use");
      }
      else{
        res.status(500).send(err.toString());
      }
    }
    else{
      res.send(result.rowCount.toString() + " rows changed");
    }
  });
});
app.post('/ui/login/login-user', function (req,res) {
  var username = req.body.username;
  var password = req.body.password;

  pool.query('select * from usercredentials where username = $1',[username], function (err,result) {
    if(err){
      res.status(500).send(err.toString());
    }
    else{
      if(result.rows.length == 0){
        res.status(403).send('User Credentials not match');
      }
      else{
        var combinedPassword = result.rows[0].password.toString();
        var algorithm = combinedPassword.split('$')[0];
        var iterations = combinedPassword.split('$')[1];
        var salt = combinedPassword.split('$')[2];
        var resultLength = combinedPassword.split('$')[3];
        if(combinedPassword == hashtext(password,salt)){
          req.session.auth = {'username': result.rows[0].username};
          var body = {
            Message : 'User Logged in Successfully : ' + username
          };

          res.json(body);
          //res.send('User Logged in Successfully : ' + username);

          //res.json(body);
          res.send('User Logged in Successfully : ' + username);

          
        }
        else{
          var body = {
            Error : "User Credentials not match"
          };
          res.status(403).json(body);
          //res.status(403).send("User Credentials not match");
        }
        
      }
    }
  });
 app.get('/ui/login/check-login', function (req,res) {
   if( req.session){
      if( req.session.auth){
         if(req.session.auth.username){
     res.send('User logged in: ' + req.session.auth.username.toString())
   }
   else{
    res.send('User not logged in');
  }
  }
   else{
     res.send('User not logged in');
   }
  }
  else{
    res.send('User not logged in');
  }
 }); 
 app.get('/ui/login/logout-user', function (req, res) {
   delete req.session.auth;
   res.send('User successfully logged out');  
 });
  


});
app.get('/ui/hash/:text', function (req, resp) {
  
    var password = req.params.text;
  
    var salt = crypto.randomBytes(8).toString('hex');
    var passwordToStore = hashtext(password,salt);
  
    resp.send(passwordToStore.toString());
  
  });

var getArticleDataFromDB = function(article){
    pool.query("SELECT * FROM articletable where name ='"+article+"';", function (err, res)  {
  if (err){
      return err.toString();
  }
  else
  {
      return JSON.stringify(res);
  }
});
};

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/bootstrap.css', function (req, res) {
  //res.sendFile(path.join(__dirname, 'ui', 'style.css'));
  res.sendFile(path.join(__dirname,'bootstrap-4.0.0-beta-dist','css','bootstrap-grid.min.css'));
});
app.get('/2bootstrap.css', function (req, res) {
  //res.sendFile(path.join(__dirname, 'ui', 'style.css'));
  res.sendFile(path.join(__dirname,'bootstrap-4.0.0-beta-dist','css','bootstrap.min.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/article', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});
app.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname, 'register.html'));
});

//Counter for the webpage
var counter = 0;
app.get('/counter', function (req, res) {
  counter = counter + 1;
  res.send(counter.toString());
});

app.get('/ui/register', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','register.html'));
});

app.get('/ui/:articleName', function (req, res) {
  var articleName = req.params.articleName;
  res.send(getTemplate(article[articleName]));
});



app.get('/ui/fromDB/:articleName', function (req, res) {
  var articleName = req.params.articleName;
  
      pool.query("SELECT * FROM articletable where name ='"+articleName+"';", function (err, resp)  {
  //console.log(err, res);
  //pool.end();
  if (err){
      res.status(500).send(err.toString());
  }
  else
  {
      var dataToSend = {
        'title' : JSON.parse(JSON.stringify(resp.rows[0].title)),
        'content' : JSON.parse(JSON.stringify(resp.rows[0].content)),
      };
      res.send(getTemplate2(dataToSend));
  }
});
  
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});

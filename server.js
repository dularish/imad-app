var express = require('express');
var morgan = require('morgan');
var path = require('path');
//const { Pool, Client } = require('pg');
var Pool = require('pg').Pool;

var config = ({
  user: 'dularish1993',
  host: 'db.imad.hasura-app.io',
  database: 'dularish1993',
  password: process.env.DB_PASSWORD,
  port: 5432,
});
var pool = new Pool(config);





var app = express();
app.use(morgan('combined'));
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
}
function getTemplate(data) {
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
}

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

var getArticleDataFromDB = function(article){
    pool.query("SELECT * FROM articletable where name ='"+article+"';", function (err, res)  {
  //console.log(err, res);
  //pool.end();
  if (err){
      //window.alert("failure");
      //resp.status(500).send(err.toString());
      return err.toString();
  }
  else
  {
      //window.alert("success");
      //resp.send(JSON.stringify(res));
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

//Counter for the webpage
var counter = 0;
app.get('/counter', function (req, res) {
  counter = counter + 1;
  res.send(counter.toString());
});

app.get('/ui/:articleName', function (req, res) {
  var articleName = req.params.articleName;
  res.send(getTemplate(article[articleName]));
  //res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});
app.get('/ui/fromDB/:articleName', function (req, res) {
  var articleName = req.params.articleName;
  //res.send(getTemplate(article[articleName]));
  //res.send(JSON.stringify(getArticleDataFromDB(articleName)));
  //res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
  
      pool.query("SELECT * FROM articletable where name ='"+articleName+"';", function (err, resp)  {
  //console.log(err, res);
  //pool.end();
  if (err){
      //window.alert("failure");
      res.status(500).send(err.toString());
      //return err.toString();
  }
  else
  {
      //window.alert("success");
      res.send(JSON.stringify(resp.rows[0].title));
      //return JSON.stringify(res);
  }
});
  
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});

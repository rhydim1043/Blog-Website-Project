//---------------------SETUP TEMPLATE STARTS--------------------
var expressSanitizer=require('express-sanitizer');
var methodOverride=  require('method-override');
var bodyParser =     require('body-parser');
var mongoose =       require('mongoose');
var express =        require('express');
var app =            express();
mongoose.connect('mongodb://localhost/blogApp');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
const port = 3000;

//-------------------WEBSITE LOGIC STARTS---------------------

//-------MONGOOSE/MODEL CONFIG----------

var blogSchema = new mongoose.Schema({
    title:String,
    image:{type:String,default:'https://media.istockphoto.com/photos/businessman-standing-in-virtual-reality-display-picture-id1148098433?b=1&k=20&m=1148098433&s=170667a&w=0&h=ybEjf-STO-LPICFEepnWH2NjsOjYwO6we6qbgKjMQGY='},
    body:String,
    author:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model('Blog',blogSchema);

//-----------RESTFUL ROUTES--------------

//CREATE ROUTE 
app.listen(port,()=>console.log('SERVER STARTED'));
app.get('/',function(req,res){
    res.redirect('/blogs');
});

app.post('/blogs',function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err) res.render('new');
        else res.redirect('/blogs');
    });
});

//INDEX ROUTE

app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err) console.log('ERROR');
        else res.render('index',{blogs:blogs});
    });
});

//NEW ROUTE
app.get('/blogs/new',function(req,res){
    res.render('new');
});

//SHOW ROUTE
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err) res.redirect('/blog');
        else res.render('show',{blog:foundBlog});
    })
});

//EDIT ROUTE
app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err) res.redirect('/blogs');
        else res.render('edit',{blog:foundBlog});
    });
});

//UPDATE ROUTE
app.put('/blogs/:id',function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err) res.redirect('/blogs');
        else res.redirect('/blogs/' + req.params.id);
    });
});

//DELETE ROUTE
app.delete('/blogs/:id',function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err) res.redirect('/blogs');
        else res.redirect('/blogs');
    });
});
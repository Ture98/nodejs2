if(process.env.NODE_ENV !== 'production' ){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const { default: mongoose } = require('mongoose');
const Lavori = require('./models/lavori');
const bodyParser = require('body-parser');
const Utente = require('./models/utente');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const cripto = require('bcrypt');
const inizializzo = require('./passportConfig');
const Azienda = require('./models/azienda');
const ProfiloUtente = require('./models/profiloUtente');
const Cv = require('./models/cv');
const multer= require('multer');

/*inizializzo(passport,
    email => Utente.find(utente => Utente.email === email),
    id => Utente.find(utente => Utente.id === id), 
)*/

const db = 'mongodb+srv://sko:ciao12345@cluster0.1qmlyup.mongodb.net/cluster0?retryWrites=true&w=majority'


mongoose.connect(db);


//listen for request
app.listen(5500);

//register view engine
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



const upload = multer({dest:"public/files"});
//gestisce tutte le get
app.get('/', (req, res)=>{
   res.render('homepage');
})

/*app.get('/loginAzienda', (req, res)=>{
    Azienda.find()
    .then((result) => {
        res.render('homeAzienda');
    })
    .catch((err)=>{
        console.log(err);
    })
})*/

/*app.get('/loginUtente', (req, res)=>{
    Utente.find()
    .then((result) => {
        res.render('homeUtente');
    })
    .catch((err)=>{
        console.log(err);
    })
})*/

app.get('/about', (req, res)=>{
     res.render('about');
});
app.get('/registrazione',(req,res)=>{
    res.render('registrazione');
})
app.get('/registrazione/:id',(req,res)=>{
    res.render('registrazione');
});

app.get('/registrazioneAzienda',(req,res)=>{
    res.render('registrazioneAzienda');
});

/*app.get('/homepage', (req,res)=>{
    res.render('homepage');
})*/

app.get('/offerteLavori', (req, res)=>{
    Lavori.find()
    .then((result) => {
        res.render('index', {lavori:result});
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get('/loginForm',(req,res)=>{
    res.render('loginForm');
})

app.get('/creaLavoro',(req,res)=>{
    res.render('creaLavoro');
})

app.get('/homeUtente', (req, res)=>{
    
    res.render('homeUtente');
});

app.get('/homeAzienda', (req, res)=>{
    res.render('homeAzienda');
});

app.get('/logout', (req, res)=>{
    res.render('loginForm');
})

app.get('/infoUtente', (req, res)=>{
    res.render('creainfoUtente');
});

app.get('/profiloUtente', (req, res)=>{
    res.render('profiloUtente');
});

/*app.get('/profiloUtente/:id',(req,res)=>{

    ProfiloUtente.find()
    .then((result) => {
        res.render('profiloUtente', {infoUtente:result});
    })
    .catch((err)=>{
        console.log(err);
    })

});*/

//dettagli delle offerte di lavoro
app.get('/details/:id',(req,res)=>{

    var id = req.params.id;
    Lavori.findById(id)
    .then(result=>{
        res.render('details', { lavori:result });
    })
    .catch(err=>{
        console.log(err);   
    });
 });



/***************************************************************************************************************************************************************************************** */



//crea le offerte di lavoro
app.post("/creaLavoro", (req, res) => {
    
    var lavori = new Lavori({
        title: req.body.title,
        snippet: req.body.snippet,
        paga: req.body.paga
    })

    lavori.save((err)=>{
        if(!err){
            res.redirect('/');
        }else{
            console.log(err);
        }
    });
});

 //permette di creare un profilo utente con info sull'utente stesso
 app.post("/infoUtente", (req, res) => {
    
    const userid= req.user.id;

    var infoUtente = new ProfiloUtente({
        nome: req.body.nome,
        cognome: req.body.cognome,
        descrizione: req.body.descrizione,
        idUtente: userid
    })

    infoUtente.save((err)=>{
        if(!err){
            res.redirect('homeUtente');
        }else{
            console.log(err);
        }
    });
});

//visualizza il profilo utente loggato
app.get('/profiloUtente/:id', async (req, res) => {
    
    var id = req.user._id
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // L'ID non è valido, gestisci l'errore qui
      console.log(id);
      return res.status(400).send('ID non valido');
    }
  
    try {
        const  infoUtente = await ProfiloUtente.findOne({idUtente:id}).exec();
  
      if (!infoUtente) {
        // Nessun utente trovato con l'ID specificato, gestisci l'errore qui
        console.log('Nessun utente trovato');
        console.log(id);
        return res.status(404).send('Nessun utente trovato');
      }
  
      res.render('profiloUtente', { infoUtente: infoUtente });
    } catch (error) {
      console.log(error);
      // Gestisci l'errore qui
      res.status(500).send('Errore del server');
    }
  });

//visualizza una homepage con tutti gli utenti/aziende salvati
app.get('/homepage', async (req,res)=>{

    var utente = await Utente.find();
    var azienda = await Azienda.find();
    var dati = {Utente:utente, Azienda:azienda}
    res.render('homepage', {dati:dati});

})

//registrazione Utente
 app.post("/registrazione", (req, res) => {ò

    var utente = new Utente({
        nome: req.body.nome,
        email: req.body.email,
        password: cripto.hashSync(req.body.password, 10)
    });

    utente.save((err)=>{
        if(!err){
            res.redirect('homepage');
        }else{
            console.log(err);
        }
    });
});

//registrazione Azienda
app.post("/registrazioneAzienda", (req, res) => {

    var azienda = new Azienda({
        email: req.body.email,
        password: cripto.hashSync(req.body.password, 10),
        codiceAzienda: req.body.codiceAzienda
    });

    azienda.save((err)=>{
        if(!err){
            res.redirect('/');
        }else{
            console.log(err);
        }
    });
});

//gestisce il login dell'utente in caso di successo o meno
 app.post('/loginUtente', checkNotAuthenticated,passport.authenticate('localUtente', {
    successRedirect: 'homeUtente',
    failureRedirect: '/',
    failureFlash: true
}) ) 

//gestisce il login dell'azienda in caso di successo o meno
app.post('/loginAzienda', checkNotAuthenticated,passport.authenticate('localAzienda', {
    successRedirect: 'homeAzienda',
    failureRedirect: '/',
    failureFlash: true
}) ) 

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
//permette di caricare un curriculum vitae collegato all'utente loggato
app.post('/caricaCV', upload.single('cv'),(req,res)=>{
 
    const cvFile = req.file.path;
    const idUser = req.user.id;
    //console.log(req.file);
    const cv = new Cv({ 
        idUtente: idUser,
        filePath: cvFile
    })
    cv.save((err)=>{
        console.log(err);
    })
  res.render('homeUtente');
});


//gestisce il logout dell'utente
app.post('/logout',(req,res,next)=>{
    req.logOut(function(err) {
        if(err){
            return err;
        }
        res.render('loginForm');
    });
});

//gestisce gli errori reinderizzando alla pagina di errore
app.use((req,res)=>{
    res.render('404');
});
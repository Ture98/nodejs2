const LocalStrategy = require('passport-local').Strategy;
const cripto = require('bcrypt');
const Utente = require('./models/utente');
const passport = require('passport');
const Azienda = require('./models/azienda');
//const Utente = require('./models/utente');
passport.use('localUtente',new LocalStrategy({
  usernameField: 'email', // Utilizza l'email come campo username
  passwordField: 'password' // Utilizza la password come campo password
},

async function(email, password, done) {
  try {
    const utente = await Utente.findOne({ email: email }); // Recupera l'utente dal database
   
    if (!utente) {
      return done(null, false, { message: 'Email non registrata' });
    }

    // Verifica che la password inserita corrisponda a quella salvata nel database
    const match = await cripto.compare(password, utente.password);
  
    if (!match) {
      return done(null, false, { message: 'Password errata' });
    }

    // Se l'autenticazione è riuscita, restituisci l'utente
    return done(null, utente);

  } catch (error) {
    return done(error);
  }
}
));


//azienda
const localAziendaCallback = async (email, password, done, codiceAzienda) => {

  try {
    const azienda = await Azienda.findOne({ email: email});
    const azienda2 = await Azienda.findOne({ codiceAziendale: codiceAzienda});

    if (!azienda) {
      return done(null, false, { message: 'Email non registrata' });
    }

    const match = await cripto.compare(password, azienda.password);
  
    if (!match) {
      return done(null, false, { message: 'Password errata' });
    }

    if (!azienda2) {
      return done(null, false, { message: 'Codice aziendale non esistente' });
    }

    return done(null, azienda);
  } catch (error) {
    return done(error);
  }
};

passport.use('localAzienda',new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',

}, localAziendaCallback));

// Inizializza Passport per la gestione delle sessioni utente
passport.serializeUser((utente, done) => {
done(null, utente.id);
});

passport.deserializeUser(async (id, done) => {
try {
  const utente = await Utente.findById(id);
  done(null, utente);
} catch (error) {
  done(error);
}
});

//azienda
passport.deserializeUser((azienda, done) => {
  done(null, azienda.id);
  });
  
  passport.deserializeUser(async (id, done) => {
  try {
    const azienda = await Azienda.findById(id);
    done(null, azienda);
  } catch (error) {
    done(error);
  }
  });
  


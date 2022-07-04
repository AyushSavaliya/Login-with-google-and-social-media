const express = require("express");
const mongoose  = require("mongoose");
const app = express();
const port = 8800;
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const UserService = require('./dbconnect/index');
const FacebookService = require("./facebookconnect/facebookIndex");
const ldService =require("./linkedinconnect/linkedinIndex");

const session = require("express-session");
var userProfile
const path = require("path");
const views_path = path.join(__dirname,"./views");
// const public_path = path.join(__dirname,"./public");
app.set("view engine","hbs");
app.set("views",views_path);

app.use(express.static(views_path));
// app.use(express.static(public_path));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  resave:false,
  saveUninitialized:true,
  secret:'SECRET'
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req,res) => {
  res.render("profile")
});
app.get('/loginfacebook', (req,res) => {
  res.send(userProfile)
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user,cb) {
    cb(null,user);
});
passport.deserializeUser(function (obj,cb) {
    cb(null,obj);  
});


app.get("/",(req,res) => {
    res.render("index");
});


 passport.use(new GoogleStrategy({
    clientID:"65643801545-p3kau79blrp0hdhf52q3hlpmgoa60t0c.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"/google/callback",
    
},async(accessToken,refreshToken,profile,done)=>  {
  const id = profile.id;
  const email = profile.emails[0].value;
  const firstName = profile.name.givenName;
  const lastName = profile.name.familyName;
  const profilePhoto = profile.photos[0].value;
  const source = "google";


  const currentUser = await UserService.getUserByEmail({ email })

  if (!currentUser) {
    const newUser = await UserService.addGoogleUser({
      id,
      email,
      firstName,
      lastName,
      profilePhoto,
    })
     await newUser.generateAuthToken();
    return done(null, newUser);
  }

  if (currentUser.source != "google") {
    //return error
    return done(null, false, { message: `You have previously signed up with a different signin method` });
  }

  currentUser.lastVisited = new Date();
  return done(null, currentUser);
}
));

app.get("/google",passport.authenticate('google',{
  scope:["profile","email"]
}));

app.get("/google/callback",passport.authenticate('google', { failureRedirect: '/error' }),
function(req, res) {
  // Successful authentication, redirect success.
  res.redirect('/success');
});




//facebook
passport.use(new FacebookStrategy ({
  clientID:"735495357765749",
  clientSecret:"8ea2330b6fc9b0a7200488cb51a21cc6",
  callbackURL:"/facebook/callback",
  profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
  
},async(accessToken,refreshToken,profile,done)=> {
  const id = profile.id;
  const email = profile.emails[0].value;
  const firstName = profile._json.first_name;
  const lastName = profile._json.last_name;
  const profilePhoto = profile.photos[0].value;
  const source = "facebook";

  const currentUser = await FacebookService.getUserByEmail({ email })
  if (!currentUser) {
    const newUser = await FacebookService.addFacebookUser({
      id,
      email,
      firstName,
      lastName,
      profilePhoto
    })
    await newUser.generateAuthToken();
    return done(null, newUser);
  }

  if (currentUser.source != "facebook") {
    //return error
    return done(null, false, { message: `You have previously signed up with a different signin method` });
  }

  currentUser.lastVisited = new Date();
  return done(null, currentUser);
}));
app.get("/facebook",passport.authenticate('facebook',{ state: "SOME STATE" }));
app.get("/facebook/callback",passport.authenticate('facebook', { failureRedirect: '/error' }),
function(req, res) {
  // Successful authentication, redirect success.
  res.redirect('/success');
});


//linkedin
passport.use(new LinkedInStrategy ({
  clientID:"78uuvhk0jdp47k",
  clientSecret:"NiXnN5OXI0PH6Iud",
  callbackURL:"/linkedin/callback",
  profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
  
},async(accessToken,refreshToken,profile,done)=> {
  const id = profile.id;
  const provider = profile.provider;
  const firstName = profile.name.givenName;
  const lastName = profile.name.familyName;
  const profilePhoto = profile.photos[0].value;
  const displayName = profile.displayName; 
  const source = "linkedin";

  const currentUser = await ldService.getUserBydisplayName({ displayName })
  if (!currentUser) {
    const newUser = await ldService.addLinkedinUser({
      id,
      provider,
      firstName,
      lastName,
      profilePhoto,
      displayName
    })
    await newUser.generateAuthToken();
    return done(null, newUser);
  }

  if (currentUser.source != "linkedin") {
    //return error
    return done(null, false, { message: `You have previously signed up with a different signin method` });
  }

  currentUser.lastVisited = new Date();
  return done(null, currentUser);
}));



app.get("/linkedin",passport.authenticate('linkedin',{ state: "SOME STATE" }));
app.get("/linkedin/callback",passport.authenticate('linkedin', { failureRedirect: '/error' }),
function(req, res) {
  // Successful authentication, redirect success.
  res.render('profile')
});


mongoose.connect("mongodb://localhost:27017/logindata").then(() => {
  console.log("mongodb is connected");
}).catch(() => {
  console.log("not connected");
});
app.listen(port,() => {
    console.log("this site port number"+port);
});







const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const auth = require("./middleware/auth");
require("./db/conn");
const Register = require ("./models/registers")

const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

//console.log(process.env.SECRET_KEY);

app.get("/", (req, res) =>{
    res.render("index");
});

app.get("/secret", (req, res) =>{
    res.render("secret")
})

     

app.get("/register", (req, res) =>{
    res.render("register");
});

app.get("/login", (req, res) =>{
    res.render("login");
});

app.post("/register",async(req, res) =>{
    try{        
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        // upload.single('file');

        if(password === cpassword){
            const registerEmployee = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                file : req.body.file,
                password :password,
                confirmpassword : cpassword
            })

            console.log("the success part" + registerEmployee);

       const token = await registerEmployee.generateAuthToken();
    console.log("the token part" + token);

    
            const registered = await registerEmployee.save();
            // console.log("the page part : " +registered);

            res.status(201).render("index");
        }else{
            res.send("password not matching")
        }
    }catch(e){
        res.status(400).send(e);
    } 
})
 

//login check
app.post("/login", async(req, res) =>{
    try{
        const email = req.body.email;
        const password = req.body.password; 
  
        // console.log(`${email} and password is ${password}`);
        const useremail = await Register.findOne({email:email});
       const isMatch = bcrypt.compare(password, useremail.password);
      
       const token = await useremail.generateAuthToken();
       console.log("the token part" + token); 
     



        if(useremail.password === password){
            res.status(201).render("index");
            console.log("login successful");
        }else{
            res.send("invalid login details");
        }
    }catch(e){
        res.status(400).send("invalid login details");
    }
})

     app.get("/logout", auth, async (req, res) => {
  try {
    console.log("user logout");

    req.user.tokens = req.user.tokens.filter((currElement) => {
        return currElement.token !== req.token;
    })

    req.user.tokens = [];
 
    res.clearCookie("jwt");

    console.log(req.user);
    await req.user.save();
    res.render("login");

  } catch (error) {
    res.status(500).send(error);
  }
});



                                                                                                                                                                                                                                                                                                                                                                                                                const jwt = require("jsonwebtoken");

const createToken = async () => {
  const token = await jwt.sign(
    { _id: "619627530dc2e55b63d5d34d" },
    "mynameisvaibhavsingharjunsinghrajput",
    {
      expiresIn: "5 sec",
    }
  );
  // console.log(token);

  const userVer = await jwt.verify(
    token,
    "mynameisvaibhavsingharjunsinghrajput"
  );
  console.log(userVer);
};
createToken();

app.listen(port , ()=> {
    console.log(`server is running at port ${port}`);
});
const express = require("express");
const app = express();
const ejs = require ("ejs");
const fs = require("fs");
const bodyParser = require('body-parser');
const validator = require('validator');
const auth = require("./middleware/auth");
const hbs = require ("hbs");
const path = require("path");
// const pdf = require('html-pdf');
const qrcode = require("qrcode");
const exp = require("constants");
const pdf = require("pdf-creator-node");
const easyinvoice = require("easyinvoice");
const cookieParser = require("cookie-parser");

const Json2csvParser = require("json2csv").Parser;
var Publishable_Key = 'pk_test_51L8fjFSGxIhNuauwT90HxYscemlGOmgoGFwF8HWmNHt9X6iGzUQUhun5xJk9Cmwq0z9wOfJejS8TpqDtSlYJNOey00HYT1qlAJ'
var Secret_Key = 'sk_test_51L8fjFSGxIhNuauwSke0Buo3yX2u38KoshufKTNYNhb9ZEiSHF1tk6ClDHFHe3GXpUsCkyRMfYDQFYsfzlR4uF0700ksZ13IlH'
 
const stripe = require('stripe')(Secret_Key)



 require("./db/conn");
 const Register = require("./models/registers");
const { name } = require("ejs");
const urlencoded = require("body-parser/lib/types/urlencoded");



const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join (__dirname, "../templates/views");

 var urlencodedParser = bodyParser.urlencoded({extended:false})
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", template_path);

app.get("/",(req, res) => {
    res.render("index");

})

app.get("/register",(req , res) => {
  res.render("register");
})

app.get("/admin",(req , res) => {
  res.render("admin");
})

app.get("/secret", (req , res)=> {
 res.render("secret")
})



app.get("/logout", auth , async (req , res) => {
  try{

    console.log(req.user);
    res.clearCookie("jwt");
    console.log("logout successfully")
    await req.user.save();
    res.render("index");

  } catch(error)
  {
    res.status(500).send(error);
  }
})

// req.user.tokens = req.user.tokens.filter((currElement) => {
//   return currElement.token  !== req.token

// }


//  req.user.tokens = [];
   


//  console.log(req.user);


app.post("/ascendingname", async (req, res) => {
  try {
      Register.find({}, function (err, result) {
        res.render("display", { details: result });
      }).sort({ name: 1 });
  } catch (e) {
    res.status(400);
  }
});
app.post("/ascendingdate", async (req, res) => {
  try {
      Register.find({}, function (err, result) {
        res.render("display", { details: result });
      }).sort({ date: 1 });
  } catch (e) {
    res.status(400);
  }
});

app.post("/descendingname", async (req,res) => {
  try{
    Register.find({},function (err, result) {
      res.render("display", {details : result});
    }).sort({name: - 1});
  } catch(e) {
    res.status(400);
  }
});
app.post("/descendingdate", async (req,res) => {
  try{
    Register.find({},function (err, result) {
      res.render("display", {details : result});
    }).sort({date: - 1});
  } catch(e) {
    res.status(400);
  }
});







app.post("/register", async  (req, res) => {
  try {
     
      const password = req.body.password;
      const cpassword = req.body.confirmpassword;

      if (password === cpassword) {
          const registerEmployee = new Register({
              name: req.body.name,
              email: req.body.email,
              gender: req.body.gender,
              phone: req.body.phone,
              date: req.body.txtbirthdate,
              age: req.body.txtage,
              hobbies: req.body.hobbies,
              file: req.body.file,
              password:req.body.password,
              confirmpassword:req.body.confirmpassword
          })
  // console.log("the success part" + registerEmployee);
           
  // const token = await registerEmployee.generateAuthToken();
  // console.log ("the token part" + token); 

   const registered = await registerEmployee.save();
  res.status(201).render("index2");     
      }
      else {
          res.send("passwords are not matching");
      }
 }catch (error) {
      res.status(400).send(error);
      console.log("the error part page");
  }
})


// app.post('/register', urlencodedParser,[ 
//   check('name', 'name should be alphabates').isAlpha(),
//   check('email', 'email should be valid').isEmail()
  
// ],(req, res) => {
// const errors = validationResult(req);
// console.log(errors.mapped());
// console.log(req.body);

// res.render('index', {title: "user details" ,
//  error:errors.mapped()});

//  });




//log in
app.post("/login", async(req, res) =>{
  try{
      const email = req.body.email;
      const password = req.body.password; 

      // console.log(`${email} and password is ${password}`);
      const useremail = await Register.findOne({email:email});
      // const isMatch = bcrypt.compare(password, useremail.password);

      if(useremail.password === password){
          res.status(201).render("index2");
          console.log("login successful");
      }else{
          res.send("invalid login details");

      }
  }catch(e){
      res.status(400).send("invalid login details");
  }
})


// const jwt = require("jsonwebtoken");
  
// const createToken = async () => {
//   const token = await jwt.sign({ _id: "62727866bdbe698032e27b27"} ,
//     "mynameisvickeyvishnucharanshrivastavaaaa", {
//     expiresIn : "20 seconds"
//   })
//     console.log(token)

//     const userVer = await jwt.verify(token, "mynameisvickeyvishnucharanshrivastavaaaa");  
//    console.log(userVer);
//   }
     

// createToken();


const jwt = require("jsonwebtoken");

const createToken = async () => {
  const token = await jwt.sign(
    { _id: "62727866bdbe698032e27b27" },
    "mynameisvickeyvishnucharanshrivastavaaaa",
    {
      expiresIn: "5 days",
    }
  );
  // console.log(token);

  const userVer = await jwt.verify(
    token,
    "mynameisvickeyvishnucharanshrivastavaaaa"
  );
  console.log(userVer);
};
createToken();






app.get("/edit/:id", async (req, res) => {
  const _id = req.params.id
 

  Register.findById(_id, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", { data:{ details: result }});
    }
  });
});

app.post("/edit/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const update = req.body;
    const result = await Register.findByIdAndUpdate(_id, update, {$exists: true} );
    Register.find({}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        // console.log(result);
        res.render("display", { details: result });
      }
    });
  } catch (e) {
    console.log(e);
  }
});



app.get("/display",paginatedResults(), (req, res) => {
  Register.count({}, function (err, count){
    let y = 3;
    let x = Math.ceil(count / y);
    res.render("display", { details: res.paginatedResults, x });
 });
});

// app.get("/display", paginatedResults(), (req, res) => {
//   // res.json(res.paginatedResults);
//   // console.log(res.paginatedResults);
//   Register.count({}, function (err, count) {
//     // console.log(count)
//     let y = 3;
//     let x = Math.ceil(count / y);
//     res.render("display", { details: res.paginatedResults, x });
//   });

//   // res.paginatedResults;
// });
app.get("/invoice", (req, res) => {
  Register.find({}, function (err, data) {
    res.render("download", { details: data });
  });
  // res.render("invoice");
});




function paginatedResults() {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;
    try {
      res.paginatedResults = await Register.find()
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skipIndex)
        .exec();

      next();
    } catch (e) {
      res.status(500).json({ message: "Error Occured" });
    }
  };
}





// app.get("/delete/:id", async (req, res) => {
//   const _id = req.params.id;
//   Register.findByIdAndDelete(_id, function (err, docs) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("display");
//     }
//   });
// });


// app.post("/searchbyemail", async (req, res) => {
//   try {
//     const searchbyemail = req.body.searchbyemail;
//     // if( Register.findOne({ firstname: search }) != null){
//     const useremail = await Register.findOne({ email: searchbyemail });
//     if (useremail !== null) {
//       Register.find({ email: searchbyemail }, function (err, result) {
//         if (err) {
//           console.log(err);
//         } else if (useremail.email === null) {
//           Register.find({}, function (err, result) {
//             res.render("display", { details: result });
//           });
//         } else {
//           res.render("display", { details: result });
//         }
//       });
//     } else {
//       Register.find({}, function (err, result) {
//         res.render("display", { details: result });
//       });
//     }
//   } catch (e) {
//     res.status(400);
//   }                                                                 
// });



app.get("/delete/:id", async (req, res) => {
  const _id = req.params.id;   
  Register.findByIdAndDelete(_id,function(err, docs){

    if (err) {
     console.log(err);
    } else {
      res.redirect("/display");
    }
  });
});



app.post("/searchbyname", async (req, res) => {
  try {
    const search = req.body.search;
    // if( Register.findOne({ firstname: search }) != null){
    const username = await Register.findOne({ name: search });
    if (username !== null) {
      Register.find({ name : search }, function (err, result) {
        if (err) {
          console.log(err);
        } else if (username.name === null) {
          Register.find({}, function (err, result) {
            res.render("display", { details: result });
          });
        } else {
          res.render("display", { details: result });
        }
      });
    } else {
      Register.find({}, function (err, result) {
        res.render("display", { details: result });
      });
    }
  } catch (e) {
    res.status(400);
  }
});

app.post("/searchbyemail", async (req, res) => {
  try {
    const searchbyemail = req.body.searchbyemail;
    // if( Register.findOne({ firstname: search }) != null){
    const useremail = await Register.findOne({ email: searchbyemail });
    if (useremail !== null) {
      Register.find({ email: searchbyemail }, function (err, result) {
        if (err) {
          console.log(err);
        } else if (useremail.email === null) {
          Register.find({}, function (err, result) {
            res.render("display", { details: result });
          });
        } else {
          res.render("display", { details: result });
        }
      });
    } else {
      Register.find({}, function (err, result) {
        res.render("display", { details: result });
      });
    }
  } catch (e) {
    res.status(400);
  }                                                                 
});

app.post("/searchbygender", async (req, res) => { 
  try {
    const searchbygender = req.body.searchbygender;
    // if( Register.findOne({ firstname: search }) != null){
    const usergender = await Register.findOne({ gender: searchbygender });
    if (usergender !== null) {
      Register.find({ gender : searchbygender }, function (err, result) {
        if (err) {
          console.log(err);
        } else if (usergender.gender === null) {
          Register.find({}, function (err, result) {
            res.render("display", { details: result });
          });
        } else {
          res.render("display", { details: result });
        }
      });
    } else {
      Register.find({}, function (err, result) {
        res.render("display", { details: result });
      });
    }
  } catch (e) {
    res.status(400);
  }
});


const createCsvWriter = require("csv-writer").createObjectCsvWriter;
app.get("/download", async (req, res) => {
  try {
    await Register.find({}).exec((err, data) => {
      if (err) throw err;

      // console.log(data);
      const csvWriter = createCsvWriter({
        path: "csvWriter.csv",
        header: [
          { id: "name", title: "NAME" },
          { id: "phone", title: "PHONE" },
          { id: "email", title: "EMAIL" },
          { id: "gender", title: "GENDER" },
          { id: "hobbies", title: "HOBBIES" },
          { id: "date", title: "DATE OF BIRTH" },
        ],
      });

      csvWriter
        .writeRecords(data)
        .then(() => console.log("Write to csv successfully!"));
    });
    Register.find({}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.render("display", { details: result });
      }
    });
  } catch (e) {
    console.log(e);
  }
});





// app.get("/delete/:id", async (req, res) => {
//   const _id = req.params.id;
//   Register.findByIdAndDelete(_id, function (err, docs) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.redirect("/display");
//     }
//   });







app.get("/genpdf", (req, res) => {
  Register.find({}, function (err, data) {
    const html = fs.readFileSync("./templates/views/genpdf", "utf-8");
    const filename = Math.random(7) + "_doc" + ".pdf";

    let array = [];
    data.forEach((d) => {
      const prod = {
        name: d.name,
        email: d.email,
        gender: d.gender,
        phone: d.phone,
        hobbies: d.hobbies
       
      };
      array.push(prod);
    });
    // console.log(array)

    const users = array;
    //  console.log(users);
    const document = {
      html: html,
      data: {
        users: users,
      },
      path: "./docs/" + filename,
    };

    let options = {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
    };

    pdf
      .create(document, options)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    const filepath = "http://localhost:3000/docs/" + filename;
    // const filepath =
    //     "C:/Users/Atlas/Desktop/node/admin/templates/docs" + filename;
   
    res.render("download", { details: data });
  }).sort({ age: 1 });
});




app.get("/invoice", (req, res) => {
  Register.find({}, function (err, data) {
    res.render("download", { details: data });
  });
  // res.render("invoice");
});



app.get("/generate/:id", async (req, res) => {
  const _id = req.params.id;

  Register.findById(_id, async function (err, data) {
    if (err) {
      console.log(err);
    } else {
      const html = fs.readFileSync("./templates/views/invoice.html", "utf-8");
      const filename = Math.random(5) + ".pdf";

      let array = [];
      const prod = {
        name: data.name,
        email: data.email,
        gender: data.gender,
        phone: data.phone,
        hobbies: data.hobbies,
        date_of_birth: data.date
        
      };
      array.push(prod);
      console.log(array);

      const users = array;
      console.log(users);
      const document = {
        html: html,
        data: {
          users: users,
        },
        path: "./docs/" + filename,
      };

      let options = {
        formate: "A2",
        orientation: "portrait",
        border: "20mm",
        header: {
          height: "15mm",
          contents:
            '<h4 style=" color: red;font-size:20;font-weight:800;text-align:center;">CUSTOMER INVOICE</h4>',
        },
      };
      await pdf
        .create(document, options)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });

      // const filepath = "http://localhost:3000/docs/" + filename;
      // console.log(filename)
      // console.log(filepath)
      const filepath =
        "C:/Users/Atlas/Desktop/node/admin/templates/docs" + filename;
   
        res.download(filepath, filename);
        console.log(filepath);
     
      // fs.unlink(filepath, (err) => {
      //   if (err) {
      //     console.error(err);
      //     return;
      

      //   }
      // });
    }
  });
});


app.get("/generateReport", (req, res) => {
  Register.find({}, function (err, data) {
    const html = fs.readFileSync("./templates/views/genpdf.html", "utf-8");
    const filename = Math.random(7) + "_doc" + ".pdf";

    let array = [];
    data.forEach((d) => {
      const prod = {
        firstname: d.firstname,
        email: d.email,
        gender: d.gender,
        phone: d.phone,
        age: d.age,
      };
      array.push(prod);
    });
    // console.log(array)

    const users = array;
    //  console.log(users);
    const document = {
      html: html,
      data: {
        users: users,
      },
      path: "./docs/" + filename,
    };

    let options = {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
    };

    pdf
      .create(document, options)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    const filepath = "http://localhost:3000/docs/" + filename;
    res.render("download", { details: data });
  }).sort({ age: 1 });
});

app.get("/invoice", (req, res) => {
  Register.find({}, function (err, data) {
    res.render("download", { details: data });
  });
  // res.render("invoice");
});

app.get("/generate/:id", async (req, res) => {
  const _id = req.params.id;

  Register.findById(_id, async function (err, data) {
    if (err) {
      console.log(err);
    } else {
      const html = fs.readFileSync("./templates/views/invoice.html", "utf-8");
      const filename = Math.random(10) + "_doc" + ".pdf";

      let array = [];
      
      const prod = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        gender: data.gender,
        phone: data.phone,
        age: data.age,
      };
      array.push(prod);
      console.log(array);

      const users = array;
      console.log(users);
      const document = {
        html: html,
        data: {
          users: users,
        },
        path: "./docs/" + filename,
      };

      let options = {
        formate: "A3",
        orientation: "portrait",
        border: "2mm",
        header: {
          height: "15mm",
          contents:
            '<h4 style=" color: red;font-size:20;font-weight:800;text-align:center;">CUSTOMER INVOICE</h4>',
        },
      };
      await pdf
        .create(document, options)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      // const filepath = "http://localhost:3000/docs/" + filename;
      // console.log(filename)
      // console.log(filepath)
      const filepath =
        "C:/Users/Atlas/Desktop/node/admin/templates/docs" + filename;
      res.download(filepath, filename);
      console.log(filepath);

      // fs.unlink(filepath, (err) => {
      //   if (err) {
      //     console.error(err);
      //     return;
      //   }
      // });
    }
  });
});

//  app.get("/delete/:id", async (req, res) => {
//    const _id = req.params.id;
//    Register.findByIdAndDelete(_id, function (err, docs) {
//      if (err) {
//        console.log(err);
//      } else {
//        res.render("/display");
//      }
// });
//   });


// app.get("/logout",(req,res)=>{
//   req.logout();
//   res.render("index");
// });


const bcrypt = require("bcryptjs");

// const securePassword = async (password) => {
//  const passwordHash = await bcrypt.hash(password, 10);

//  console.log(passwordHash);

//  const passwordmatch = await bcrypt.compare("vickey1", passwordHash);
//  console.log(passwordmatch); 

// }
// securePassword("vickey");

let imgPath = path.resolve('img', 'logo.png');
// console.log(imgPath);

app.get('/payment', function(req, res){
  res.render('Home', {
  key: Publishable_Key
  })
})

app.post('/payment', function(req, res){
 
   
    
  stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      
      name: 'vickey shrivastava',
      address: {
          line1: 'C/7 SECL Area Korba ',
          postal_code: '495677',
          city: 'Korba',
          state: 'Chattisgarh',
          country: 'India',
      }
  })
  .then((customer) => {

      return stripe.charges.create({
          amount: req.body.amount * 100,    
          description: 'payment gateway testing',
          currency: 'INR',
          customer: customer.id
      });
  })
  .then((charge) => {
      res.send("Success") 
  })
  .catch((err) => {
      res.send(err)   
  });
})


app.get("/qrcode", (req, res, next) => {
  res.render("qrcode");
});



app.post("/scan", (req, res, next) => {
  const input_text = req.body.text; 
  console.log(input_text);
  qrcode.toDataURL(input_text, (err, src) => {
    if (err) res.send("Something went wrong!!");
    res.render("scan", {
      qr_code: src,
    });
  });
});


app.listen(port, () => {
    console.log(`server is running at port ${port}`);
  });

  

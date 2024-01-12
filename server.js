import express from 'express';
import session from 'express-session';
import Sellers from './Models/Sellers.js';
import Offers from './Models/Offers.js';
import Customers from './Models/Customers.js';
import Addresses from './Models/Addresses.js';

const store=new session.MemoryStore();
const app= express();
const PORT = process.env.PORT||9000;

//db connection
import mongoose from 'mongoose';
const url='mongodb+srv://satidiwas:TR49G"We(YUEyQ4@cluster0.is8pr7k.mongodb.net/TrialShopy?retryWrites=true&w=majority';
mongoose.connect(url, { autoIndex: false })
.then(()=>console.log("connection successful")).catch("there was some error");

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret:"your own secret key",
    cookie:{maxAge:3000000},
    resave:false,
    saveUninitialized:true,
    store
}))


app.use((req,res,next)=>{
    console.log(store);
    next();
})


//Authentication API

app.post('/auth/login',(req,res)=>{
    console.log(req.sessionID);
    const {username,pswd}=req.body;
    if(username && pswd){
        if(req.session.authenticated){
            res.status(200).json(req.session);
        }else{
            Sellers.findOne({email: username,
                password: pswd}).then(()=>{
                    req.session.authenticated=true,
                    req.session.user={username,pswd};
                    res.status(200).json(req.session);
                }).catch(()=>res.status(403).send('Bad Credentials'));
                    
        }
    }
    else{
        res.status(403).send('Bad Credentials');
    }
});

app.post('/auth/logout',(req,res)=>{
    const sid=req.sessionID;
    //console.log("session ID: "+sid);
    if(sid && req.session.authenticated){
        store.destroy(sid,(err)=>{
            if(err){
                res.status(505).send(err);
            }
            else {
                console.log(store);
                res.status(200).send("logged out");
            }
        });
    }
    else res.status(401).send("no sid aur or authenticated");
    
});

app.get('/auth/session',(req,res)=>{
    const sid=req.sessionID;
    store.get(sid,(error,session)=>{
        if(error){
            res.status(401).send(error);
        }
        else res.status(200).send(session);
    })
});






//Customers API
app.get('/customers/get',(req,res)=>{
    Customers.find().exec()
    .then((data)=>res.status(201).send(data))
    .catch((err)=>res.status(500).send(err))
});

app.get('/customers/get/:id',(req,res)=>{
    const id=req.query.id;
    Customers.findOne({id:id}).then((data)=>{
        res.status(201).send(data);
    }).catch((err)=>res.status(500).send(err));
})

app.post('/customers/add',(req,res)=>{
   const {Id,email,name}=req.body;
   Customers.create({id:Id,email:email,name:name}).then(()=>{
    res.status(201).send("customer added succesfully");
   }).catch((err)=>res.status(500).send(err));
});

app.put('/customers/update',(req,res)=>{
    const {id,email,name}=req.body;
    Customers.findOneAndUpdate({id:id},{email:email,name:name}).then(()=>res.status(200).send("updated"))
    .catch((e)=>res.status(501).send(e));
});

app.delete('/customers/delete',(req,res)=>{
    const id=req.query.id;
    Customers.deleteOne({id:id}).then(()=>res.status(200).send("deleted"))
    .catch((err)=>res.status(501).send(err));
});






//Geographical data
// app.post('/locations/add',(req,res)=>{
//     const {city,state,country,type}=req.body;
//     Addresses.create({City:city,State:state,Country:country,Type:type}).then(()=>res.status(200).send("added"));
// })  <---this is dummy to add data
app.get('/locations/countries',(req,res)=>{
    Addresses.distinct('Country').then((data)=>{
        res.status(200).send(data);
    });
});

app.get('/locations/states',(req,res)=>{
    Addresses.distinct('State').then((data)=>{
        res.status(200).send(data);
    });
});

app.get('/locations/cities',(req,res)=>{
    Addresses.distinct('City').then((data)=>{
        res.status(200).send(data);
    });
});

app.get('/locations/address-types',(req,res)=>{
    Addresses.distinct('Type').then((data)=>{
        res.status(200).send(data);
    });
});





//Offers API
app.get('/offers',(req,res)=>{
    Offers.find().then((data)=>res.status(200).send(data))
    .catch((e)=>res.send(e));
});

app.post('/offers',(req,res)=>{
    const {id,type,disc}=req.body;
    Offers.create({id:id,productType:type,dicount:disc}).then(()=>res.status(201).send("created offer"))
    .catch((e)=>res.send(e));
});

app.put('/offers/id',(req,res)=>{
    const {id,type,new_disc}=req.body;
    Offers.findOneAndUpdate({id:id},{discount:new_disc}).then(()=>{
        res.status(201).send("offer updated").catch((e)=>res.status(501).send(e));
    });
});

app.delete('/offers/id',(req,res)=>{
    const id=req.query.id;
    Offers.deleteOne({id:id}).then(()=>res.status(200).send("deleted"))
    .catch((err)=>res.status(501).send(err));
});


//listening port
app.listen(PORT, '0.0.0.0', function(err) {
    console.log("Started listening on %s", PORT);
  });
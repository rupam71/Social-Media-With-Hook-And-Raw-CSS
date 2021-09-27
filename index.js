const express = require('express');
const app = express()
const mongoose = require('mongoose')

// MongoDB server setup
mongoose.connect(
    process.env.mongoURI, {
        useNewUrlParser: true,  
     //   useCreateIndex : true, 
        useUnifiedTopology: true
     //   useFindAndModify:false
    })
    .then(()=>console.log('MongoDB Connected'))
    .catch(err=>console.log(`Mongo Error : ${err}`))

//init middleware
app.use(express.json({extended:false}))

app.get('/', (req,res) => res.send('API Running...'));

require('./router/user')(app) //user routing

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`Server Startrd on port ${PORT}.`))
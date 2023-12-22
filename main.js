const express = require("express");
const config = require("./config");
const mongoose = require("mongoose")
const routes = require("./routes/apiRoutes");
const listRoutes = require("./routes/listRoutes")
const cron = require("node-cron");
const webScrapData = require("./services/webScrapService");

const app = express();
// middleware, parsers, etc.
app.use(express.json());
// connect to Mongodb
// mongoose.set('strictQuery',false);
const connectDB = async () => {
    try {
    await  mongoose.connect(config.database.url,{ useNewUrlParser: true, useUnifiedTopology: true })
    await  mongoose.connection.on('error',console.error.bind(console, 'MongoDB connection error:'))
    } catch (error) {
        console.error('failed to connect',error);
        process.exit(1);
    }
}


// app schedules
cron.schedule("15 8 * * *", ()=>{

    webScrapData.getForex();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });
    console.log(`logged at ${formattedDate}`)

})



// list all routes
app.get('/', (req,res)=>{
    res.send("testing api")
});

// routes
app.use("/api",routes);


// error handling middleware
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send("Something went wrong!");

});
const PORT = process.env.PORT || 6500;
connectDB();

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});





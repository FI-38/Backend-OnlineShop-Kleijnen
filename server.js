import { app } from './index.js';
 
const server = app.listen(process.env.PORT, () => { // Starts server. This lines sufficient
    console.log(`Server's running on http://fi.mshome.net:${process.env.PORT}`);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${process.env.PORT} is already in use.`);
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
});



const express = require('express');	
const app = express();

app.get("/api", (req, res) => {
  res.json({"message": "Hello World! from api"})
});

app.listen(5000, () => {
  console.log("listening on port 5000");
})
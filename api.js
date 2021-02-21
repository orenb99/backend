const fs = require("fs");
const PORT=3000;
console.log("server is running on port "+PORT)

function createItem(text,priority,date,checked,id){
   return {
     myTodo: [{
        text: text,
        priority: priority,
        date: date,
        checked:checked
        },
      ],
    id:Math.floor(Math.random()*100000000),
}
}
const express = require('express');
const e = require("express");
const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
  try{
    fs.readdir("./database/",(err,files)=>{
      let length=files.length;
      if(length>0){
        let latest=(JSON.parse(fs.readFileSync("./database/"+files[length-1],"utf-8")));
        res.send(latest);
      }
      if(length===0){
        res({});
        return;
      }
        console.log("list printed");
    })
  }
    catch(e){
      res.status(404).json(e);
    }
})

app.get("/:id",(req,res)=>{
    const {id}= req.params;
    try{
      let data=fs.readFileSync(`./database/${id}.json`,"utf-8");
      res.send(data);
      console.log("item printed");
    }
    catch(e){
      res.send("no item with that id");
    }
})

app.post("/", (req, res) => {
    const { body } = req;
    try {
      if(body.id===null)
        body.id=0;
      fs.writeFileSync(`./database/${body.id}.json`,JSON.stringify(body, null, 4));
      res.status(201).send(`item ${body.id} added`);
    } catch (e) {
      res.status(500).json({ message: "Error!", error: e });
    }
  });

app.put("/:id", (req,res)=>{
  const { id } = req.params;
  const {body}= req;
  try{
    const check=fs.readFileSync(`./database/${id}.json`,"utf-8");
    fs.writeFileSync(`./database/${id}.json`,JSON.stringify(body, null, 4));
    res.send(`item ${id} updated`);
    }
  catch(e){
    res.send("no matching id");
  }
})


app.delete("/:id", (req,res)=>{
  const {id}= req.params;
  try{
  fs.unlinkSync(`./database/${id}.json`);
  res.send(`item ${id} deleted`);
  }
  catch{
    res.send("file doesn't exist");
  }
})

app.delete("/todo/all", (req,res)=>{
  try{
  fs.readdir(`./database/`,(err,files)=>{
    for(let file of files){
        fs.unlinkSync(`./database/${file}`);
    }
  });
  res.send(`directory reset`);
  console.log("database cleared");
  }
  catch(e){
    res.send(e);
  }
})
app.listen(PORT);
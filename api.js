const fs = require("fs");
const PORT=3000;
console.log("server is running on port "+PORT)


const express = require('express');
const e = require("express");
const app = express();
app.use(express.json());

function wait(res,req,next){
  setTimeout(()=>{
    next();
  },1000);
}
app.use(wait);

app.get("/",(req,res)=>{
  try{
    fs.readdir("./database/",(err,files)=>{
      let id=files[files.length-1];
      if(files.length>0){
        let latest=(JSON.parse(fs.readFileSync("./database/"+id,"utf-8")));
        res.send(latest);
      }
      if(files.length===0){
        res.send({
          myTodo:"",
          id:0
        });
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
      if(id>0){
        let zero;
        if(id<10&&id>0)
          zero="000";
        else if(id<100&&id>9)
          zero="00";
        else if(id<1000&id>99)
          zero="0";
        else
          zero=0;
      let data=fs.readFileSync(`./database/${zero+id}.json`,"utf-8");
      res.send(data);
      console.log("undo");
      }
      else{
        res.send({
          myTodo:[],
          id:0
        });
      }
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
      else if(body.id<10&&body.id>0)
        zero="000";
      else if(body.id<100&&body.id>9)
        zero="00";
      else if(body.id<1000&body.id>99)
        zero="0";
      else
        zero=0;
      fs.writeFileSync(`./database/${zero+body.id}.json`,JSON.stringify(body, null, 4));
      res.status(201).send(`item ${body.id} added`);
      console.log("updated list")
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
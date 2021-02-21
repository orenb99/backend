const fs = require("fs");

function createItem(text,priority,date,checked){
   return {
        id: Math.floor(Math.random()*100000000),
        text: text,
        priority: priority,
        date: date,
        checked:checked
    };
}
const express = require('express');
const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
  try{
    fs.readdir("./database/",(err,files)=>{
      let list=[];
      for(let file of files){
        list.push(JSON.parse(fs.readFileSync("./database/"+file,"utf-8")));
      }
      res.send(list);
      console.log("list printed");
    })
  }
    catch(e){
      res.send(e);
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
      const item=createItem(body.text,body.priority,body.date,body.checked);
      fs.writeFileSync(`./database/${item.id}.json`,JSON.stringify(item, null, 4));
      res.status(201).send(`item ${item.id} added`);
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
  res.send(`all items deleted`);
  console.log("database cleared");
  }
  catch(e){
    res.send(e);
  }
})
app.listen(3000);
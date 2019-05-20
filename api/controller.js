const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/weneedcom', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to database error'));

const Dispo = mongoose.model("Dispositif");
const Rubbish = mongoose.model("Rubbish");
const Collect = mongoose.model("Collect");

exports.list_all_dispo = (req, res) => {
    console.log("Connection requested");
    Dispo.find({}, (err, dispo) =>{
        if(err)
            res.send(err);
        res.json(dispo);
    });
}

exports.create_dispo = (req, res) => {
    const new_dispo = new Dispo(req.body);
    new_dispo.save((err, dispo) => {
        if(err)
            res.send(err);
        res.json(dispo);
    });
}

exports.get_dispo = (req, res) => {
    const id = req.params.id;
    Dispo.findById(id, (err, dispo_find) => {
        if(err)
            res.send(err);
        res.json(dispo_find);
    });
}

exports.update_dispo = (req, res) => {
    Dispo.findOneAndUpdate({_id: req.params.id}, req.body,
        function (err, dispo){
            if(err)
                res.send(err);
            res.json(dispo);
        });
}

exports.delete_dispo = (req, res) => {
    Dispo.remove({_id: req.params.id}, (err, dispo) =>{
        if(err)
            res.send(err);
        res.json(dispo)
    });
}

exports.create_rubbish = (req, res) => {
    Rubbish.save(req.body, (err, rubbish) => {
        if(err)
            res.send(err);
        return res.json(rubbish);
    });
}

exports.list_all_rubbish = (req, res) => {
    Rubbish.find({}, (err, rubbishs) => {
        if(err)
            res.send(err);
        res.send(rubbishs);
    });
}

exports.delete_rubbish = (req, res) => {
    const id = req.params.id;
    if(err)
        Rubbish.deleteOne({ _id: id}, (err, rubbish) => {
            res.send(err);
        res.json(rubbish);
    });
}

exports.list_all_collect = (req, res) => {
    Collect.find({}, (err, collects) => {
        if(err)
            res.send(err);
        res.json(collects);
    });
}

exports.create_collect = (req, res) => {
    console.log("collect of " + req.body);
    const new_collect = new Collect(req.body);
    new_collect.save((err, collect) => {
        if(err)
            res.send(err);
        return res.json(collect);
    });
}

exports.delete_collect = (req, res) => {
    const id = req.params.id;
    if(err)
        Collect.deleteOne({ _id: id}, (err, collect) => {
            res.send(err);
        res.json(collect);
    });
}
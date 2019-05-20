const mongoose = require("mongoose");

const Dispositif = mongoose.Schema({
    name: String,
    Date: {
        type: Date,
        default: Date.now
    },
    isDeploy: {
        type: Boolean,
        default: false
    },
    position: {
        x: String,
        y: String
    },

    viewPosition: [{type: Number}],
    contents: [
        {type: String, enum: ["Plastique", "Papier", "Alluminium"], value: String}
    ],
    step: {
        type: Number,
        default: 0
    }
});

module.export = mongoose.model("Dispositif", Dispositif);

const Rubbish = mongoose.Schema({
    quantity: Number,
    unit: [ {type: String, enum: ["LITRE", "TONNE"], value: String} ],
    contents: [
        {type: String, enum: ["Plastique", "Papier", "Alluminium"], value: String}
    ]
});

module.exports = mongoose.model("Rubbish", Rubbish);

const Collect = mongoose.Schema({
    date: {
        type: Date, default: Date.now
    },
    dispo: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Dispositif'} ],
    state: [{
        empty: Boolean,
        replace: Boolean
    }]
});

module.exports = mongoose.model("Collect", Collect);
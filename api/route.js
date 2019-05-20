module.exports = function(app){
    var c = require("./controller");

    app.route("/dispo")
        .get(c.list_all_dispo)
        .post(c.create_dispo);
    
    app.route("/dispo/:id")
        .get(c.get_dispo)
        .put(c.update_dispo)
        .delete(c.delete_dispo);

    app.route("/rubbish")
        .get(c.list_all_rubbish)
        .post(c.create_rubbish);
    
    app.route("/rubbish/:id")
        .get(c.delete_rubbish);

    app.route("/collect")
        .get(c.list_all_collect)
        .post(c.create_collect);
    
    app.route("/collect/:id")
        .get(c.delete_collect);

}
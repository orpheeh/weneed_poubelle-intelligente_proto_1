import 'dart:ui' as prefix0;

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'dart:convert';
import 'dart:ui';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute: '/',
      routes: {
        '/': (context) => MainWidget(),
        '/deployment': (context) => DeploymentWidget(),
        '/collect': (context) => CollectWidget(),
        '/dispodetail': (context) => DispoDetails(),
        '/uob': (contex) => University(),
      },
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.indigo,
      ),
    );
  }
}

class MainWidget extends StatelessWidget {
  @override
  Widget build(BuildContext build) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Plateforme Mobile"),
      ),
      body: Center(
        child: Column(
          children: <Widget>[
            Expanded(
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Icon(Icons.school, size: 50,),
                  Container(
                      padding: EdgeInsets.all(4),
                      margin: EdgeInsets.all(0),
                      child: Text("Universite zero dechet".toUpperCase(),
                          style: TextStyle(
                              color: Colors.black,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 10.0),
                          textAlign: TextAlign.center)),
                ])),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Expanded(
                    child: Container(
                        height: 150,
                        color: Theme.of(build).primaryColor,
                        padding: EdgeInsets.all(10),
                        margin: EdgeInsets.all(4),
                        child: Center(
                            child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            IconButton(
                              icon: Icon(
                                Icons.send,
                                color: Colors.white,
                                size: 40,
                              ),
                              onPressed: () =>
                                  Navigator.pushNamed(build, '/deployment'),
                            ),
                            Text("Déployement".toUpperCase(),
                                style: TextStyle(
                                    color: Colors.white, fontSize: 16))
                          ],
                        )))),
                Expanded(
                    child: Container(
                        height: 150,
                        color: Theme.of(build).primaryColor,
                        padding: EdgeInsets.all(10),
                        margin: EdgeInsets.all(4),
                        child: Center(
                            child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            IconButton(
                              icon: Icon(
                                Icons.delete,
                                color: Colors.white,
                                size: 40,
                              ),
                              onPressed: () =>
                                  Navigator.pushNamed(build, '/collect'),
                            ),
                            Text("Collecte".toUpperCase(),
                                style: TextStyle(
                                    color: Colors.white, fontSize: 16))
                          ],
                        ))))
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Expanded(
                    child: Container(
                        height: 150,
                        color: Theme.of(build).primaryColor,
                        padding: EdgeInsets.all(10),
                        margin: EdgeInsets.all(4),
                        child: Center(
                            child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            IconButton(
                              icon: Icon(Icons.school,
                                  color: Colors.white, size: 40),
                              onPressed: () =>
                                  Navigator.pushNamed(build, '/uob'),
                            ),
                            Text("uob".toUpperCase(),
                                style: TextStyle(
                                    color: Colors.white, fontSize: 16))
                          ],
                        )))),
                Expanded(
                    child: Container(
                        height: 150,
                        color: Theme.of(build).primaryColor,
                        padding: EdgeInsets.all(10),
                        margin: EdgeInsets.all(4),
                        child: Center(
                            child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            Icon(
                              Icons.storage,
                              color: Colors.white,
                              size: 40,
                            ),
                            Text("Valorisation".toUpperCase(),
                                style: TextStyle(
                                    color: Colors.white, fontSize: 16))
                          ],
                        ))))
              ],
            )
          ],
        ),
      ),
    );
  }
}

class DeploymentState extends State<DeploymentWidget> {
  WeNeedMap _painter;
  Future<List<Dispo>> _dispositifs;

  @override
  void initState() {
    super.initState();
    _dispositifs = _fetchDispo();
  }

  @override
  Widget build(BuildContext context) {
    return _mapWidgetBuild(context);
  }

  Future<List<Dispo>> _fetchDispo() async {
    final requestAddr = "http://192.168.15.153:3000/dispo";
    http.Response response = await http.get(requestAddr);
    if (response.statusCode == 200) {
      List<dynamic> list = json.decode(response.body);
      final result =
          List.generate(list.length, (index) => Dispo.fromJson(list[index]))
              .toList();
      return result;
    } else {
      throw Exception("Erreur lors du chargement des dispositifs");
    }
  }

  Widget _mapWidgetBuild(BuildContext context) {
    final scale = 4;
    final x = (400 - scale * 50) / 2;
    final y = (400 - scale * 80) / 2;

    return Scaffold(
        appBar: AppBar(
          title: Text("Déployer le dispositif"),
        ),
        body: Container(
          margin: EdgeInsets.all(10),
          child: FutureBuilder(
            future: _dispositifs,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return Column(
                  children: <Widget>[
                    Listener(
                      onPointerDown: (PointerDownEvent e) {
                        RenderBox box = context.findRenderObject();
                        var position = box.globalToLocal(e.position);
                        List<Dispo> list = snapshot.data;
                        final r = 10;
                        for (int i = 0; i < list.length; i++) {
                          if (list[i].step != _painter.step()) continue;
                          final dx = (list[i].x * scale + x - position.dx);
                          final dy = (list[i].y * scale + y - position.dy);

                          if (dx * dx + dy * dy < r * r) {
                            _askForDeployTrash(list[i].id);
                          }
                        }
                      },
                      child: CustomPaint(
                        size: Size(400, 400),
                        painter: _painter =
                            WeNeedMap(dispositifs: snapshot.data),
                      ),
                    ),
                    Row(
                      children: <Widget>[
                        Container(
                            margin: EdgeInsets.all(20),
                            child: RaisedButton(
                              onPressed: () {
                                _painter.up();
                              },
                              textColor: Colors.white,
                              color: Colors.green,
                              child: Text("Monter"),
                            )),
                        Container(
                            margin: EdgeInsets.all(20),
                            child: RaisedButton(
                              onPressed: () {
                                _painter.down();
                              },
                              textColor: Colors.white,
                              color: Colors.red,
                              child: Text("Descendre"),
                            )),
                      ],
                    )
                  ],
                );
              } else if (snapshot.hasError) {
                return Text("${snapshot.error}");
              }
              return CircularProgressIndicator();
            },
          ),
        ));
  }

  Future<http.Response> updateTrashState(String id) {
    var response = http.put("http://192.168.15.153:3000/dispo/$id",
        headers: {"Content-Type": "application/json"},
        body: '{ "isDeploy": "true" }');
    return response;
  }

  Future<void> _askForDeployTrash(String id) async {
    switch (await showDialog<String>(
        context: context,
        builder: (BuildContext context) {
          return SimpleDialog(
            title: const Text('Avez vous déployé le dispositif?'),
            children: <Widget>[
              SimpleDialogOption(
                onPressed: () {
                  Navigator.pop(context, "yes");
                },
                child: const Text('Oui'),
              ),
              SimpleDialogOption(
                onPressed: () {
                  Navigator.pop(context, "no");
                },
                child: const Text('Non'),
              ),
            ],
          );
        })) {
      case "yes":
        var response = await updateTrashState(id);
        debugPrint(response.body);
        setState(() {
          _dispositifs = _fetchDispo();
          _painter.repaint();
        });
        break;
      case "no":
        break;
    }
  }
}

class WeNeedMap extends CustomPainter {
  bool _repaint = false;
  Paint _paint = new Paint();
  var _drawingFunc = <Function>[];
  var _currentDrawingFunc = 0;
  var dispositifs = [];

  WeNeedMap({this.dispositifs}) {
    _drawingFunc.add(_draw1);
    _drawingFunc.add(_draw2);
  }

  int step() {
    return _currentDrawingFunc;
  }

  void _draw2(Canvas canvas, Size size) {
    final scale = 4;
    final x = (size.width - scale * 50) / 2;
    final y = (size.height - scale * 80) / 2;
    //mur de derrière
    canvas.drawLine(Offset(x, y), Offset(x + scale * 50, y), _paint);
    //mur avant
    canvas.drawLine(Offset(x, y + scale * 40),
        Offset(x + scale * 50, y + scale * 40), _paint);
    //coté
    canvas.drawLine(Offset(x, y), Offset(x, y + scale * 40), _paint);
    canvas.drawLine(Offset(x + scale * 50, y),
        Offset(x + scale * 50, y + scale * 40), _paint);

    for (num i = 0; i < dispositifs.length; i++) {
      if (dispositifs[i].step == _currentDrawingFunc) {
        if (dispositifs[i].isDeploy) {
          _paint.color = Colors.green;
        } else {
          _paint.color = Colors.red;
        }
        canvas.drawCircle(
            Offset(dispositifs[i].x * scale + x, dispositifs[i].y * scale + y),
            10,
            _paint);
        var p = ParagraphBuilder(ParagraphStyle(
          textAlign: TextAlign.center,
          fontSize: 24,
        ));
        p.addText(dispositifs[i].name);

        Paragraph paragraph = p.build();
        paragraph.layout(ParagraphConstraints(width: 100.0));
        canvas.drawParagraph(
          paragraph,
          Offset(dispositifs[i].x * scale + x - 50,
              dispositifs[i].y * scale + y - 50),
        );
      }
    }
  }

  void _draw1(Canvas canvas, Size size) {
    final scale = 4;
    final x = (size.width - scale * 50) / 2;
    final y = (size.height - scale * 80) / 2;
    //mur de derrière
    canvas.drawLine(Offset(x, y), Offset(x + scale * 50, y), _paint);
    //mur avant
    canvas.drawLine(Offset(x, y + scale * 80),
        Offset(x + scale * 15, y + scale * 80), _paint);
    canvas.drawLine(Offset(x + 35 * scale, y + scale * 80),
        Offset(x + scale * 50, y + scale * 80), _paint);
    //coté
    canvas.drawLine(Offset(x, y), Offset(x, y + scale * 80), _paint);
    canvas.drawLine(Offset(x + scale * 50, y),
        Offset(x + scale * 50, y + scale * 80), _paint);
    //office
    canvas.drawLine(Offset(x, y + scale * 40),
        Offset(x + 18 * scale, y + scale * 40), _paint);
    canvas.drawLine(Offset(x + scale * 18, y),
        Offset(x + scale * 18, y + scale * 25), _paint);
    //stair
    _paint.color = Colors.black12;
    canvas.drawRect(
        Rect.fromPoints(
            Offset(x, y + scale * 40), Offset(x + scale * 7, y + scale * 70)),
        _paint);
    //Draw all dispo
    for (num i = 0; i < dispositifs.length; i++) {
      debugPrint("${dispositifs[i].step} $_currentDrawingFunc");
      if (dispositifs[i].step == _currentDrawingFunc) {
        if (dispositifs[i].isDeploy) {
          _paint.color = Colors.green;
        } else {
          _paint.color = Colors.red;
        }
        canvas.drawCircle(
            Offset(dispositifs[i].x * scale + x, dispositifs[i].y * scale + y),
            10,
            _paint);

        var p = ParagraphBuilder(ParagraphStyle(
          textAlign: TextAlign.center,
          fontSize: 24,
        ));
        p.addText(dispositifs[i].name);

        Paragraph paragraph = p.build();
        paragraph.layout(ParagraphConstraints(width: 100.0));
        canvas.drawParagraph(
          paragraph,
          Offset(dispositifs[i].x * scale + x - 50,
              dispositifs[i].y * scale + y - 50),
        );
      }
    }
  }

  @override
  void paint(Canvas canvas, Size size) {
    _paint.color = Colors.green[400];
    canvas.drawRect(
        Rect.fromPoints(Offset.zero, Offset(size.width, size.height)), _paint);
    _paint.color = Colors.white;
    _paint.strokeCap = StrokeCap.butt;
    _paint.strokeWidth = 1;
    _drawingFunc[_currentDrawingFunc](canvas, size);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    bool r = _repaint;
    _repaint = false;
    return r;
  }

  void repaint() {
    _repaint = true;
  }

  void up() {
    if (_currentDrawingFunc + 1 < _drawingFunc.length) {
      _currentDrawingFunc++;
    }
    _repaint = true;
  }

  void down() {
    if (_currentDrawingFunc - 1 >= 0) {
      _currentDrawingFunc--;
    }
    _repaint = true;
  }
}

class Dispo {
  final String name;
  final String id;
  final double x;
  final double y;
  final int step;
  final bool isDeploy;
  final List<dynamic> content;
  List<Map<String, dynamic>> state;

  Dispo(
      {this.name,
      this.id,
      this.x,
      this.y,
      this.step,
      this.isDeploy,
      this.content}) {
    state = List.generate(content.length, (index) {
      return {"empty": false, "replace": false};
    });
  }

  factory Dispo.fromJson(Map<String, dynamic> json) {
    return Dispo(
        name: json['name'],
        id: json['_id'],
        x: double.parse(json['position']['x']),
        y: double.parse(json['position']['y']),
        step: json['step'],
        isDeploy: json['isDeploy'],
        content: json['contents']);
  }
}

class DeploymentWidget extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return DeploymentState();
  }
}

class CollectState extends State<CollectWidget> {
  Future<List<Dispo>> dispositifs;

  @override
  void initState() {
    super.initState();
    dispositifs = _fetchDispo();
  }

  Future<List<Dispo>> _fetchDispo() async {
    final requestAddr = "http://192.168.15.153:3000/dispo";
    http.Response response = await http.get(requestAddr);
    if (response.statusCode == 200) {
      List<dynamic> list = json.decode(response.body);
      final result =
          List.generate(list.length, (index) => Dispo.fromJson(list[index]))
              .toList();
      return result;
    } else {
      throw Exception("Erreur lors du chargement des dispositifs");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Dispositifs"),
        ),
        body: FutureBuilder(
            future: dispositifs,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                List<Dispo> dispo = snapshot.data;

                List<Dispo> util = List.generate(dispo.length,
                    (index) => dispo[index].isDeploy ? dispo[index] : null);
                util.removeWhere((item) => item == null);

                return ListView.builder(
                  itemCount: util.length,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text(util[index].name),
                      onTap: () {
                        Navigator.pushNamed(context, "/dispodetail",
                            arguments: util[index]);
                      },
                    );
                  },
                );
              }
              return Center(child: CircularProgressIndicator());
            }));
  }
}

class CollectWidget extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return CollectState();
  }
}

class Collect {
  final id;
  final dispo;

  Collect({this.id, this.dispo});

  factory Collect.fromJson(Map<String, dynamic> json) {
    return Collect(dispo: json["dispo"], id: json["_id"]);
  }
}

class DispoDetailsState extends State<DispoDetails> {
  Dispo dispositif;
  bool onSave = false;
  Future<Collect> collectFuture;

  Future<Collect> _fetchCollect() async {
    var response = await http.post("http://192.168.15.153:3000/collect",
        headers: {"Content-Type": "application/json"},
        body: json.encode({"dispo": dispositif.id, "state": dispositif.state}));
    return Collect.fromJson(json.decode(response.body));
  }

  @override
  Widget build(BuildContext context) {
    dispositif = ModalRoute.of(context).settings.arguments;

    if (onSave)
      return Scaffold(
          appBar: AppBar(
            title: Text("Détails"),
          ),
          body: Center(child: FutureBuilder(
            future: collectFuture,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    Icon(
                      Icons.check,
                      color: Colors.green,
                      size: 45,
                    ),
                    Text(
                        "Les informations de la collecte ont bien été enregistrées !"),
                    RaisedButton(
                        child: Text("Continuer"),
                        onPressed: () => Navigator.pop(context))
                  ],
                );
              }
              return CircularProgressIndicator();
            },
          )));

    return DefaultTabController(
        length: dispositif.content.length,
        child: Scaffold(
            appBar: AppBar(
              bottom: TabBar(
                tabs: List.generate(
                    dispositif.content.length,
                    (index) => Tab(
                          text: dispositif.content[index],
                          icon: Icon(Icons.delete),
                        )),
              ),
              title: Text("Détails"),
              actions: <Widget>[
                IconButton(
                  icon: Icon(
                    Icons.check,
                    size: 30,
                    color: Colors.white,
                  ),
                  onPressed: () {
                    setState(() {
                      onSave = true;
                      collectFuture = _fetchCollect();
                    });
                  },
                )
              ],
            ),
            body: TabBarView(
                children: List.generate(
              dispositif.content.length,
              (index) {
                return Center(
                    child: Container(
                  padding: EdgeInsets.all(10),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Container(
                          padding: EdgeInsets.all(16),
                          child: Text(
                            dispositif.name,
                            style: TextStyle(
                                fontSize: 24, fontWeight: FontWeight.bold),
                          )),
                      Text(
                        "La poubelle est elle PLEINE ?",
                        style: TextStyle(fontSize: 16),
                      ),
                      Container(
                          margin: EdgeInsets.only(bottom: 8),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Text("Oui"),
                              Radio(
                                groupValue:
                                    dispositif.state[index]["empty"] ? 1 : 0,
                                activeColor: Colors.red,
                                value: 1,
                                onChanged: (value) =>
                                    _handleEmpty(value, index),
                              ),
                              Text("Non"),
                              Radio(
                                groupValue:
                                    dispositif.state[index]["empty"] ? 1 : 0,
                                activeColor: Colors.red,
                                value: 0,
                                onChanged: (value) =>
                                    _handleEmpty(value, index),
                              )
                            ],
                          )),
                      Text("Avez vous REMPLACER la poubelle ?"),
                      Container(
                          margin: EdgeInsets.only(bottom: 8),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Text("Oui"),
                              Radio(
                                groupValue:
                                    dispositif.state[index]["replace"] ? 1 : 0,
                                activeColor: Colors.red,
                                value: 1,
                                onChanged: (value) =>
                                    _handleReplace(value, index),
                              ),
                              Text("Non"),
                              Radio(
                                groupValue:
                                    dispositif.state[index]["replace"] ? 1 : 0,
                                activeColor: Colors.red,
                                value: 0,
                                onChanged: (value) =>
                                    _handleReplace(value, index),
                              )
                            ],
                          )),
                    ],
                  ),
                ));
              },
            ))));
  }

  void _handleEmpty(int value, int index) {
    setState(() {
      dispositif.state[index]["empty"] = value == 1 ? true : false;
    });
  }

  void _handleReplace(int value, int index) {
    setState(() {
      dispositif.state[index]["replace"] = value == 1 ? true : false;
    });
  }
}

class DispoDetails extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return DispoDetailsState();
  }
}

class UniversityState extends State<University> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Université"),
        ),
        body: ListView.builder(
            itemCount: 4,
            itemBuilder: (context, index) {
              return Card(
                  elevation: 4.0,
                  child: Stack(
                    alignment: AlignmentDirectional.bottomStart,
                    children: <Widget>[
                      Image.asset("images/pc.jpg"),
                      Container(
                        padding: EdgeInsets.all(16),
                        color: Color.fromARGB(128, 0, 0, 0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Container(
                                padding: EdgeInsets.only(bottom: 16),
                                child: Text(
                                    "Département de lettre".toUpperCase(),
                                    textAlign: TextAlign.left,
                                    style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white))),
                            Text(
                              "Lorem ipsum dolor sit amet consectetur, adipisicing elit Magnam rem facilis debitis incidunt veritatis blanditiis ad ullam, aliquid libero. Ut maxime illo maiores nisi eos voluptas hic error totam c",
                              style: TextStyle(
                                color: Colors.white,
                              ),
                            )
                          ],
                        ),
                      )
                    ],
                  ));
            }));
  }
}

class University extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return UniversityState();
  }
}

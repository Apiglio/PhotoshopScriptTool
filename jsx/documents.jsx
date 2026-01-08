
#include "layer.jsx"

var doc = app.documents.getByName("test2.psd");
//var lyr = editLayer(doc, ["图例","基础现状图例"]);
var lyr = editLayer(doc, ["道路要素","现状道路","现状道路红线"]);
//lockLayer(doc, ["道路要素","现状道路","现状道路红线"]);
addLayerByNameSeries(doc, ["道路要素","现状道路2","现状道路红线2"], lyr)

// arr=[]
// eachLayer(doc, function(x){
	// if(x.kind==LayerKind.SMARTOBJECT){arr.push(x.linkedLayers.length)};
// });
//alert(nameSeriesByLayer(lyr))

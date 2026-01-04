#include "layer.jsx"


var doc = app.documents.getByName("test1.psd");
var lyr = getLayerToEdit(doc, ["图例","基础现状图例"]);

arr=[]
eachLayer(doc, function(x){
	if(x.kind==LayerKind.SMARTOBJECT){arr.push(x.linkedLayers.length)};
});
alert(arr)
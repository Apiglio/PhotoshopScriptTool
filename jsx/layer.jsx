function array_from(arr){
	return Array.prototype.slice.call(arr);
}

function for_each(arr, callback){
	for(var i=0; i<arr.length; i++){
		callback(arr[i], i, arr);
	}
}

function layerByNameSeries(doc, name_series, callback){
	var current_layer = doc;
	series_remained = array_from(name_series)
	while(series_remained.length > 0){
		lyr_name = series_remained.shift()
		switch(typeof(lyr_name)){
			case "number":
				current_layer = current_layer.layers[lyr_name];
				break;
			case "string":
				current_layer = current_layer.layers.getByName(lyr_name);
				break;
			default:
		}
		callback(current_layer);
	}
	return current_layer;
}

function getLayerToEdit(doc, name_series){
	return layerByNameSeries(doc, name_series, function(x){x.allLocked=false})
}

function lockLayer(doc, name_series){
	return layerByNameSeries(doc, name_series, function(x){x.allLocked=true})
}

function eachLayer(doc_or_set, callback){
	if(!doc_or_set.layers){return;}
	for_each(doc_or_set.layers, function(lyr){
		callback(lyr);
		if(lyr.layers){
			eachLayer(lyr, callback);
		}
	});
}

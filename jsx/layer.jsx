function array_from(arr){
	return Array.prototype.slice.call(arr);
}

function for_each(arr, callback){
	for(var i=0; i<arr.length; i++){
		callback(arr[i], i, arr);
	}
}

//实现用图层名层次序列查找图层引用，并分别在每一层执行callback函数
//如果未找到则返回null
function getLayerByNameSeries(doc, name_series, callback){
	var current_layer = doc;
	var series_remained = array_from(name_series);
	var callback_subjects = [];
	while(series_remained.length > 0){
		lyr_name = series_remained.shift()
		try{
			switch(typeof(lyr_name)){
				case "number":
					current_layer = current_layer.layers[lyr_name];
					break;
				case "string":
					current_layer = current_layer.layers.getByName(lyr_name);
					break;
				default:
			}
		}catch(e){
			return null;
		}
		callback_subjects.push(current_layer);
	}
	for(idx in callback_subjects){
		callback(callback_subjects[idx]);
	}
	return current_layer;
}

//实现用图层名层次序列创建图层引用，并解锁每一层
//如果未找到则返回null
function addLayerByNameSeries(doc, name_series, template_layer){
	var current_layer = doc;
	var series_remained = array_from(name_series);
	while(series_remained.length > 0){
		lyr_name = series_remained.shift()
		try{
			switch(typeof(lyr_name)){
				case "number":
					current_layer = current_layer.layers[lyr_name];
					break;
				case "string":
					current_layer = current_layer.layers.getByName(lyr_name);
					break;
				default:
			}
		}catch(e){
			if(current_layer.typename == "ArtLayer"){
				//需要创建子图层的当前图层是普通图层时，创建同级同名图层组
				parent_name = current_layer.name;
				new_layer = current_layer.parent.layerSets.add();
				new_layer.name = parent_name;
				new_layer.move(current_layer, ElementPlacement.PLACEBEFORE);
				current_layer = new_layer;
			}
			if(series_remained == 0){
				current_layer = current_layer.artLayers.add();
				current_layer.move(current_layer.parent, ElementPlacement.PLACEATBEGINNING);
				//新创建临时的图层放在图层组内最前
			}else{
				//当前图层组内创建图层组
				current_layer = current_layer.layerSets.add();
			}
			current_layer.name = lyr_name;
		}
		current_layer.allLocked = false;
	}
	if(current_layer.typename != "ArtLayer"){
		//最后找到的图层如果不是普通图层，则创建同级同名图层组
		parent_name = current_layer.name;
		new_layer = current_layer.parent.layerSets.add();
		new_layer.name = parent_name;
		new_layer.move(current_layer, ElementPlacement.PLACEBEFORE);
		current_layer = new_layer;
	}
	if(template_layer){
		//如果有模板图层，复制这个图层替换之前创建的空图层
		new_layer = template_layer.duplicate(current_layer, ElementPlacement.PLACEBEFORE);
		new_layer.move(current_layer, ElementPlacement.PLACEBEFORE);
		new_layer.name = current_layer.name;
		current_layer.remove();
		current_layer = new_layer;
	}
	return current_layer;
}

//根据图层名层次的数组返回图层引用，并解锁每一层图层组
function editLayer(doc, name_series){
	return getLayerByNameSeries(doc, name_series, function(x){x.allLocked=false})
}

//根据图层名层次的数组返回图层引用，并锁定每一层图层组
function lockLayer(doc, name_series){
	return getLayerByNameSeries(doc, name_series, function(x){x.allLocked=true})
}

function nameSeriesByLayer(lyr){
	var current_layer = lyr;
	var result = []
	while(current_layer.typename == "ArtLayer"||current_layer.typename == "LayerSet"){
		var name = current_layer.name;
		result.unshift(name);
		current_layer = current_layer.parent;
	}
	return result
}

//递归每一个层次的图层并执行callback函数
function eachLayer(doc_or_set, callback){
	if(!doc_or_set.layers){return;}
	for_each(doc_or_set.layers, function(lyr){
		callback(lyr);
		if(lyr.layers){
			eachLayer(lyr, callback);
		}
	});
}

//在不同psd文件之间更新相同层次的图层
function updateLayerByNameSeries(name_series, srcFile, dstFile){
	var srcLayer = getLayerToEdit(srcFile, name_series);
	var dstLayer = getLayerToEdit(dstFile, name_series);
	if(!srcLayer){throw "未找到有效的源图层";}
	
}
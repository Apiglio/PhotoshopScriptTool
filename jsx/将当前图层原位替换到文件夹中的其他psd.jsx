#include "iter.jsx"
#include "layer.jsx"

var search_key = /土地利用现状图/;
var exclude_key = /宦溪/
var export_pics = true;

var key_document = app.activeDocument;
var key_layer = key_document.activeLayer;
var key_document_fullName = decodeURIComponent(key_document.fullName.fsName);
var key_name_series = nameSeriesByLayer(key_layer);

var inputFolder = Folder.selectDialog("请选择包含PSD文件的文件夹");
if (inputFolder != null) {
	var allPSDFiles = getAllPSDFiles(inputFolder);
	if (allPSDFiles.length > 0) {
		try{
			var dispDiagOpt = app.displayDialogs;
			app.displayDialogs = DialogModes.NO;
			for (i in allPSDFiles) {
				filename = decodeURIComponent(allPSDFiles[i].fsName);
				if (!search_key.test(filename)) {continue;}
				if (exclude_key.test(filename)) {continue;}
				if (filename.toLowerCase() == key_document_fullName) {continue;}
				
				target_document = app.open(new File(allPSDFiles[i]));
				updateLayerByNameSeries(key_name_series, key_document, target_document);
				refreshSmartLink(target_document);
				if(export_pics){ExportToJPEG(target_document);}
				target_document.save();
				target_document.close();
			}
		}finally{
			app.displayDialogs = dispDiagOpt;
		}
	} else {
		alert("在选择的文件夹及其子文件夹中未找到PSD文件");
	}
}
#include "iter.jsx"
#include "layer.jsx"

var search_key = /总图/;
var exclude_key = /AAA/
var export_pics = true;

var key_document = app.activeDocument;
var key_layer = key_document.activeLayer;
var key_document_fullName = decodeURIComponent(key_document.fullName.fsName);
var key_name_series = nameSeriesByLayer(key_layer);
var target_name_series = prompt("插入到其他psd的哪个图层之前（层级以逗号隔开）：",key_name_series).split(",");


var inputFolder = Folder.selectDialog("请选择包含PSD文件的文件夹");
psd_files = [];
if (inputFolder != null) {
	var allPSDFiles = getAllPSDFiles(inputFolder);
	if (allPSDFiles.length > 0) {
		for (i in allPSDFiles) {
			filename = decodeURIComponent(allPSDFiles[i].fsName);
			if (!search_key.test(filename)) {continue;}
			if (exclude_key.test(filename)) {continue;}
			if (filename.toLowerCase() == key_document_fullName.toLowerCase()) {continue;}
			psd_files.push(filename);
		}
	} else {
		alert("在选择的文件夹及其子文件夹中未找到PSD文件");
	}
}

psd_file_path = decodeURIComponent(inputFolder.fsName);
psd_file_list = [];
for (i in psd_files) {
	psd_file_list.push(psd_files[i].replace(psd_file_path, ""))
}
if_process = confirm("是否批量打开处理以下文件并保存：\n  ■"+psd_file_list.join("\t  ■"));

if(if_process) {
	try{
		var dispDiagOpt = app.displayDialogs;
		app.displayDialogs = DialogModes.NO;
		for (i in psd_files) {
			target_document = app.open(new File(psd_files[i]));
			insertLayerByNameSeries(key_name_series, key_document, target_name_series, target_document, ElementPlacement.PLACEBEFORE);
			refreshSmartLink(target_document);
			if(export_pics){ExportToJPEG(target_document);}
			target_document.save();
			target_document.close();
		}
	}finally{
		app.displayDialogs = dispDiagOpt;
	}
} else {
	alert("批量操作被用户取消！");
}


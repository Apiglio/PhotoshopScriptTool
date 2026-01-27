#include "layer.jsx"

function getAllPSDFiles(folder) {
	var allPSDFiles = [];
	function traverseFolder(currentFolder) {
		var files = currentFolder.getFiles("*.psd");
		for (var j = 0; j < files.length; j++) {
			if (files[j] instanceof File) {
				allPSDFiles.push(files[j]);
			}
		}
		var subFolders = currentFolder.getFiles();
		for (var k = 0; k < subFolders.length; k++) {
			if (subFolders[k] instanceof Folder) {
				traverseFolder(subFolders[k]);
			}
		}
	}
	traverseFolder(folder);
	return allPSDFiles;
}

function ExportToJPEG(document) {
	if (!document || !(document instanceof Document)) {
		alert("错误：未传入有效的文档对象，或没有文档处于打开状态。");
		return false;
	}
	try {
		var originalPath = document.fullName;
		var jpgFilePath = new File(originalPath.toString().replace(/\.[Pp][Ss][Dd]$/, '.jpg'));
		var jpgSaveOptions = new JPEGSaveOptions();
		jpgSaveOptions.quality = 10;
		var originalDisplayDialogs = app.displayDialogs;
		app.displayDialogs = DialogModes.NO;
		document.saveAs(jpgFilePath, jpgSaveOptions, true, Extension.LOWERCASE);
		app.displayDialogs = originalDisplayDialogs;
		return true;
	} catch (error) {
		app.displayDialogs = originalDisplayDialogs;
		return false;
	}
}

function updateTitleByFullName(current_doc) {
	fullName = decodeURIComponent(current_doc.fullName.fsName);
	paths = fullName.split("\\");
	title  = paths[paths.length-1].replace(/^[0-9A-Za-z]+\s/,"").replace(/\.[Pp][Ss][Dd]$/,"");
	region = paths[paths.length-2].replace(/^[0-9A-Za-z]+\s/,"");
	written = region == "总图" ? title : region + title;
	var title_layer_series = ["auto:图框", "auto:图名", 0];
	var title_layer = editLayer(current_doc, title_layer_series);
	title_layer.textItem.contents = written;
	editLayer(current_doc, title_layer_series);
}

// function updateTitleByFileName(file) {
	// title  = decodeURIComponent(file.name).replace(/^[0-9A-Za-z]+\s/,"").replace(/\.[Pp][Ss][Dd]$/,"");
	// region = decodeURIComponent(file.parent.name).replace(/^[0-9A-Za-z]+\s/,"");
	// written = region == "总图" ? title : region + title;
	// var current_doc = app.open(file);
	// var title_layer_series = ["auto:图框", "auto:图名", 0];
	// var title_layer = editLayer(current_doc, title_layer_series);
	// title_layer.textItem.contents = written;
	// editLayer(current_doc, title_layer_series);
	// refreshSmartLink(current_doc);
	// current_doc.save();
	// ExportToJPEG(current_doc);
	// current_doc.close();
// }

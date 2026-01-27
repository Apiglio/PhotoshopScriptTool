#include "iter.jsx"
#include "layer.jsx"

var search_key = /土地利用规划图/;
var export_pics = true;

var inputFolder = Folder.selectDialog("请选择包含PSD文件的文件夹");
if (inputFolder != null) {
	var allPSDFiles = getAllPSDFiles(inputFolder);
	if (allPSDFiles.length > 0) {
		try{
			var dispDiagOpt = app.displayDialogs;
			app.displayDialogs = DialogModes.NO;
			for (i in allPSDFiles) {
				filename = decodeURIComponent(allPSDFiles[i].name);
				if (!search_key.test(filename)) {continue;}
				cdoc = app.open(new File(allPSDFiles[i]));
				//修改图层显隐
				lu_0 = getLayerByNameSeries(cdoc, ["用地【链接】","规划用地"],function(x){
					x.allLocked = false;
					x.visible = true;
				});
				lu_1 = editLayer(cdoc, ["用地【链接】","现状用地"]);
				lu_1.visible = false;
				//lu_1.allLocked = true;
				//lockLayer(cdoc, ["用地【链接】","现状用地"]);
				
				updateTitleByFullName(cdoc);
				refreshSmartLink(cdoc);
				if(export_pics){ExportToJPEG(cdoc);}
				cdoc.save();
				cdoc.close();
			}
		}finally{
			app.displayDialogs = dispDiagOpt;
		}
	} else {
		alert("在选择的文件夹及其子文件夹中未找到PSD文件");
	}
}
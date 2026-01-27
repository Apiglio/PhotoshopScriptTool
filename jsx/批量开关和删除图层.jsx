#include "iter.jsx"
#include "layer.jsx"

var search_key = /土地利用规划图/;
var export_pics = true;

hidding_layers = [["用地【链接】","现状用地"]];
showing_layers = [["用地【链接】","规划用地"]];
removal_layers = [["图例","基础现状图例"]];

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
				//隐藏
				for(i in hidding_layers) {
					ns = hidding_layers[i];
					getLayerByNameSeries(cdoc, ns, function(x){
						x.allLocked = false;
						x.visible = false;
					})
				}
				//显示
				for(i in showing_layers) {
					ns = showing_layers[i];
					getLayerByNameSeries(cdoc, ns, function(x){
						x.allLocked = false;
						x.visible = true;
					})
				}
				//移除
				for(i in removal_layers) {
					ns = removal_layers[i];
					lyr = getLayerByNameSeries(cdoc, ns, function(x){
						x.allLocked = false;
					});
					if (lyr) {lyr.remove() };
				}
				//刷新题名和链接
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
#include "iter.jsx"
#include "layer.jsx"

var inputFolder = Folder.selectDialog("请选择包含PSD文件的文件夹");
if (inputFolder != null) {
	var allPSDFiles = getAllPSDFiles(inputFolder);
	if (allPSDFiles.length > 0) {
		try{
			var dispDiagOpt = app.displayDialogs;
			app.displayDialogs = DialogModes.NO;
			for (i in allPSDFiles) {
				//updateTitleByFileName(allPSDFiles[i]);
				current_doc = app.open(new File(decodeURIComponent(allPSDFiles[i])))
				updateTitleByFullName(current_doc);
				refreshSmartLink(current_doc);
				ExportToJPEG(current_doc);
				current_doc.save();
				current_doc.close();
			}
		}finally{
			app.displayDialogs = dispDiagOpt;
		}
	} else {
		alert("在选择的文件夹及其子文件夹中未找到PSD文件");
	}
}
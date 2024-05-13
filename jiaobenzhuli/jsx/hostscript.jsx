function layerkind(){
    //替换智能对象内容并将图层导出到文件<br>文件名作为文件夹

// Replace SmartObject’s Content and Save as JPG
// 2017, use it at your own risk
// Via @Circle B: https://graphicdesign.stackexchange.com/questions/92796/replacing-a-smart-object-in-bulk-with-photoshops-variable-data-or-scripts/93359
// JPG code from here: https://forums.adobe.com/thread/737789

//替换智能对象内容并将所有图层组单独保存为JPG
//修改者：https://github.com/dumplingcoke
//如同源代码注释，源码由2017年所创作，使用它的风险由你自己承担
//代码获取地址：https://gist.github.com/laryn/0a1f6bf0dab5b713395a835f9bfa805c#file-replace_smartobject_image-js

#target photoshop

    if (app.documents.length > 0) {

        var main;
        function main() {

            var myDocument = app.activeDocument;
            if (myDocument.name.match(/(.*)\.[^\.]+$/) == null) {
                alert("导出的图片默认保存在PSD旁，请先对文档执行保存再运行脚本")
            } else {

                var theName = myDocument.name.match(/(.*)\.[^\.]+$/)[1];
                var thePath = myDocument.path;
                var theLayer = myDocument.activeLayer;

                // Check if layer is SmartObject;
                //判断选中图层是不是智能对象
                if (theLayer.kind != "LayerKind.SMARTOBJECT") {

                    alert("选中的图层不是智能对象")

                } else {

                    // Select Files;
                    //选择文件
                    if ($.os.search(/windows/i) != -1) {

                        var theFiles = File.openDialog("选择文件", "*.PNG;*JPG", true)

                    } else {

                        var theFiles = File.openDialog("请选择文件", getFiles, true)

                    };
                    if (theFiles) {

                        for (var m = 0; m < theFiles.length; m++) {

                            // 替换智能对象
                            theLayer = replaceContents(theFiles[m], theLayer);
                            var theNewName = theFiles[m].name.match(/(.*)\.[^\.]+$/)[1];
                            var doc = app.activeDocument;
                            var layerSets = doc.layerSets;
                            var layerSetList = [];

                            for (var i = 0; i < layerSets.length; i++) {

                                layerSetList.push(layerSets[i]);

                            }
                            for (var i = 0; i < layerSetList.length; i++) {

                                var layerSet = layerSetList[i];
                                var layers = layerSet.layers;

                                if (layers.length > 0) {

                                    var visible = layerSet.visible;
                                    var layer = layerSet.merge();
                                    layer.visible = visible;
                                }
                            }

                            function GetArtLayers(doc, allLayers) {
                                for (var m = 0; m < doc.layers.length; m++) {
                                    var theLayer = doc.layers[m];
                                    if (theLayer.typename === "ArtLayer") {

                                        allLayers.push(theLayer);

                                    } else {

                                        GetArtLayers(theLayer, allLayers);
                                    }
                                }
                                return allLayers;
                            }
                            function printLayersName(layerss) {
                                var text = "";
                                for (var i = 0; i < layerss.length; i++) {
                                    var layer = layerss[i];
                                    text = text + layer.name + "\n";
                                }
                                alert(text);
                            }

                            var layers = [];
                            layers = GetArtLayers(doc, layers);

                            var vlayers = [];
                            //保存用户的图层可见状态，隐藏所有图层
                            for (var i = 0; i < layers.length; i++) {
                                var layer = layers[i];
                                layer.visible = false;
                                vlayers.push(layer);
                            }

                            //jpg导出选项
                            jpgSaveOptions = new JPEGSaveOptions();
                            jpgSaveOptions.embedColorProfile = true;
                            jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
                            jpgSaveOptions.matte = MatteType.NONE;
                            jpgSaveOptions.quality = 12;

                            //减去背景，导出所有图层
                            for (var i = 0; i < layers.length - 2; i++) {
                                var layer = layers[i];
                                layer.visible = true;
                                var filename = i + 1;
                                var folders = new Folder(thePath + "/" + theNewName);
                                folders.create();
                                doc.saveAs((new File(folders + "/" + theName + "_" + theNewName + "_" + layer.name + " (" + filename + ")" + ".jpg")), jpgSaveOptions, true, Extension.NONE);
                                //layer.name是图层名称
                                layer.visible = false;
                            }

                            //恢复用户的图层可见状态
                            for (var i = 0; i < vlayers.length; i++) {
                                var layer = vlayers[i];
                                layer.visible = true;
                            }
                            doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 1];
                        }
                    }
                }
            };

            // Get PSDs, TIFs and JPGs from files
            //从文件中获取psd, tiff和jpg
            function getFiles(theFile) {
                if (theFile.name.match(/\.(psd|tif|jpg)$/i) != null || theFile.constructor.name == "Folder") {
                    return true
                };
            };

            // Replace SmartObject Contents
            //替换智能对象
            function replaceContents(newFile, theSO) {
                app.activeDocument.activeLayer = theSO;
                // =======================================================
                var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
                var desc3 = new ActionDescriptor();
                var idnull = charIDToTypeID("null");
                desc3.putPath(idnull, new File(newFile));
                var idPgNm = charIDToTypeID("PgNm");
                desc3.putInteger(idPgNm, 1);
                executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);
                return app.activeDocument.activeLayer
            }
            if (theFiles) {
                for (var m = 1; m <= theFiles.length; m++) {
                    if (m == theFiles.length) {
                        alert("脚本执行结束")
                    }
                }
            }
        }

        app.activeDocument.suspendHistory("替换智能对象", 'main()');
    } else {
        alert("没有打开的文件，无法运行脚本")
    }
}
function layerkinds(){
    /*替换智能对象内容并将图层导出到文件<br>直接导出到PSD旁*/

// Replace SmartObject’s Content and Save as JPG
// 2017, use it at your own risk
// Via @Circle B: https://graphicdesign.stackexchange.com/questions/92796/replacing-a-smart-object-in-bulk-with-photoshops-variable-data-or-scripts/93359
// JPG code from here: https://forums.adobe.com/thread/737789

//替换智能对象内容并将所有图层组单独保存为JPG
//修改者：https://github.com/dumplingcoke
//如同源代码注释，源码由2017年所创作，使用它的风险由你自己承担
//代码获取地址：https://gist.github.com/laryn/0a1f6bf0dab5b713395a835f9bfa805c#file-replace_smartobject_image-js

#target photoshop

    if (app.documents.length > 0) {

        var main;
        function main() {
             
            var myDocument = app.activeDocument;
            if (myDocument.name.match(/(.*)\.[^\.]+$/) == null) {
                alert("导出的图片默认保存在PSD旁，请先对文档执行保存再运行脚本")
            } else {

                var theName = myDocument.name.match(/(.*)\.[^\.]+$/)[1];
                var thePath = myDocument.path;
                var theLayer = myDocument.activeLayer;

                // Check if layer is SmartObject;
                //判断选中图层是不是智能对象
                if (theLayer.kind != "LayerKind.SMARTOBJECT") {

                    alert("选中的图层不是智能对象")

                } else {

                    // Select Files;
                    //选择文件
                    if ($.os.search(/windows/i) != -1) {

                        var theFiles = File.openDialog("选择文件", "*.PNG;*JPG", true)

                    } else {

                        var theFiles = File.openDialog("请选择文件", getFiles, true)

                    };
                    if (theFiles) {

                        for (var m = 0; m < theFiles.length; m++) {

                            // 替换智能对象
                            theLayer = replaceContents(theFiles[m], theLayer);
                            var theNewName = theFiles[m].name.match(/(.*)\.[^\.]+$/)[1];
                            var doc = app.activeDocument;
                            var layerSets = doc.layerSets;
                            var layerSetList = [];

                            for (var i = 0; i < layerSets.length; i++) {

                                layerSetList.push(layerSets[i]);

                            }
                            for (var i = 0; i < layerSetList.length; i++) {

                                var layerSet = layerSetList[i];
                                var layers = layerSet.layers;

                                if (layers.length > 0) {

                                    var visible = layerSet.visible;
                                    var layer = layerSet.merge();
                                    layer.visible = visible;
                                }
                            }

                            function GetArtLayers(doc, allLayers) {
                                for (var m = 0; m < doc.layers.length; m++) {
                                    var theLayer = doc.layers[m];
                                    if (theLayer.typename === "ArtLayer") {

                                        allLayers.push(theLayer);

                                    } else {

                                        GetArtLayers(theLayer, allLayers);
                                    }
                                }
                                return allLayers;
                            }
                            function printLayersName(layerss) {
                                var text = "";
                                for (var i = 0; i < layerss.length; i++) {
                                    var layer = layerss[i];
                                    text = text + layer.name + "\n";
                                }
                                alert(text);
                            }

                            var layers = [];
                            layers = GetArtLayers(doc, layers);

                            var vlayers = [];
                            //保存用户的图层可见状态，隐藏所有图层
                            for (var i = 0; i < layers.length; i++) {
                                var layer = layers[i];
                                layer.visible = false;
                                vlayers.push(layer);
                            }

                            //jpg导出选项
                            jpgSaveOptions = new JPEGSaveOptions();
                            jpgSaveOptions.embedColorProfile = true;
                            jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
                            jpgSaveOptions.matte = MatteType.NONE;
                            jpgSaveOptions.quality = 12;

                            //减去背景，导出所有图层
                            for (var i = 0; i < layers.length - 1; i++) {
                                var layer = layers[i];
                                layer.visible = true;
                                var filename = m + 1;
                                var filenames = i + 1;
                                //var folders = new Folder(thePath + "/" + theNewName);
                                var folders = new Folder(thePath);
                                folders.create();
                                //doc.saveAs((new File(folders + "/" + theName + "_" + theNewName + " (" + filename + ")" + ".jpg")), jpgSaveOptions, true, Extension.NONE);
                                doc.saveAs((new File(folders + "/" + theName+ "_" + filename + " (" + filenames + ")" + ".jpg")), jpgSaveOptions, true, Extension.NONE);
                                layer.visible = false;
                            }

                            //恢复用户的图层可见状态
                            for (var i = 0; i < vlayers.length; i++) {
                                var layer = vlayers[i];
                                layer.visible = true;
                            }
                            doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 1];
                        }
                    }
                }
            };

            // Get PSDs, TIFs and JPGs from files
            //从文件中获取psd, tiff和jpg
            function getFiles(theFile) {
                if (theFile.name.match(/\.(psd|tif|jpg)$/i) != null || theFile.constructor.name == "Folder") {
                    return true
                };
            };

            // Replace SmartObject Contents
            //替换智能对象
            function replaceContents(newFile, theSO) {
                app.activeDocument.activeLayer = theSO;
                // =======================================================
                var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
                var desc3 = new ActionDescriptor();
                var idnull = charIDToTypeID("null");
                desc3.putPath(idnull, new File(newFile));
                var idPgNm = charIDToTypeID("PgNm");
                desc3.putInteger(idPgNm, 1);
                executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);
                return app.activeDocument.activeLayer
            }
            if (theFiles) {
                for (var m = 1; m <= theFiles.length; m++) {
                    if (m == theFiles.length) {
                        alert("脚本执行结束")
                    }
                }
            }
        }

        app.activeDocument.suspendHistory("替换智能对象", 'main()');
    } else {
        alert("没有打开的文件，无法运行脚本")
    }
}
function layerkindss(){

// Replace SmartObject’s Content and Save as JPG
// 2017, use it at your own risk
// Via @Circle B: https://graphicdesign.stackexchange.com/questions/92796/replacing-a-smart-object-in-bulk-with-photoshops-variable-data-or-scripts/93359
// JPG code from here: https://forums.adobe.com/thread/737789

//替换智能对象内容并将所有图层组单独保存为JPG
//修改者：https://github.com/dumplingcoke
//如同源代码注释，源码由2017年所创作，使用它的风险由你自己承担
//代码获取地址：https://gist.github.com/laryn/0a1f6bf0dab5b713395a835f9bfa805c#file-replace_smartobject_image-js

#target photoshop

    if (app.documents.length > 0) {      
        
        var main;

        function main() {
            
            var myDocument = app.activeDocument;
                  
            if (myDocument.name.match(/(.*)\.[^\.]+$/) == null) {
                
                alert("导出的图片默认保存在PSD旁，请先对文档执行保存再运行脚本")
                
            } else {
            
                var theName = myDocument.name.match(/(.*)\.[^\.]+$/)[1];
                var thePath = myDocument.path;
                var theLayer = myDocument.activeLayer;
                var theFiles;
            
                var myWin=new Window("dialog","批量套版",[600,300,1300,700])//x坐标起点，Y坐标起点，X坐标终点，Y坐标终点
        
                var mytianjiabianliangButton=myWin.add("button",[10,10,10,20],"添加变量")
                var mytheFilesButton=myWin.add("button",[600,10,680,20],"选择文件")
                var mykaishitihuanButton=myWin.add("button",[600,40,680,50],"开始替换")
        
                var mydatapanel=myWin.add("panel",[10,200,690,390])
        
                mydatapanel.onDraw=function(){
                    
                    var myPenwhite=mydatapanel.graphics.newPen(mydatapanel.graphics.PenType.SOLID_COLOR,[1,1,1],1)
                    var myPenblack=mydatapanel.graphics.newPen(mydatapanel.graphics.PenType.SOLID_COLOR,[0.1,0.1,0.1],1)
                    var myFont=ScriptUI.newFont("宋体",undefined,14)
                    mydatapanel.graphics.drawString("--------------------------------------------------------------------------------------------------------------------------------------------------------  ------------------------------------------------------",myPenblack,0,0,myFont)
                    mydatapanel.graphics.drawString("图层名称",myPenwhite,10,20,myFont)
                    mydatapanel.graphics.drawString("变量名称",myPenwhite,110,20,myFont)
                    mydatapanel.graphics.drawString("套版图片",myPenwhite,210,20,myFont)
                    
                }
        
                
                 
            }
            
                mytianjiabianliangButton.onClick=function(){
            
                //判断选中图层是不是智能对象
                if (theLayer.kind != "LayerKind.SMARTOBJECT") {

                    alert("选中的图层不是智能对象")

                } else {
                    
                    alert("添加成功")
                    
                }
            
        }
                mytheFilesButton.onClick=function(){
                    
                    alert("该功能未开发")
                    
                    //选择文件
                    /*if ($.os.search(/windows/i) != -1) {

                        theFiles = File.openDialog("选择文件", "*.PNG;*JPG", true)

                    } else {

                        theFiles = File.openDialog("请选择文件", getFiles, true)

                    };
                    
                    alert("文件选择完成")*/
                    
                }
                
                mykaishitihuanButton.onClick=function(){
                if (theFiles) {
                    
                        for (var m = 0; m < theFiles.length; m++) {

                            // 替换智能对象
                            theLayer = replaceContents(theFiles[m], theLayer);
                            var theNewName = theFiles[m].name.match(/(.*)\.[^\.]+$/)[1];
                            var doc = app.activeDocument;
                            var layerSets = doc.layerSets;
                            var layerSetList = [];

                            for (var i = 0; i < layerSets.length; i++) {

                                layerSetList.push(layerSets[i]);

                            }
                            for (var i = 0; i < layerSetList.length; i++) {

                                var layerSet = layerSetList[i];
                                var layers = layerSet.layers;

                                if (layers.length > 0) {

                                    var visible = layerSet.visible;
                                    var layer = layerSet.merge();
                                    layer.visible = visible;
                                }
                            }

                            function GetArtLayers(doc, allLayers) {
                                for (var m = 0; m < doc.layers.length; m++) {
                                    var theLayer = doc.layers[m];
                                    if (theLayer.typename === "ArtLayer") {

                                        allLayers.push(theLayer);

                                    } else {

                                        GetArtLayers(theLayer, allLayers);
                                    }
                                }
                                return allLayers;
                            }
                            function printLayersName(layerss) {
                                var text = "";
                                for (var i = 0; i < layerss.length; i++) {
                                    var layer = layerss[i];
                                    text = text + layer.name + "\n";
                                }
                                alert(text);
                            }

                            var layers = [];
                            layers = GetArtLayers(doc, layers);

                            var vlayers = [];
                            //保存用户的图层可见状态，隐藏所有图层
                            for (var i = 0; i < layers.length; i++) {
                                var layer = layers[i];
                                layer.visible = false;
                                vlayers.push(layer);
                            }

                            //jpg导出选项
                            jpgSaveOptions = new JPEGSaveOptions();
                            jpgSaveOptions.embedColorProfile = true;
                            jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
                            jpgSaveOptions.matte = MatteType.NONE;
                            jpgSaveOptions.quality = 12;

                            //减去背景，导出所有图层
                            for (var i = 0; i < layers.length - 1; i++) {
                                var layer = layers[i];
                                layer.visible = true;
                                var filename = m + 1;
                                var filenames = i + 1;
                                //var folders = new Folder(thePath + "/" + theNewName);
                                var folders = new Folder(thePath);
                                folders.create();
                                //doc.saveAs((new File(folders + "/" + theName + "_" + theNewName + " (" + filename + ")" + ".jpg")), jpgSaveOptions, true, Extension.NONE);
                                doc.saveAs((new File(folders + "/" + theName+ "_" + filename + " (" + filenames + ")" + ".jpg")), jpgSaveOptions, true, Extension.NONE);
                                layer.visible = false;
                            }

                            //恢复用户的图层可见状态
                            for (var i = 0; i < vlayers.length; i++) {
                                var layer = vlayers[i];
                                layer.visible = true;
                            }
                            doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 1];
                        }
                    }else{
                        alert("未选择文件")
                    }
                         // Get PSDs, TIFs and JPGs from files
            //从文件中获取psd, tiff和jpg
            function getFiles(theFile) {
                if (theFile.name.match(/\.(psd|tif|jpg)$/i) != null || theFile.constructor.name == "Folder") {
                    return true
                };
            };

            // Replace SmartObject Contents
            //替换智能对象
            function replaceContents(newFile, theSO) {
                app.activeDocument.activeLayer = theSO;
                // =======================================================
                var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
                var desc3 = new ActionDescriptor();
                var idnull = charIDToTypeID("null");
                desc3.putPath(idnull, new File(newFile));
                var idPgNm = charIDToTypeID("PgNm");
                desc3.putInteger(idPgNm, 1);
                executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);
                return app.activeDocument.activeLayer
            }
            if (theFiles) {
                for (var m = 1; m <= theFiles.length; m++) {
                    if (m == theFiles.length) {
                        alert("脚本执行结束")
                    }
                }
            }
                        //开始运行结束
                    } 
                
                myWin.show()
               
        }
        
        app.activeDocument.suspendHistory("批量套版", 'main()'); 
        
    } else {
        alert("没有打开的文件，无法运行脚本")
    }
}
function layerkindsss(){
    //替换智能对象内容<br>增加子文件夹分类-根据PSD名称命名

// Replace SmartObject’s Content and Save as JPG
// 2017, use it at your own risk
// Via @Circle B: https://graphicdesign.stackexchange.com/questions/92796/replacing-a-smart-object-in-bulk-with-photoshops-variable-data-or-scripts/93359
// JPG code from here: https://forums.adobe.com/thread/737789

//替换智能对象内容并将所有图层组单独保存为JPG
//修改者：https://github.com/dumplingcoke
//如同源代码注释，源码由2017年所创作，使用它的风险由你自己承担
//代码获取地址：https://gist.github.com/laryn/0a1f6bf0dab5b713395a835f9bfa805c#file-replace_smartobject_image-js

#target photoshop

    if (app.documents.length > 0) {

        var main;
        function main() {

            var myDocument = app.activeDocument;
            if (myDocument.name.match(/(.*)\.[^\.]+$/) == null) {
                alert("导出的图片默认保存在PSD旁，请先对文档执行保存再运行脚本")
            } else {

                var theName = myDocument.name.match(/(.*)\.[^\.]+$/)[1];
                var thePath = myDocument.path;
                var theLayer = myDocument.activeLayer;

                // Check if layer is SmartObject;
                //判断选中图层是不是智能对象
                if (theLayer.kind != "LayerKind.SMARTOBJECT") {

                    alert("选中的图层不是智能对象")

                } else {

                    // Select Files;
                    //选择文件
                    if ($.os.search(/windows/i) != -1) {

                        var theFiles = File.openDialog("选择文件", "*.PNG;*JPG", true)

                    } else {

                        var theFiles = File.openDialog("请选择文件", getFiles, true)

                    };
                    if (theFiles) {

                        for (var m = 0; m < theFiles.length; m++) {

                            // 替换智能对象
                            theLayer = replaceContents(theFiles[m], theLayer);
                            var theNewName = theFiles[m].name.match(/(.*)\.[^\.]+$/)[1];
                            var doc = app.activeDocument;
                            var layerSets = doc.layerSets;
                            var layerSetList = [];

                            for (var i = 0; i < layerSets.length; i++) {

                                layerSetList.push(layerSets[i]);

                            }
                            for (var i = 0; i < layerSetList.length; i++) {

                                var layerSet = layerSetList[i];
                                var layers = layerSet.layers;

                                if (layers.length > 0) {

                                    var visible = layerSet.visible;
                                    var layer = layerSet.merge();
                                    layer.visible = visible;
                                }
                            }

                            function GetArtLayers(doc, allLayers) {
                                for (var m = 0; m < doc.layers.length; m++) {
                                    var theLayer = doc.layers[m];
                                    if (theLayer.typename === "ArtLayer") {

                                        allLayers.push(theLayer);

                                    } else {

                                        GetArtLayers(theLayer, allLayers);
                                    }
                                }
                                return allLayers;
                            }
                            function printLayersName(layerss) {
                                var text = "";
                                for (var i = 0; i < layerss.length; i++) {
                                    var layer = layerss[i];
                                    text = text + layer.name + "\n";
                                }
                                alert(text);
                            }

                            var layers = [];
                            layers = GetArtLayers(doc, layers);

                            var vlayers = [];
                            //保存用户的图层可见状态，隐藏所有图层
                            for (var i = 0; i < layers.length; i++) {
                                var layer = layers[i];
                                layer.visible = false;
                                vlayers.push(layer);
                            }

                            //jpg导出选项
                            jpgSaveOptions = new JPEGSaveOptions();
                            jpgSaveOptions.embedColorProfile = true;
                            jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
                            jpgSaveOptions.matte = MatteType.NONE;
                            jpgSaveOptions.quality = 12;

                            //减去背景，导出所有图层
                            for (var i = 0; i < layers.length - 2; i++) {
                                var layer = layers[i];
                                layer.visible = true;
                                var filename = i + 1;
                                var folders = new Folder(thePath + "/" + theNewName + "/" + theName);
                                folders.create();
                                doc.saveAs((new File(folders + "/" + theName + "_" + theNewName + "_" + layer.name + " (" + filename + ")" + ".jpg")), jpgSaveOptions, true, Extension.NONE);
                                //layer.name是图层名称
                                layer.visible = false;
                            }

                            //恢复用户的图层可见状态
                            for (var i = 0; i < vlayers.length; i++) {
                                var layer = vlayers[i];
                                layer.visible = true;
                            }
                            doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 1];
                        }
                    }
                }
            };

            // Get PSDs, TIFs and JPGs from files
            //从文件中获取psd, tiff和jpg
            function getFiles(theFile) {
                if (theFile.name.match(/\.(psd|tif|jpg)$/i) != null || theFile.constructor.name == "Folder") {
                    return true
                };
            };

            // Replace SmartObject Contents
            //替换智能对象
            function replaceContents(newFile, theSO) {
                app.activeDocument.activeLayer = theSO;
                // =======================================================
                var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
                var desc3 = new ActionDescriptor();
                var idnull = charIDToTypeID("null");
                desc3.putPath(idnull, new File(newFile));
                var idPgNm = charIDToTypeID("PgNm");
                desc3.putInteger(idPgNm, 1);
                executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);
                return app.activeDocument.activeLayer
            }
            if (theFiles) {
                for (var m = 1; m <= theFiles.length; m++) {
                    if (m == theFiles.length) {
                        alert("脚本执行结束")
                        
                    }
                }
            }
        }

        app.activeDocument.suspendHistory("替换智能对象", 'main()');
    } else {
        alert("没有打开的文件，无法运行脚本")
    }
}
function batchReplaceText(){
    
    //批量替换文本-多文档替换文本
    
    // 创建窗口
var dialog = new Window("dialog", "批量替换文本");
dialog.orientation = "column";

// 添加选择文件按钮
var filesGroup = dialog.add("group");
filesGroup.add("statictext", undefined, "选择要处理的文件:");
var filesText = dialog.add("edittext", undefined, "", {multiline:true, readonly:true, scrollable:true});
filesText.characters = 40; // 设置宽度
filesText.preferredSize.height = 80; // 设置高度
var browseButton = filesGroup.add("button", undefined, "浏览");
browseButton.onClick = function() {
    var files = File.openDialog("请选择要处理的文件", "*.psd", true);
    if (files) {
        var fileList = "";
        for (var i = 0; i < files.length; i++) {
            fileList += files[i].fullName + "\n";
        }
        filesText.text = fileList;
    }
};

// 添加文本字段和按钮
var findTextFields = [];
var replaceTextFields = [];
var NameFieldGroup = dialog.add("group");
var groupCheckBox = NameFieldGroup.add("checkbox", undefined, "仅修改指定编组名称中的文本:");
var groupNameField = NameFieldGroup.add("edittext", undefined, "");
groupNameField.characters = 10; // 根据需要调整字段长度
var addButton = dialog.add("button", undefined, "添加替换规则");
var confirmButton = dialog.add("button", undefined, "开始替换");

// 加载上次编辑时的复选框状态和文本字段值
var prefsFile = new File(Folder.userData + "/CustomReplacePrefs.ini");
if (prefsFile.exists) {
    prefsFile.open("r");
    var checkBoxValue = prefsFile.readln();
    groupCheckBox.value = checkBoxValue === 'true';
    var savedGroupName = prefsFile.readln();
    if (savedGroupName !== "") {
        groupNameField.text = savedGroupName;
    }
    prefsFile.close();
}

// 添加按钮点击事件
addButton.onClick = function() {
    addTextFieldAndButton();
    // 重新布局窗口
    dialog.layout.layout(true);
    dialog.layout.resize();
}

// 确认按钮点击事件
confirmButton.onClick = function() {
    var findTexts = [];
    var replaceTexts = [];
    
    // 获取所有文本字段中的值
    for (var i = 0; i < findTextFields.length; i++) {
        findTexts.push(findTextFields[i].text);
        replaceTexts.push(replaceTextFields[i].text);
    }

    // 替换文本
    var groupName = groupNameField.text;
    var checkGroup = groupCheckBox.value;
    replaceText(findTexts, replaceTexts, groupName, checkGroup);
}

// 退出窗口时保存复选框的状态和文本字段值
dialog.onClose = function() {
    var prefs = new File(Folder.userData + "/CustomReplacePrefs.ini");
    prefs.open("w");
    prefs.writeln(groupCheckBox.value);
    prefs.writeln(groupNameField.text);
    prefs.close();
}

// 显示窗口
dialog.show();

// 添加新的文本字段和按钮
function addTextFieldAndButton() {
    var group = dialog.add("group");
    
    group.add("statictext", undefined, "原文本:");
    var findText = group.add("edittext", undefined, "");
    findText.characters = 9;
    findTextFields.push(findText); // 将新的原文本字段添加到数组中
    
    group.add("statictext", undefined, "替换文本:");
    var replaceText = group.add("edittext", undefined, "");
    replaceText.characters = 9;
    replaceTextFields.push(replaceText); // 将新的替换文本字段添加到数组中
    
    var removeButton = group.add("button", undefined, "删除");
    
    // 删除按钮点击事件
    removeButton.onClick = function() {
        //alert("删除按钮点击事件")
        var groupToRemove = this.parent; // 获取删除按钮的父容器（组）
        removeGroup(groupToRemove);
    }
}

// 删除按钮点击事件（在外部定义）
function removeGroup(groupToRemove) {
    if (groupToRemove) {
        // 清除文本字段组中的文本字段
        groupToRemove.children[1].text = ""; // 清除原文本字段
        groupToRemove.children[3].text = ""; // 清除替换文本字段

        // 隐藏父容器并设置高度为0
        groupToRemove.visible = false;
        groupToRemove.size.height = 0;

         // 从数组中移除对应的查找文本字段和替换文本字段
        for (var i = 0; i < findTextFields.length; i++) {
            if (findTextFields[i] === groupToRemove.children[1]) {
                findTextFields.splice(i, 1);
                break;
            }
        }

        for (var j = 0; j < replaceTextFields.length; j++) {
            if (replaceTextFields[j] === groupToRemove.children[3]) {
                replaceTextFields.splice(j, 1);
                break;
            }
        }

        // 从父容器中移除子元素
        groupToRemove.parent.remove(groupToRemove);

        // 重新布局窗口
        dialog.layout.layout(true);
        dialog.layout.resize();
    }
}

// 替换文本函数
function replaceText(findTexts, replaceTexts, groupName, checkGroup) {
    var files = filesText.text.split("\n");
    
    for (var i = 0; i < files.length; i++) {
        var file = new File(files[i]);
        if (file.exists) {
            var doc = app.open(file); // 打开文件
            
            // 替换特定文字
            if (checkGroup) {
                var targetGroup = findLayerByName(doc, groupName, doc.layers);
                if (targetGroup) {
                    // 遍历用户指定的编组中的所有图层
                    traverseLayers(targetGroup, findTexts, replaceTexts);
                }
            } else {
                // 遍历所有图层
                traverseLayers(doc, findTexts, replaceTexts);
            }
            // 保存并关闭文件
            doc.save();
            doc.close(SaveOptions.SAVECHANGES);
        }
    }
    alert("所有文件处理完成！");
}

// 辅助函数：递归查找特定名称的图层或编组
function findLayerByName(doc, name, layers) {
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].name == name) {
            return layers[i];
        } else if (layers[i].typename == 'LayerSet') { // 如果是编组，则递归查找
            var found = findLayerByName(doc, name, layers[i].layers);
            if (found) return found;
        }
    }
    return null;
}

// 辅助函数：递归遍历图层并替换文本
function traverseLayers(root, findTexts, replaceTexts) {
    for (var i = 0; i < root.layers.length; i++) {
        var layer = root.layers[i];
        if (layer.kind == LayerKind.TEXT) {
            // 文本图层，检查并替换文本
            var textItem = layer.textItem;
            var oldText = textItem.contents;
            for (var j = 0; j < findTexts.length; j++) {
                var findText = findTexts[j];
                var replaceText = replaceTexts[j];
                var newText = oldText.replace(new RegExp(findText, 'g'), replaceText);
                oldText = newText;
            }
            if (newText !== textItem.contents) {
                textItem.contents = newText;
            }
        } else if (layer.typename == 'LayerSet') { // 如果是图层集合，则递归遍历
            traverseLayers(layer, findTexts, replaceTexts);
        }
    }
}

    
}
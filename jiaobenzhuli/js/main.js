/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
    'use strict';

    var csInterface = new CSInterface();
    
    
    function init() {
                
        themeManager.init();
                
        $("#btn_test").click(function () {
            csInterface.evalScript('layerkind()');
        });
        
        $("#btn_tests").click(function () {
            csInterface.evalScript('layerkinds()');
        });
        
        $("#btn_testss").click(function () {
            csInterface.evalScript('layerkindss()');
        });
        
        $("#btn_testsss").click(function () {
            csInterface.evalScript('layerkindsss()');
        });
        
        $("#btn_batchReplaceText").click(function () {
            csInterface.evalScript('batchReplaceText()');
        });
        
    }
        
    init();

}());
    

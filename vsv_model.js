 
function INIT_VSV_MODEL_TAB()
{

    metaobj_vsv_model = new smisMeta({  "NoFlash":1, "debug": 1, "debug_func" : function(msg){	tlog(msg); }, conf: MetaDATA_conf.vsv_models, loadingHTML: "&nbsp;&nbsp;&nbsp;Обновление ...<br><br>",nodataHTML: "&nbsp;&nbsp;&nbsp;Нет данных<br><br>" });
    metaobj_vsv_model.OnMetaUpdate = vsv_model_OnMetaUpdate;
    metaobj_vsv_model.renderMakeParams = vsv_model_makeMetaParams;
    
    reload_vsv_model_parameters();
}

function reload_vsv_model_parameters()
{

	if(active_tab=="tab_vsv_model")
	{
		metaobj_vsv_model.get();
	}	  
    
}

function vsv_model_OnMetaUpdate(opts)
{ 
	if(opts && opts.metadataid)
	{
		var obj = document.getElementById("_metadata_eruptions_info");

		if(defined(opts.INFO.common.count) && opts.INFO.common.count!==null)
		{       
				if(project_language == 'rus')
				{
					obj.innerHTML = "Моделирований: "+opts.INFO.common.count;
				}	
				if(project_language == 'eng')
				{
					obj.innerHTML = "Objects: "+opts.INFO.common.count;
				}	
		}
		else
		{
			obj.innerHTML = "&nbsp;";
		}
	}
}

function vsv_model_makeMetaParams(opts)
{  
	var params={};
	
	if(opts.DATA.volcanoe_id) 
	{ 
	    var vol_name;
	    if(opts.INFO.volcanoes[opts.DATA.volcanoe_id])
	    {   
	        vol_name = opts.INFO.volcanoes[opts.DATA.volcanoe_id]["smis_rus_name"];
	    }
	    else
	    {
	        alert("Error in vsv model metadata (E1): vol_name is undefined if vol_id="+opts.DATA.volcanoe_id);
	        vol_name = "-";
	    }
	    params.vname = vol_name; 
	}

	if(opts.DATA.start) { params.dt = opts.DATA.start; }
	
	return params;
    
}

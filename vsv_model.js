 
function INIT_VSV_MODEL_TAB()
{
    metaobj_vsv_model = new smisMeta({  "NoFlash":1, "debug": 1, "debug_func" : function(msg){	tlog(msg); }, conf: MetaDATA_conf.vsv_models, loadingHTML: "&nbsp;&nbsp;&nbsp;Обновление ...<br><br>",nodataHTML: "&nbsp;&nbsp;&nbsp;Нет данных<br><br>" });
    metaobj_vsv_model.OnMetaUpdate = vsv_model_OnMetaUpdate;
    metaobj_vsv_model.renderMakeParams = vsv_model_makeMetaParams;
    metaobj_vsv_model.OnMetaClick = vsv_model_OnMetaClick;

    metaobj_vsv_model_states = new smisMeta({  "NoFlash":1, "debug": 1, "debug_func" : function(msg){	tlog(msg); }, conf: MetaDATA_conf.vsv_model_states, loadingHTML: "&nbsp;&nbsp;&nbsp;Обновление ...<br><br>",nodataHTML: "&nbsp;&nbsp;&nbsp;Нет данных<br><br>" });
    metaobj_vsv_model_states.renderMakeParams = vsv_model_states_makeMetaParams;

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

function vsv_model_states_makeMetaParams(opts)
{  
	var params={};
	
	if(opts.DATA.dt) { params.dt = opts.DATA.dt; }
	if(opts.DATA.state_id) { params.state_id = opts.DATA.state_id; }
	
	return params;
    
}


function vsv_model_OnMetaClick()
{ 
		reload_vsv_states_parameters();
}

function reload_vsv_states_parameters()
{
    var UID = 0;
    
	var selected = metaobj_vsv_model.GetSelectedMetaInfo();
    
    if(selected[0])
    {
        UID = selected[0]['uid'];
    }
    
	var params = { data_params:  {	task_id: UID	} };

	metaobj_vsv_model_states.SetDataParams(params);
	
	metaobj_vsv_model_states.get();
    
    document.getElementById("_metadata_eruptions_states_info").innerHTML = "&nbsp;";
}


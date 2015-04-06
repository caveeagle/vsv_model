
var vsv_model_params = {};
 
function INIT_VSV_MODEL_TAB()
{
    metaobj_vsv_model = new smisMeta({  "NoFlash":1, "debug": 1, "debug_func" : function(msg){	tlog(msg); }, conf: MetaDATA_conf.vsv_models, loadingHTML: "&nbsp;&nbsp;&nbsp;Обновление ...<br><br>",nodataHTML: "&nbsp;&nbsp;&nbsp;Нет данных<br><br>" });
    metaobj_vsv_model.OnMetaUpdate = vsv_model_OnMetaUpdate;
    metaobj_vsv_model.renderMakeParams = vsv_model_makeMetaParams;
    metaobj_vsv_model.OnMetaClick = vsv_model_OnMetaClick;

    metaobj_vsv_model_states = new smisMeta({  "NoFlash":1, "debug": 1, "debug_func" : function(msg){	tlog(msg); }, conf: MetaDATA_conf.vsv_model_states, loadingHTML: "&nbsp;&nbsp;&nbsp;Обновление ...<br><br>",nodataHTML: "&nbsp;&nbsp;&nbsp;Нет данных<br><br>" });
    metaobj_vsv_model_states.renderMakeParams = vsv_model_states_makeMetaParams;
    metaobj_vsv_model_states.OnMetaUpdate = vsv_model_states_OnMetaUpdate;
    metaobj_vsv_model_states.OnMetaClick = vsv_model_states_OnMetaClick;
    
    reload_vsv_model_parameters();
}

function reload_vsv_model_parameters()
{
	if(active_tab=="tab_vsv_model")
	{
            make_vsv_models_params();
	}	  
}

function tab_vsv_model_onactive()
{
    if(typeof metaobj_vsv_model != "undefined")
    {
        reload_vsv_model_parameters();
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
		setVModelLayers();
}

function reload_vsv_states_parameters()
{
    var UID = -1;
    
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

function vsv_model_states_OnMetaUpdate(opts)
{ 
	if(opts && opts.metadataid)
	{
		var obj = document.getElementById("_metadata_eruptions_states_info");

		if(defined(opts.INFO.common.count) && opts.INFO.common.count!==null)
		{       
				if(project_language == 'rus')
				{
					obj.innerHTML = "Состояний: "+opts.INFO.common.count;
				}	
				if(project_language == 'eng')
				{
					obj.innerHTML = "STATES: "+opts.INFO.common.count;
				}	
		}
		else
		{
			obj.innerHTML = "&nbsp;";
		}
	} 
	
	var selected = metaobj_vsv_model.GetSelectedMetaInfo();
    
    if(!selected[0])
    {
       obj.innerHTML = "&nbsp;";
    }
	
}

function vsv_model_states_OnMetaClick()
{ 
    setVModelLayers();		
}

function clearVSVModelSelection()
{
    metaobj_vsv_model.ClearSelection();
    metaobj_vsv_model_states.ClearSelection();
    reload_vsv_states_parameters(); // Очищает нижний список, так как задает UID = -1 
    setVModelLayers();
}

function clearVSVModelStatesSelection()
{
    metaobj_vsv_model_states.ClearSelection();
    setVModelLayers();
}

function setVModelLayers()
{ 
    if(vsv_model_visible)
    {
        var selected = metaobj_vsv_model_states.GetSelectedMetaInfo();
        if(selected[0])
        {
        	var STATE_UID = selected[0]['uid'];
        	
        	if(layers["vsv_model"].params)
        	{
        	    layers["vsv_model"].params["vsv_signal_tasks_state_id"] = STATE_UID;
        	}
        	
            var selected_t = metaobj_vsv_model.GetSelectedMetaInfo();
            if(selected_t[0])
            {
        	    var TASK_UID = selected_t[0]['uid'];
        	    layers["vsv_model"].params["vsv_signal_tasks_task_id"] = TASK_UID;
            }
            else
            {
                alert("Error in layers params (E5)");
            }
        	
        	
        	mapobj.LayerShow('vsv_model');
        }
        else
        {
        	mapobj.LayerHide('vsv_model');
        }
    }
    else
    {
    	mapobj.LayerHide('vsv_model');
    }
        
}	

function make_vsv_models_params()
{
    var el1 = document.getElementById("vol_id_for_vsv_model");
    var t1  = el1.options[el1.selectedIndex];
    var v1 = t1.value;
    
    if(v1 == 'ALL') {v1 = ""};
    
    vsv_model_params = { data_params:
        {
            nocache: randomString(5),
            volcanoe_smis_name: v1
        }};
    
    metaobj_vsv_model.SetDataParams(vsv_model_params);
    metaobj_vsv_model.get();  
}

var vsv_model_visible=1;
function setVSVModelsVisible(i)
{
	if(i)
	{
		vsv_model_visible = 1;
		tabVeil("tab_vsv_model",0);
	}
	else	
	{
		vsv_model_visible = 0;
		tabVeil("tab_vsv_model",1);
	}
	
	setVModelLayers();
}


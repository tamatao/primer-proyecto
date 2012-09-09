var app = {
	library:function(){
		//$("#map_canvas").fadeOut("fast");
		var modal = $("<div/>");
		var content = $("<div/>", {"class":"view-menu"}).append(
			$("<ul/>").append(
				$("<li/>").append(
					$("<div/>", {"class":"view-icon"}).append($("<img/>", {"src":"images/1345356326_agency.png"})),
					$("<div/>", {"class":"view-description"}).append(
						$("<h1/>").html("Company"), 
						$("<p/>").html("Description company"),
						$("<a/>", {"data-role":"button"}).html("New").button().click(function(){modal.dialog( "close" );app.addRegister("company")}),
						$("<a/>", {"data-role":"button"}).html("View").button().click(function(){modal.dialog( "close" );app.viewlist("company")})
					)
				),
				$("<li/>").append(
					$("<div/>", {"class":"view-icon"}).append($("<img/>", {"src":"images/1345356719_organization.png"})),
					$("<div/>", {"class":"view-description"}).append(
						$("<h1/>").html("Department"), 
						$("<p/>").html("Description department"),
						$("<a/>", {"data-role":"button"}).html("New").button().click(function(){modal.dialog( "close" );app.addRegister("department")}),
						$("<a/>", {"data-role":"button"}).html("View").button().click(function(){modal.dialog( "close" );app.viewlist("department")})
					)
				),
				$("<li/>").append(
					$("<div/>", {"class":"view-icon"}).append($("<img/>", {"src":"images/1345355051_gps.png"})),
					$("<div/>", {"class":"view-description"}).append(
						$("<h1/>").html("Devices"), 
						$("<p/>").html("Description devices"),
						$("<a/>", {"data-role":"button"}).html("New").button().click(function(){modal.dialog( "close" );app.addRegister("devices")}),
						$("<a/>", {"data-role":"button"}).html("View").button().click(function(){modal.dialog( "close" );app.viewlist("devices")})
					)					
				)
			)
		);
		//$("#ctn_display").empty().append(content);
		//$("#ctn_display").fadeIn("fast");
		modal.append(content).dialog({
			width: 550,
			modal: true,
			resizable: false
		});
		$(".ui-dialog-titlebar").remove();
		$(".ui-widget-overlay").click(function(){modal.dialog( "close" )})
	},
	showDevices:function(show){
		var menu = $(".navDevicesMenu");
		if(menu.length==0){
			var menu = $("<div/>", {"class":"navDevicesMenu","style":"opacity:0"}).append(
				$("<div/>", {"id":"menu"}).append(
					$("<a/>", {"id":"locatorScreen", "href":"locatorScreen.html"}).html("&nbsp;"),
					$("<a/>", {"id":"historyScreen", "href":"historyScreen.html"}).html("&nbsp;"),
					$("<a/>", {"id":"geofenceScreen", "href":"geofenceScreen.html"}).html("&nbsp;")
				),
				$("<div/>",{"id":"content"}).append(
					$("<p/>", {"id":"contentIntro"}).html("Shows all vehicles currently being tracked. The left border indicates which group (if any) a locator belongs to."),
					$("<div/>").append(
						$("<div/>", {"class":"locatorHeadings"}).append($("<p/>").html("Show&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Color&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name")),
						$("<div/>",{"class":"locatorList"})
					)
				)
			)
			$("#listbox").append(
				menu
			);
			
			menu.mouseleave(function(){
				app.showDevices();
			})
		
			app.request({
				url:"devices.js", 
				success:function(data){
					for(var key in data.payload.devices){
						var eachDevices = data.payload.devices[key];
						var device = $("<div/>").append(
							$("<div/>", {"class":"locator", "style":"border-left: 5px solid " + eachDevices.color}).append(
								$("<input/>", {"class":"column locatorCheckbox", "type":"checkbox"}),
								$("<div/>", {"class":"color column", "style":"background-color:" + eachDevices.color}).html("&nbsp;"),
								$("<p/>",{"class":"locatorName column"}).html(eachDevices.name),
								$("<br class='clear' />")
							),
							$("<div/>",{"class":"locatorExpand hidden"}).append(
								$("<a/>",{"class":"historyIcon","href":"personaliseLocator.html"}).html("&nbsp;"),
								$("<a/>",{"class":"infoIcon","href":"historyScreen.html"}).html("&nbsp;"),
								$("<a/>",{"class":"personaliseIcon","href":"#"}).html("&nbsp;"),
								$("<a/>",{"class":"micIcon","href":"#"}).html("&nbsp;")
							)
						)
						$(".locatorList").append(device).addClass("scroll-pane");
					}
				}
			})
		}
		if(menu.css('opacity') == "0"){
		//if(show){
			menu.css({
				"position":"absolute",
				"left": "40px",
				"top": "10px",
				"opacity":0,
				"display":"block"
			});
			menu.animate({
				opacity: .9,
				left: '+=20',
			}, 300, function(){
			});
		}else{
			menu.animate({
				opacity: 0,
				left: '-=20',
			}, 300, function(){
				menu.css("display","none")
			});
		}
	},
	viewlist:function(sView){
		$("#map_canvas").fadeOut("fast");
		
		switch(sView){
			case "company": sDefinitionJS = "definitionViewCompany.js"; break;
			case "department": sDefinitionJS = "definitionViewDepartment.js"; break;
			case "devices": sDefinitionJS = "definitionViewDevices.js"; break;
		}
		
		var dataTable = $("<table/>", {"id":sView});
		$("#ctn_display").empty().append(dataTable);
		
		var deferred = $.Deferred();
		app.request({url:sDefinitionJS, success:function(data){
			deferred.resolve(data);
		}});
		deferred.promise();
							
		deferred.done(function(data){
			data.payload.buttons = {
				buttonNew : function(){
					app.addRegister(sView);
				}
			}
			dataTable.dataTable(data.payload);
			
			var deferredData = $.Deferred();
			app.request({url:data.payload.url, success:function(data){
				deferredData.resolve(data);
			}});
			deferredData.promise();
			deferredData.done(function(data){
				dataTable.dataTable( "option", "source", data.payload[sView] );
				dataTable.dataTable( "refresh" );
			})
		});
		
		$("#ctn_display").fadeIn("fast");
	},
	addRegister:function(action){
		var modal = $("<div/>");
		$("body").append(modal);
		var definition = {};
		
		var sDefinitionJS = "";
		switch(action){
			/*
			case "company": sDefinitionJS = "servlet/empresa?controller=Empresa&action=getDefinitionForm"; break;
			case "department": sDefinitionJS = "servlet/departamento?controller=Departamento&action=getDefinitionForm"; break;
			case "devices": sDefinitionJS = "servlet/dispositivo?controller=Dispositivo&action=getDefinitionForm"; break;
			*/
			case "company": sDefinitionJS = "definitionFormCompany.js"; break;
			case "department": sDefinitionJS = "definitionFormDepartment.js"; break;
			case "devices": sDefinitionJS = "definitionFormDevices.js"; break;
		}
		
		app.request({
			"url":sDefinitionJS,
			"success":function(data){
				if(data.error != 0){
					alert(data.errorSummary);
					return;
				}
				var definition = data.payload;
				//var form = app.buildForm(definition);
				app.buildForm(definition, modal);
				modal.dialog({
					width: 550,
					modal: true,
					resizable: false,
					title: "New " + action,
					buttons: { "Save": function() {
						var aForm = $(this).find("form");
						if(!aForm.valid()){
							return false;
						}
						var dataForm = aForm.serialize();
						app.request({
							"url":definition.url,
							"data":dataForm,
							"sucess":function(){
								$(this).dialog("close"); 
							}
						})
						
					}, "Cancel": function() { $(this).dialog("close"); } }
				});
				//form.find("select").combobox( "refresh" )
			}
		})
	},
	buildForm:function(definition, parent){
		var aForm = $("<form/>", {"class":"form-add"});
		parent.append(aForm);
		var fieldSet = $("<fieldset/>");
		var validateRules = {
			"rules":{},
			"messages":{}
		};
		aForm.append(fieldSet);
		for(var key in definition.fields){
			var el = app.buildFormElement(definition.fields[key], fieldSet);
			validateRules.rules[definition.fields[key].id] = {};
			validateRules.rules[definition.fields[key].id]["required"] = definition.fields[key].required;
			validateRules.messages[definition.fields[key].id] = {};
			validateRules.messages[definition.fields[key].id]["required"] = "Please provide a " + definition.fields[key].label;
		}
		
		aForm.validate(validateRules);
		return aForm;
	},
	buildFormElement:function(def, parent){
		
		var elForm = $("<"+ def.tagname +"/>", {"id":def.id, "name":def.name, "type":def.type});
		var element = $("<p/>").append(
				$("<label/>", {"class":"label"}).html(def.label),
				elForm
			);
		parent.append(element);
		switch(def.tagname){
			case "input":{
				switch(def.picker){
					case "color":{
						elForm.miniColors({
                    		letterCase: 'uppercase'
                		});
						elForm.css("width","70px")
					}
				}
			}
			case "select":
				if(def.source){
					if(typeof def.source == "string"){
						
						
						def.source = $.proxy(function( request, response ) {
							var element = this.element;
							var url = this.url;
							var re = new RegExp(/\[[A-Za-z_0-9]*\]/g)     
							var arrMatch = url.match(re)
							if($.isArray(arrMatch)){
								for(var key = 0; key<arrMatch.length; key++)
								{
									var match = arrMatch[key];
									match = match.replace('[', '');
									match = match.replace(']', '');
									var value = $("#"+match).val();
									if(value)
									{
										do {
											url = url.replace(arrMatch[key], value);
										} while(url.indexOf(arrMatch[key]) >= 0);
									}
								}
							}
							
							
							var deferred = $.Deferred();
							
							if(element.data("url") != url){
								app.request({url:url, success:function(data){
									deferred.resolve(data);
									element.data("url", url);
								}});
							}else{
								deferred.resolve(null);
							}
							
							
							deferred.promise();
							
							deferred.done(function(data){
								if(data){
									
									$.each(data.payload.data, function(index, value){
										element.append($("<option/>", {text:value.label, value:value.value}))
									});
								}
								
								var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
								response( element.children( "option" ).map(function() {
									var text = $( this ).text();
									if ( this.value && ( !request.term || matcher.test(text) ) )
										return {
											label: text.replace(
												new RegExp(
													"(?![^&;]+;)(?!<[^<>]*)(" +
													$.ui.autocomplete.escapeRegex(request.term) +
													")(?![^<>]*>)(?![^&;]+;)", "gi"
												), "<strong>$1</strong>" ),
											value: text,
											option: this
										};
								}) );
							});
							
						}, {"url": def.source, "element": elForm})
					}
					elForm.combobox({source:def.source});
				}
				break;
		}
		
		
		return element;
	},
	request:function(userSettings)
	{
		app.pageLoading('Loading');
		settings = {
			cache: false,
			dataType:"json",
      		crossDomain : false,
      		timeout: 120000,
			type : 'POST',
			error: function(XMLHttpRequest, textStatus, errorThrown) {
                if(textStatus == 'timeout')
                {
                	app.alert('You have lost your connection, try to connect again later');
                }
                else
                {
					app.alert(textStatus);
                }
			}
    	}
    	
    	$.extend(settings, userSettings);		    	
		$.ajax(settings);
	},
	pageLoading:function(){
	},
	alert:function(sMsg){
		alert(sMsg);
	},
	map:function(){
		$("#ctn_display").fadeOut("fast");
		$("#map_canvas").fadeIn("fast");
	}
}
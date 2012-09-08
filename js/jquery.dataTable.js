// JavaScript Document
(function( $ ) {
		$.widget( "ui.dataTable", {
			options: {
				fieldsList:[],
				source:[]
			},
			
			_create: function(){
				this.wrap = $("<div/>", {"class":"ui-datatable-wrap"});
				this.scrollingArea  = $("<div/>", {"class":"ui-datatable-scrolling"});
				this.element.empty();
				this.element.wrap(this.wrap.append(this.scrollingArea));
				this.element.addClass("ui-datatable");
				this._createHeaders();
				this._createBody();
				
			},
			
			_createHeaders: function(){
				
				var thead = $("<thead/>");
				var trHeaderes = $("<tr/>", {"class":"headers"});
				trHeaderes.append(
					$("<th/>", {"class":"header-selection-checkbox"}).append(
						$("<div/>", {"class":"th-inner"}).append($("<input/>", {"type":"checkbox"}))
					)
				)
				$.each(this.options.fieldsList, function(i, item){
					trHeaderes.append($("<th/>").append(
						$("<div/>", {"class":"th-inner"}).html(item.label)
					));
				})
				
				var trNav = $("<tr/>", {"class":"nav"}).append(
					$("<th/>", {"colspan":this.options.fieldsList.length+1}).append(
						/*$("<div/>", {"class":"th-inner"}).append($("<button/>").html("New"))*/
						$("<span/>")
					)
				)
				this.element.append(thead.append(trNav, trHeaderes));
			},
			
			_createBody: function(){
				var self = this;
				if(this.tbody){
					this.tbody.remove();
				}
				var tbody = $("<tbody/>");
				this.tbody = tbody;
				this.element.append(tbody);
				
				if($.isArray(this.options.source) && this.options.source.length>0){
					$.each(this.options.source, function(i, item){
						self._addRow(item);
					})
					return;
				}
				
				var theDiv = $('div.ui-datatable-scrolling');
				var divTop = theDiv.offset().top;
				var winHeight = $(window).height();
				var divHeight = winHeight - divTop;
				theDiv.height(divHeight);
				
				$(window).on("resize", (function(){
					var theDiv = $('div.ui-datatable-scrolling');
					var divTop = theDiv.offset().top;
					var winHeight = $(window).height();
					var divHeight = winHeight - divTop;
					theDiv.height(divHeight);
				}))
				
				tbody.append(
					$("<tr/>").append(
						$("<td/>", {"class":"loadingdata","colspan":this.options.fieldsList.length}).html("<h1>Loading data</h1>")
					)
				);
				
			},
			
			refresh: function() {
				this._createBody();
			},
			
			selectRow: function(unique){
				$("#tr_"+unique).addClass("list-tr-selected");
			},
			unselectRow: function(unique){
				$("#tr_"+unique).removeClass("list-tr-selected");
			},
			
			_addRow: function(rowData){
				var self = this;
				var unique = rowData[this.options.columnID];
				
				var myTR = $("<tr/>", {"class":"list-tr list-tr-underlined", id:"tr_"+unique, "data-unique":unique});
				myTR.bind("click", function(){
					var unique = $(this).data("unique");
					//self.selectRow(unique);
				})
				myTR.append($("<td/>", {"class":"list-td-checkbox"}).append(
					$("<div/>", {"class":"list-content-wrapper"}).append(
						$("<input/>", {"type":"checkbox", id:"chk_"+unique, "data-unique":unique}).click(function(){
							var unique = $(this).data("unique");
							if(this.checked)
								self.selectRow(unique);
							else
								self.unselectRow(unique);
						})
					)
				))
				$.each(this.options.fieldsList, function(i, item){
					var value = rowData[item.id];
					myTR.append($("<td/>", {"class":"list-td"}).append(
						$("<div/>", {"class":"list-content-wrapper"}).html(value)
					));
				})
				this.tbody.append(myTR);
			},

			destroy: function() {
				$.Widget.prototype.destroy.call( this );
			}
		});
	})( jQuery );
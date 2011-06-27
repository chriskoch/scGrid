/**
 * scGrid builds a grid for webdesign issues jquery 1.4 is required
 * 
 * @author Christian Koch
 * 
 */

/**
 * document ready
 * 
 * bind some keys
 */
$(function(){
	// build grid
	scGrid.buildGrid();
	// check the keyboard entries
	$(this).keypress(function(event){
		// G pressed
		if (event.which == 103) {
			scGrid.toggleVisible();
		// H pressed
		} else if (event.which == 104) {
			scGrid.changeGridLayer();
		// E pressed
		} else if (event.which == 101) {
			scGrid.toggleEven();
		// I pressed
		} else if (event.which == 105) {
			scGrid.toggleInverse();
		// K pressed
		} else if (event.which == 107) {
			scGrid.toggleGrid();
		// H pressed
		} else if (event.which == 108) {
			scGrid.toggleHelper();
		}
		//alert(event.which);
	});
	
}); // end of document ready

/**
 * some constants
 */
const SC_GRID_BEHIND = true;
const SC_GRID_INFRONT = false;
const SC_GRID_STAY = 'STAY';

/**
 * scGrid 
 * 
 * generates a table based grid overlay and helper lines
 * 
 * @author Christian Koch
 */
var scGrid = {
	gridWidth: 960,											// width of the grid in total
	gridHeight: 768,                            			// height of the grid
	hook: 'body',                               			// the jquery selector where the grid shoul be anchored
	alignment: 'center',                        			// left is another option
	elemWidth: 24,                              			// width of a grid element
	elemHeight: 24,                             			// height of a grid element
	groupElemHorizontal: 4,                     			// horizontal group size in number of elements
	groupElemVertical: 4,                       			// vertical group size in number of elements
	verticalPosition: 99,                       			// in front switches zu -99 if it's send to back
	borderSize: 1,                              			// border thickness
	borderStyle: 'dotted',                      			// border style
	borderColor: '#333',                        			// border color
	borderInverseColor: '#BBB',								// inverse border color
	groupBorderSize: 1,                         			// border thickness of the group
	groupBorderStyle: 'dashed',                 			// group border style
	groupBorderColor: '#444',                   			// group border color
	groupBorderInverseColor: '#aaa',						// inverse group border color
	opacity: 1,                                 			// opacity of the whole grid
	background: 'rgba(255,255,255,0)',          			// normal background (odd)
	backgroundInverse: 'rgba(128,128,128,0.5)',				// inverse normal background (odd)
	evenBackground: 'rgba(166,166,166,0.2)',    			// background on even rows/cols leave empty if not
	evenBackgroundInverse: 'rgba(88,88,88,0.2)',			// inverse background on even rows/cols leave empty if not
	horizontalLines: [ 144, 744],							// array of horizontal lines
	horizontalBorderSize: 1,								// border size of the horizontal helper line
	horizontalBorderStyle: 'solid',             			// horizontal border style
	horizontalBorderColor: 'rgba(128,255,0,0.75)',			// horizontal border color
	horizontalBorderInverseColor: 'rgba(128,0,255,0.75)',	// inverse horizontal border color
	verticalLines: [ 192, 456, 720 ],						// array of vertical lines
	verticalBorderSize: 1,					    			// border size of the vertical helper line
	verticalBorderStyle: 'solid',               			// vertical border style
	verticalBorderColor: 'rgba(255,255,0,0.75)',			// vertical border color
	verticalBorderInverseColor: 'rgba(0,0,255,0.75)',		// inverse vertical border color
	isVisible: false,										// helper true or false
	showEven: false,										// helper true or false
	showHelper: 3,											// helper 0 = not, 1 = vert only, 2 = horiz only, 3 = both
	showGridLevel: 3,										// helper 0 = not, 1 = grid, 2 = group, 3 = both
	showInverse: false,										// helper true|false for inverting colors
	
	/**
	 * build lines
	 * 
	 * build the helper lines defined in horizontalLines and verticalLines
	 * as a div block. 
	 */
	buildLines: function () {
		for (i = 0; i < scGrid.horizontalLines.length; i++) {
			$('#sc_grid').append('<div style="position:absolute; top: ' + scGrid.horizontalLines[i] + 'px; left: 0px; min-width: ' + scGrid.gridWidth + 'px; width: ' + scGrid.gridWidth + 'px;" class="hl"></div>');
		}
		for (i = 0; i < scGrid.verticalLines.length; i++) {
			$('#sc_grid').append('<div style="position:absolute; left: ' + scGrid.verticalLines[i] + 'px; top: 0px; min-height: ' + scGrid.gridHeight + 'px; height: ' + scGrid.gridHeight + 'px;" class="vl"></div>');
		}
	},
	
	/**
	 * build grid
	 *  
	 * builds the table at the end of scGrid.hook
	 *
	 * numbers rows and cols as id
	 * sets even (e) and odd (o) classes
	 * sets first (f) and last (l) classes
	 * defines the class for group (g)
	 * example .. class="c e l g" ..
	 */
	buildGrid: function () {
		// the hook for the grid table
		$('#sc_grid').remove();
		$(scGrid.hook).append('<div id="sc_grid"></div>');
		// calculate number of columns and rows
		var cols = Math.floor(scGrid.gridWidth/scGrid.elemWidth);
		var rows = Math.floor(scGrid.gridHeight/scGrid.elemHeight);
		// append the table in a nested loop
		var rowString ='';
		for (i = 0; i < rows; i++) {
			// generates tr width
			rowString += '<tr id="r_' + (i+1) + '" class="r' + ((i == 0) ? ' f' : '') + ((i+1 == rows) ? ' l' : '') + ((i%2 == 0) ? ' o' : ' e') + (((i+1)%scGrid.groupElemVertical == 0) ? ' g' : '') +'">';
			for (j = 0; j < cols; j++) {
				rowString += '<td id="c_' + (i+1) + '_' + (j+1) + '" class="c' + ((j == 0) ? ' f' : '') + ((j+1 == cols) ? ' l' : '') + ((j%2 == 0) ? ' o' : ' e') + (((j+1)%scGrid.groupElemHorizontal == 0) ? ' g' : '') + '"></td>';				
			}
			rowString += '</tr>';
		}
		// put the rows into the table
		$('#sc_grid').append('<table>' + rowString + '</table>').append('<div id="sc_grid_mbox"></div>');
		// build the lines
		scGrid.buildLines();
		// do not show it
		$('#sc_grid_mbox').hide();
		$('#sc_grid').hide();
	}, // end of buildGrid()
	
	/**
	 * set grid style
	 *
	 * puts a new style tag in the page head
	 * defines all needed styles for the grid
	 */
	setGridStyle: function () {
		// remove if exists
		$('#sc_grid_style').remove();
		// append style tag
		$('head').append('<style id="sc_grid_style"></style>');
		var style = $('#sc_grid_style');
		// define all css that is needed
		style.append('#sc_grid_mbox { position:absolute; background-color:rgba(255,255,255,1); color: #000; opacity:0.9; padding:4px; font-size:10px; font-family:sans-serif; width:96px; height:96px;}');
		style.append('#sc_grid, #sc_grid table, #sc_grid tr, #sc_grid td, #sc_grid div.hl, #sc_grid div.vl { margin:0px; padding:0px; border-collapse:collapse; }');
		style.append('#sc_grid .hl { border-top:' + scGrid.horizontalBorderSize + 'px ' + scGrid.horizontalBorderStyle + ' ' + ((scGrid.showInverse) ? scGrid.horizontalBorderInverseColor : scGrid.horizontalBorderColor) + '; }');
		style.append('#sc_grid .vl { border-left:' + scGrid.verticalBorderSize + 'px ' + scGrid.verticalBorderStyle + ' ' + ((scGrid.showInverse) ? scGrid.verticalBorderInverseColor : scGrid.verticalBorderColor) + '; }');
		style.append('#sc_grid { ' + ((scGrid.alignment == 'center') ? 'width:' + scGrid.gridWidth + 'px; margin-left:auto; margin-right:auto;' : 'left:0px;') + ' z-index:' + scGrid.verticalPosition + '; position:absolute; top:0px; opacity: ' + scGrid.opacity + '; background-color: ' + scGrid.background + '; }');
		style.append('#sc_grid tr { min-height: ' + scGrid.elemHeight + 'px; max-height: ' + scGrid.elemHeight + 'px; height: ' + scGrid.elemHeight + 'px; }');
		style.append('#sc_grid td { border-right: ' + scGrid.borderSize + 'px ' + scGrid.borderStyle + ' ' + ((scGrid.showInverse) ? scGrid.borderInverseColor : scGrid.borderColor) + '; border-bottom: ' + scGrid.borderSize + 'px ' + scGrid.borderStyle + ' ' + ((scGrid.showInverse) ? scGrid.borderInverseColor : scGrid.borderColor) + '; width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; min-width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; max-width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; height:' + (scGrid.elemHeight - scGrid.borderSize) + 'px; min-height:' + (scGrid.elemHeight - scGrid.borderSize) + 'px; max-height:' + (scGrid.elemHeight - scGrid.borderSize) + 'px; }');
		style.append('#sc_grid td.g { border-right: ' + scGrid.groupBorderSize + 'px ' + scGrid.groupBorderStyle + ' ' + ((scGrid.showInverse) ? scGrid.groupBorderInverseColor : scGrid.groupBorderColor) + '; width: ' + (scGrid.elemWidth - scGrid.groupBorderSize) + 'px; min-width:' + (scGrid.elemWidth - scGrid.groupBorderSize) + 'px; max-width:' + (scGrid.elemWidth - scGrid.groupBorderSize) + 'px; }');
		style.append('#sc_grid tr.g td { border-bottom: ' + scGrid.groupBorderSize + 'px ' + scGrid.groupBorderStyle + ' ' + ((scGrid.showInverse) ? scGrid.groupBorderInverseColor : scGrid.groupBorderColor) + '; height: ' + (scGrid.elemHeight - scGrid.groupBorderSize) + 'px;  min-height: ' + (scGrid.elemHeight - scGrid.groupBorderSize) + 'px;  max-height: ' + (scGrid.elemHeight - scGrid.groupBorderSize) + 'px; }');
		if(scGrid.showEven) {
			style.append('#sc_grid tr.o td.e, #sc_grid tr.e td { background-color:' + ((scGrid.showInverse) ? scGrid.evenBackgroundInverse : scGrid.evenBackground) + '; }');
		}
		if(scGrid.showHelper == 0) {
			style.append('#sc_grid .hl, #sc_grid .vl { display:none }');
		} else if (scGrid.showHelper == 1) {
			style.append('#sc_grid .hl { display:none }');
		} else if (scGrid.showHelper == 2) {
			style.append('#sc_grid .vl { display:none }');
		}
		if (scGrid.showGridLevel == 1) {
			// raster on, group off
			style.append('#sc_grid td.g { border-right: ' + scGrid.borderSize + 'px ' + scGrid.borderStyle + ' ' + ((scGrid.showInverse) ? scGrid.borderInverseColor : scGrid.borderColor) + '; width: ' + (scGrid.elemWidth - scGrid.borderSize) + 'px; min-width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; max-width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; }');
			style.append('#sc_grid tr.g td { border-bottom: ' + scGrid.borderSize + 'px ' + scGrid.borderStyle + ' ' + ((scGrid.showInverse) ? scGrid.borderInverseColor : scGrid.borderColor) + '; height: ' + (scGrid.elemHeight - scGrid.borderSize) + 'px;  min-height: ' + (scGrid.elemHeight - scGrid.borderSize) + 'px;  max-height: ' + (scGrid.elemHeight - scGrid.borderSize) + 'px; }');
		} else if (scGrid.showGridLevel == 2) {
			// group on raster off
			style.append('#sc_grid td { border-right: ' + scGrid.borderSize + 'px ' + scGrid.borderStyle + ' ' + scGrid.background + '; border-bottom: ' + scGrid.borderSize + 'px ' + scGrid.borderStyle + ' ' + scGrid.background + '; width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; min-width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; max-width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; height:' + (scGrid.elemHeight - scGrid.borderSize) + 'px; min-height:' + (scGrid.elemHeight - scGrid.borderSize) + 'px; max-height:' + (scGrid.elemHeight - scGrid.borderSize) + 'px; }');
			style.append('#sc_grid td.g { border-right: ' + scGrid.groupBorderSize + 'px ' + scGrid.groupBorderStyle + ' ' + ((scGrid.showInverse) ? scGrid.groupBorderInverseColor : scGrid.groupBorderColor) + '; width: ' + (scGrid.elemWidth - scGrid.groupBorderSize) + 'px; min-width:' + (scGrid.elemWidth - scGrid.groupBorderSize) + 'px; max-width:' + (scGrid.elemWidth - scGrid.groupBorderSize) + 'px; }');
			style.append('#sc_grid tr.g td { border-bottom: ' + scGrid.groupBorderSize + 'px ' + scGrid.groupBorderStyle + ' ' + ((scGrid.showInverse) ? scGrid.groupBorderInverseColor : scGrid.groupBorderColor) + '; height: ' + (scGrid.elemHeight - scGrid.groupBorderSize) + 'px;  min-height: ' + (scGrid.elemHeight - scGrid.groupBorderSize) + 'px;  max-height: ' + (scGrid.elemHeight - scGrid.groupBorderSize) + 'px; }');
		} else if (scGrid.showGridLevel == 0) {
			// all off
			style.append('#sc_grid td { border-right: ' + scGrid.borderSize + 'px ' + scGrid.borderStyle + ' ' + scGrid.background + '; border-bottom: ' + scGrid.borderSize + 'px ' + scGrid.borderStyle + ' ' + scGrid.background + '; width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; min-width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; max-width:' + (scGrid.elemWidth - scGrid.borderSize) + 'px; height:' + (scGrid.elemHeight - scGrid.borderSize) + 'px; min-height:' + (scGrid.elemHeight - scGrid.borderSize) + 'px; max-height:' + (scGrid.elemHeight - scGrid.borderSize) + 'px; }');
			style.append('#sc_grid td.g { border-right: ' + scGrid.groupBorderSize + 'px ' + scGrid.groupBorderStyle + ' ' + scGrid.background + '; width: ' + (scGrid.elemWidth - scGrid.groupBorderSize) + 'px; min-width:' + (scGrid.elemWidth - scGrid.groupBorderSize) + 'px; max-width:' + (scGrid.elemWidth - scGrid.groupBorderSize) + 'px; }');
			style.append('#sc_grid tr.g td { border-bottom: ' + scGrid.groupBorderSize + 'px ' + scGrid.groupBorderStyle + ' ' + scGrid.background + '; height: ' + (scGrid.elemHeight - scGrid.groupBorderSize) + 'px;  min-height: ' + (scGrid.elemHeight - scGrid.groupBorderSize) + 'px;  max-height: ' + (scGrid.elemHeight - scGrid.groupBorderSize) + 'px; }');
		} // 3 means all on
	}, // end of setGridStyle()

	// displays the grid
	// @param showBehind true, false and 'stay'
	// false is default
	showGrid: function (showBehind) {
		if (showBehind == SC_GRID_STAY) {
			scGrid.verticalPosition = scGrid.verticalPosition;
		} else if (showBehind) {
			scGrid.verticalPosition = -1 * Math.abs(scGrid.verticalPosition);
		} else {
			scGrid.verticalPosition = Math.abs(scGrid.verticalPosition);
		}
		scGrid.setGridStyle(scGrid.showEven);
		$('#sc_grid').show();
		$('td').click(function(){
			scGrid.showMeasurement($(this));
		});
	}, // end of showGrid()

	// hides the grid
	hideGrid: function () {
		$('td').unbind('click');
		$('#sc_grid').hide();
	}, // end of hideGrid()
	
	// toggles the grid
	toggleVisible: function () {
		if (scGrid.isVisible) {
			scGrid.hideGrid();
			scGrid.isVisible = false;
		} else {
			scGrid.showGrid(SC_GRID_STAY);
			scGrid.isVisible = true;
		}
	}, // end of toggleVisible()

	// switches between front and back
	changeGridLayer: function () {
		if (scGrid.isVisible) {
			if (scGrid.verticalPosition < 0) {
				scGrid.showGrid(SC_GRID_INFRONT);
			} else {
				scGrid.showGrid(SC_GRID_BEHIND);
			}
		}
	}, // end of changeGridLayer();
	
	// toggles the even col/row background
	toggleEven: function () {
		(scGrid.showEven) ? scGrid.showEven = false : scGrid.showEven = true;
		scGrid.setGridStyle();
	}, // end of toggleEven()
	
	toggleInverse: function () {
		(scGrid.showInverse) ? scGrid.showInverse = false : scGrid.showInverse = true;
		scGrid.setGridStyle();
	}, // end of toggleInverse()
	
	// toggle helper lines
	toggleHelper: function () {
		(scGrid.showHelper < 3) ? scGrid.showHelper++  : scGrid.showHelper = 0;
		scGrid.setGridStyle();
	}, // end of toggleHelper()
	
	// toggle different kind of grids
	toggleGrid: function () {
		(scGrid.showGridLevel < 3) ? scGrid.showGridLevel++  : scGrid.showGridLevel = 0;
		scGrid.setGridStyle();
	},

	// helper for defined position offset() does not work prop.
	getRasterPos: function (tdId) {
		var tdIdElems = tdId.split('_');
		return {top: (tdIdElems[1]-1) * scGrid.elemHeight, left: (tdIdElems[2]-1) * scGrid.elemWidth};
	}, // end of getRasterPos()
	
	// shows the data of one raster element
	showMeasurement: function (td) {
		if ($('#sc_grid_mbox').is(':visible')) {
			$('#sc_grid_mbox').hide();
		} else {
			var pos = scGrid.getRasterPos(td.get(0).id);
			$('#sc_grid_mbox').show().offset(td.offset()).html(
			'<p>Id : ' + td.get(0).id + '<br/>' +
			'Top: ' + pos.top + '/' + (scGrid.gridHeight - pos.top) + '<br/>' +
			'Left: ' + pos.left + '/' + (scGrid.gridWidth - pos.left) + '<br/>'	+
			'Bottom: ' + (pos.top + scGrid.elemHeight) + '/' + (scGrid.gridHeight - (pos.top + scGrid.elemHeight)) + '<br/>' +
			'Right: ' + (pos.left + scGrid.elemWidth) + '/' + (scGrid.gridWidth - (pos.left + scGrid.elemWidth)) + '</p>'	
			);
		}
	} // end of showMeasurement()

}; // end of class
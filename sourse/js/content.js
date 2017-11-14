
window.onload = function(){

	function removeClases(block, sublingElement, className, callback){
		for (var i = 0; i < block.getElementsByTagName(sublingElement).length; i++){
		    block.getElementsByTagName(sublingElement)[i].classList.remove(className)
		    if(typeof callback === 'function'){
		    	callback(block.getElementsByTagName(sublingElement)[i])
		    }
		}
	}
	
	function DataTable(param){
		this.block = param.block;
		this.blockTable = document.getElementById(param.block);
		this.table = document.createElement('table');
	}

	DataTable.prototype = {

		constructor: DataTable,

		init: function(){
			this.load()
			
		},

		load : function(){
			var self = this,
				data = null,
				xhr = new XMLHttpRequest();
			xhr.open('GET', '/js/MOCK_DATA.json');
			xhr.onload = function() {
			    if (xhr.status === 200) {
			    	data = JSON.parse(xhr.responseText)
			    	data.forEach(function(obj, i){
			    		if(i < 1){
			    			self.createTableElements.apply(self, [obj, 'th', true])
			    		}
			    	});
			    	data.forEach(function(obj, i){
			    		self.createTableElements.apply(self, [obj, 'td'])
			    	});
			    	self.blockTable.appendChild(self.table);
			    	self.sortTable()	  
			    }else{
			       console.log('Request failed.  Returned status of ' + xhr.status);
			    }
			};
			xhr.send();
		},

		createTableElements : function(obj, cell, isTitle){
			var	tr,
				td,
				th,
				text,
				dataText;
			if(isTitle){
				this.table.appendChild(document.createElement('thead'));
			}else{
				if(this.table.getElementsByTagName('tbody').length < 1){
					this.table.appendChild(document.createElement('tbody'));
				}
			}
			tr = document.createElement('tr');
			for(key in obj){
				td = document.createElement(cell)
				if(isTitle){
				  dataText = key;
				}else{
				  dataText = obj[key];
				  switch(key.toLowerCase()) {
  					case 'avatar'.toLowerCase():

  						if(obj[key] !== null) {
  							dataText = '<img src="'+obj[key]+'"/>'
  						}else{
  							dataText = '-'
  						}
  						break;
  					case 'administrator'.toLowerCase():
  						if(obj[key] == true){
  							dataText = 'yes'
  						}else{
  							dataText = 'no'
  						}
  						break;
  					};
				}
				td.innerHTML = dataText
				this.table.lastChild.appendChild(tr).appendChild(td);
			}
		},

		sortTable : function(){
			var self = this;
			var table = document.querySelector('#'+this.block+' table');
		    table.onclick = function(e) {
		      if (e.target.tagName != 'TH') return;
		      sortTrTable(e.target.cellIndex, e);
		    };
		    function sortTrTable(colNum, e) {
		      var tbody = table.getElementsByTagName('tbody')[0],
		      	  rowsArray = [].slice.call(tbody.rows),
		          compare = function (rowA, rowB) {
		          	if(!isNaN(rowA.cells[colNum].innerHTML)){
		          		return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
		          	}
		          	if (rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML) {
					    return 1;
					}
					if (rowA.cells[colNum].innerHTML < rowB.cells[colNum].innerHTML) {
					    return -1;
					}
					return 0;
		      };
		      if(e.target.classList.contains('reverse')){
		      	rowsArray.sort(compare).reverse();
		      	e.target.classList.remove('reverse');
		      }else{
		      	rowsArray.sort(compare);
		      	removeClases(table, e.target.tagName, 'reverse')
		      	e.target.classList.add('reverse');
		      }
		      table.removeChild(tbody);
		      for (var i = 0; i < rowsArray.length; i++) {
		        tbody.appendChild(rowsArray[i]);
		      }
		      table.appendChild(tbody);
		    }
		},
	}

	function Accordion(param){
		this.block = document.querySelector(param.block);
		this.link = param.link;
		this.classActive = param.classActive;
	}

	Accordion.prototype = {

		constructor: Accordion,

		init : function(){
			this.open()
		},

		open : function(){
			var self  = this,
				targetParent,
				setText = function(el){
					el.children[0].innerHTML = 'Click to open';
				}
			this.block.addEventListener('click', function(e){
				e.stopPropagation();
				e.preventDefault();
				targetParent = e.target.parentElement;
				if(!e.target.classList.contains(self.link)) return;
				if(targetParent.classList.contains(self.classActive)){
			      	targetParent.classList.remove(self.classActive);
			      	e.target.innerHTML = 'Click to open'
			    }else{
			      	removeClases(self.block, targetParent.tagName, self.classActive, setText)
			      	targetParent.classList.add(self.classActive);
			      	e.target.innerHTML = 'Click to close'
			    }
			});
		}
	}
	
	function Menu(param){
		Accordion.apply(this, arguments);
	}

	Menu.prototype = {

		constructor: Menu,

		init : function(){
			this.open()
		},

		open : function(){
			var self = this;
			this.block.addEventListener('mouseenter', function(e){
			    this.classList.add(self.classActive);    
			});
			this.block.addEventListener("mouseleave", function () {
			    this.classList.remove(self.classActive);
			});
		}
	}
	
	function Flags(param){
		Accordion.apply(this, arguments);
	}

	Flags.prototype = {

		constructor: Menu,

		init : function(){
			this.open()
		},

		open : function(){
			var self = this,
				target,
				targetParent;
			this.block.addEventListener('click', function(e){
				e.preventDefault();
				target = e.target;
				while (target != this) {
				    if (target.tagName == 'LI') {
				      targetParent = target
				      break;
				    }
				    target = target.parentNode;
				}
				if(targetParent.classList.contains(self.classActive)){
			      	targetParent.classList.remove(self.classActive);
			    }else{
			      	removeClases(self.block, targetParent.tagName, self.classActive)
			      	targetParent.classList.add(self.classActive);
			    }
			})
		}
	}

	var dataTable = new DataTable({
		block: 'data-table'
	});
	dataTable.init();

	var accordion = new Accordion({
		block: '.accordion',
		link: 'accordion__link',
		classActive: 'open'
	});
	accordion.init();

	var menu = new Menu({
		block: '.main-menu__item.sub',
		classActive : 'open'
	});
	menu.init();

	var flags = new Flags({
		block: '.flags',
		link: 'flags__link',
		classActive: 'flags__item_selected'
	});
	flags.init();

}




window.onload = function(){
	
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
			    	})
			    	self.blockTable.appendChild(self.table);
			    	self.sortTable()	  
			    }
			    else {
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
				  dataText = key
				}else{
				  dataText = obj[key]

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

		removeClases : function(block, sublingElement, className){
			console.log(sublingElement)
		    for (var i = 0; i < block.getElementsByTagName(sublingElement).length; i++){
		      	block.getElementsByTagName(sublingElement)[i].classList.remove(className)
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
		      	DataTable.prototype.removeClases.apply(this, [table, e.target.tagName, 'reverse'])
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

	var dataTable = new DataTable({
		block: 'data-table'
	});
	dataTable.init()

	function Accordion(param){
		this.block = document.querySelector(param.block);
		this.link = param.link;

	}

	Accordion.prototype = {

		constructor: Accordion,

		init : function(){
			this.open()
		},

		open : function(){
			var self  = this

			this.block.addEventListener('click', function(e){
				e.stopPropagation();
				e.preventDefault();
				if(!e.target.classList.contains(self.link)) return;

				if(e.target.classList.contains('open')){
			      	e.target.classList.remove('open');
			    }else{
			    	DataTable.prototype.removeClases.apply(this, [self.block, e.target.tagName, 'open'])
			      	e.target.classList.add('open');
			    }
			})
		}
	}
	accordion = new Accordion({
		block: '.accordion',
		link: 'accodion__link'
	})
	accordion.init()

}



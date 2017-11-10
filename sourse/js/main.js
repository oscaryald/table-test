$(document).ready(function(){

	function Post(param){
		this.countComments = param.countComments || 1;
		this.loadMoreComments = param.loadMoreComments || 1;
		this.items = [];
	}

	Post.prototype = {

		constructor: Post,

		init : function(){
			this.getPost();
			this.addEventHandler();
		},

		loadMore: function(arr){
			if(this.countComments + this.loadMoreComments > this.countComments){
				this.countComments += this.loadMoreComments
			}
			this.getPost()
			return 
		},

		addCommentsTemplate : function(comment){
			var that = this;
			var commentsTemplate = $('#comments-template').html()
			comment.created_at = that.dateReviver(comment.created_at)
			for(var i = 0; i < comment.children.length; i++){
				comment.children[i].created_at = that.dateReviver(comment.children[i].created_at)
			}
			$( ".comments-list" ).append(Mustache.render(commentsTemplate, comment));
		},

		addEventHandler: function(){
			var that = this,
				textarea,
				commentId;

			this.addClassToSend();	

			$('.load-more').on('click', function(){
				that.loadMore(that.items);
				return false
			});

			$('.comments-content').on('click','.btn[data-class="edit"]', function(){

				textarea = $(this).parents('li').find('.comment-content');
				commentId = $(this).parents('li').attr('id');

				if(textarea.val() == ''){
					textarea.addClass('error');
					return false
				}else{
					textarea.removeClass('error');
				} 

				that.editComment.apply($(this), [textarea.val(), commentId]);
				$(this).parents('li').find('.comment-content').val('');
				return false
			});

			$('.comments-content').on('click','.delete', function(){
				commentId = $(this).parents('li').attr('id');
				that.deleteComment.apply($(this), [commentId]);
				return false
			})


			$('.comments-content').on('click','.btn[data-class="reply"]', function(){
				textarea = $(this).parents('li').find('.comment-content');

				if(textarea.val() == ''){
					textarea.addClass('error');
					return false
				}else{
					textarea.removeClass('error');
				} 

				that.replayComment.apply($(this), [textarea.val()]);
				textarea.val('');
				return false
			})

			$('.comments-block').on('click','.add', function(){
				textarea = $(this).parents('.message-field').find('.comment-content');

				if(textarea.val() == ''){
					textarea.addClass('error');
					return false
				}else{
					textarea.removeClass('error');
				} 

				that.addNewComment.apply($(this), [textarea.val()]);
				textarea.val('');
				return false
			});

			$('.comments-block').on('click','.cancel', function(){
				$(this).parents('.message-field__textarea').slideUp(300);
				return false
			})


		},

		addClassToSend : function(){
			$('.comments-content').on('click','.edit, .reply', function(){
				var btn = $(this).parents('.message-field').find('.message-field__textarea .btn')
				$(this).parents('.message-field').find('.message-field__textarea').slideDown(300);
				btn.attr('data-class', '');
				btn.attr('data-class', $(this).attr('class'));
				return false
			})
		},

		dateReviver : function(value){
			var ms = Date.parse(value),
				    date = new Date(ms),
				    year = date.getFullYear(),
				    month = date.getMonth()+1,
				    day = date.getDate(),
				    minutes = ( date.getMinutes()<=9 ) ? '0' + date.getMinutes() : date.getMinutes(),
				    hours = date.getHours();
				value = year + '-' + month + '-' + day + ' at ' + hours + ':' + minutes;
			    return value;
		},

		getPost : function(param){
			var that = this;

			function load(){
				$('.comments-list').html('');
				that.items = [];

				$.ajax({
				    url: 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/',
				    type: 'GET',
				    dateType: 'json',
				    success: function(data){
					    $.each( data, function( key, val ) {
						    if (key < that.countComments) {
						    	that.addCommentsTemplate(val);
							}
					    });
				    }
				})	

			};

			load();
		},

		addNewComment : function(newComment){
			var id = $(this).parents('li').attr('id');
			var targetComment = $(this);
			var comment = {
				content : newComment,
				id: id || null
			}

			$.ajax({
				type: "POST",
				url : 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/',
				data:comment,
				success: function(data){
					var commentsTemplate = $('#comments-template').html();
					data.created_at = Post.prototype.dateReviver.apply(Post, [data.created_at])
					$( ".comments-list" ).prepend(Mustache.render(commentsTemplate, data));
					console.log(data.content)
				}

			})
			return false
		},

		replayComment : function(newComment){
			var id = $(this).parents('li').attr('id');
			var targetUL  = $(this).parents('.comment').find('.children-list');
			var url = 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/';
			var comment = {
				children : [
					{
						content : newComment,
						id: id
					}
				]
			}

			$.ajax({
				type: "PUT",
				url : url + id,
				data:comment,
				success: function(data){
					console.log(comment.children[0].content)
					data.created_at = Post.prototype.dateReviver.apply(Post, [data.created_at])
					var result = '<li class="flex-wrap clearfix">'+
		              '<div class="avatar"><img src="'+data.author.avatar+'" alt=""></div>'+
		              '<div class="message-field"><div class="author-name">'+data.author.name+'</div>'+
		              '<div class="date"><i class="fa fa-clock-o"></i>'+data.created_at+'</div>'+
		              '<p>'+comment.children[0].content+'</p></li>';

					targetUL.append(result)
				}
			})
			return false
		},

		deleteComment : function(id){
				var elementId = $('#'+id) 
				var url = 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/';
			    $.ajax({
			         type: "DELETE",
			         url: url + id,
			         dataType: "json",
			         success: function (data, status, jqXHR) {
			            elementId.remove()
			         }
			     });
			    return false
		},

		editComment : function(newComment, id){
				var elementId = $('#'+id);
				var comment = {
					content : newComment
				} 
				var url = 'http://frontend-test.pingbull.com/pages/oscaryld@gmail.com/comments/';

			    $.ajax({
			         type: "PUT",
			         url: url + id,
			         dataType: "json",
			         data:comment,
			         success: function (data, status, jqXHR) {
			         	elementId.find('p').html(newComment)
			         }
			     });
			    return false
		},
	}

	var post = new Post({
		countComments:3,
		loadMoreComments: 1
	});

	post.init();

});


window.onload = function(){
	
	function DataTable(param){

		this.table = document.getElementById(param.block)

	}

	DataTable.prototype = {

		constructor: DataTable,

		init: function(){
			this.load()
		},

		load : function(){

			var xhr = new XMLHttpRequest();
			xhr.open('GET', '/js/MOCK_DATA.json');
			xhr.onload = function() {
			    if (xhr.status === 200) {

			    	var data = JSON.parse(xhr.responseText)
			    	// console.log(data)

			    	data.forEach(function(el, i){
			    		console.log(el['First Name'])
			    		// console.log(el['ID'])
			    	})
			        
			        // console.log(xhr.responseText)
			    }
			    else {
			       console.log('Request failed.  Returned status of ' + xhr.status);
			    }
			};
			xhr.send();

				
			var table = document.createElement('table'),
			    tr = table.appendChild(document.createElement('tbody'))
			              .appendChild(document.createElement('tr'));
			for (var i = 1; i < 1000; i++) {
			    tr.appendChild(document.createElement('td'));
			}

		}

	}

	var dataTable = new DataTable({
		block: 'data-table'
	});
	dataTable.init()

}



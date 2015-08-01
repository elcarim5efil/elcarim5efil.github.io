$(document).ready(function(){
	// console.log('start');

	var list = [];
	var menuItemTop = [];
	var headTop = [];
	var uniqueId = Math.floor( Math.random() * 100000 );
	(function(){
		var cur_level = 0;
		var i = 0;
		var heads = $('h1, h2, h3');						// fetch all the h1, h2, h3
		$.each(heads, function(index, item){				// push the headers to list 
			if(item.tagName.toLowerCase() == 'h1') {		// 'H1'
				if(item.id == '' || item.id == null || item.id == undefined) {
					item.id = 'menuindex_x_' + list.length;	// making an id for the header if it doesn't have one
				}											// the id is made from the current index and parent index
				list.push({
					text: item.innerHTML,
					id: item.id,
					children: []
				});
			} else if(item.tagName.toLowerCase() == 'h2') {	// 'H2', it should be chilren of the last 'H1'
				var h1_index = list.length - 1;
				var h1_id = h1_index + 1;
				if(item.id == '' || item.id == null || item.id == undefined) {
					item.id = 'menuindex_x_' + h1_id + '_' + list[h1_index].children.length;	
				}
				list[h1_index].children.push({
					text: item.innerHTML,
					id: item.id,
					children: []
				});			
			}  else {										// 'H3', it should be chilren of the last 'H2'
				var h1_index = list.length - 1;
				var h2_index = list[h1_index].children.length - 1;
				var h1_id = h1_index + 1;
				var h2_id = h2_index + 1;
				if(item.id == '' || item.id == null || item.id == undefined) {
					item.id = 'menuindex_x_' + h1_id + '_' + h2_id + '_' + list[h1_index].children[h2_index].children.length;
				}
				list[h1_index].children[h2_index].children.push({
					text: item.innerHTML,
					id : item.id
				});
			}
			headTop.push(item.offsetTop);					// save the headers offset top value
		})

		var ulist = getHtmlText(list);						// convert the list into Htmltext constructed with <ul>s, <li>s and <a>s
		var indexMenu = '<div id="menuIndex" style="overflow:scroll; width:200px; height:500px; float:right;" >' 	// create the menu
						+		' <ul class="nav nav-pills nav-stacked">' 
						+ 			ulist 
						+ 		'</ul>'
						+ '</div>';
		var floatMenu = $(indexMenu)
		$('body').append(floatMenu);
		floatMenu.css('max-height',$(window).height()-80)
				.delegate('a','click',function(e){
                    e.preventDefault();
                    console.log(this);
                    var selec = this.hash || '#' + this.id;
                    $('body, html').animate({ scrollTop: $(this.hash).offset().top - 10 }, 400, 'swing');
                });

		$(window).load(function(){
				// var menuIndexTop = $('#menuIndex').offset().top = window.screen.availHeight * 0.05;
				// var menuIndexLeft = $('#menuIndex').offset().left = window.screen.availWidth - $('#menuIndex').width() * 1.3;
                
                // deal with the window scroll event
				$(window).scroll(function(){
                    waitForFinalEvent(function(){
                    	updateMenuItemTop();				// update the new menu item offset value
                        var nowTop = $(window).scrollTop();	// get the current scroll offset of the window
                        var length = headTop.length;		// get the headers quantity
                        var index;							// save the current header index

                        if(nowTop > headTop[length - 1]) {
                            index = length;
                        }else{
                            for(var i = 0; i < length; ++i) {
                                if(nowTop <= headTop[i]) {
                                    index = i;
                                    break;
                                }
                            }
                        }
                        $('#menuIndex li').removeClass('on');			// remove the old mark
                        $('#menuIndex li').eq(index).addClass('on');	// add a new mark
                        var ele = $('#menuIndex')
                        var scroll_num = menuItemTop[index] - ele.offset().top;
                        if(scroll_num  + ele.height() * 0.2 > ele.height() || scroll_num - ele.height() * 0.2 < 0) {	
							ele.animate({ scrollTop: scroll_num - ele.height() * 0.2}, 500, 'linear');
                        }
                    });
                });

                $(window).resize(function(){				// resize the menu box when the window's resized
                	// updateMenuItemTop();
                    $(window).trigger('scroll');			// scroll the window
                    $('#menuIndex').css('max-height',$(window).height()-80);
                });
            })
			
	})();

	function getHtmlText(item){			// get the index menu HTML with the list
		var text = '';
		if(item == null) {
			return;
		}
		for(var i = 0;i < item.length; ++i) {
			var temp  = getHtmlText(item[i].children);		// the it's children's HTML text
			if(temp != '' && temp != undefined) {			// if there're children, create a <ul> list
				temp = '<ul class="nav">' + temp + '</ul>';
				text += '<li><a href="#' + item[i].id + '">' + item[i].text + '</a>' + temp + '</li>';
			} else {										// if not, juest create the current list item
				if(item[i].text != '' || item[i].text != null) {
					text += '<li><a href="#' + item[i].id + '">' + item[i].text + '</a></li>';
				}
			}
		}
		return text;
	}

	// event filter which the remove all the previous events but leave out the newest one
	var waitForFinalEvent = (function () {			// wait for the very last event signal
	    var timers = {};							// saving the timers with a closure var
	    return function (callback, ms, uniqueId) {
			if (!uniqueId) {						// init a uniqueID
				uniqueId = "Don't call this twice without a uniqueId";
			}
			if (timers[uniqueId]) {					// remove the previous number
				clearTimeout (timers[uniqueId]);
			}
			ms = ms || 0;
			timers[uniqueId] = setTimeout(callback, ms);	// save a new timer
	    };
	})();

	// upte the menu items offset top in the menu box
	function updateMenuItemTop(){
		menuItemTop = [];
		$.each($('#menuIndex li a'),function(index,item){
			var top = $(item).offset().top;
			menuItemTop.push(top);
		});
	}
});
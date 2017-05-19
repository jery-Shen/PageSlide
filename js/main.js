

(function (doc, win) {
	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
	var recalc = function () {
	  var height = 515;
	  var docEl = doc.documentElement;
	  var clientWidth = docEl.clientWidth;
	  var clientHeight = docEl.clientHeight;
	  var pages = doc.getElementsByClassName('pageContainer');
	  if (clientWidth){
	  	var scaleWidth;
	  	if(clientHeight/clientWidth>=height/320){
	  		scaleWidth = clientWidth;
	  		setPages(pages,clientWidth+'px',clientWidth/320*height+'px',(clientHeight-clientWidth/320*height)/2+'px','0px');
	  	}else{
	  		scaleWidth = clientHeight/height*320;
	  		setPages(pages,clientHeight/height*320+'px',clientHeight+'px','0px',(clientWidth-clientHeight/height*320)/2+'px');
	  	}
	  	docEl.style.fontSize = (scaleWidth / 32) + 'px';
	  }
	};
	var setPages = function(pages,width,height,left,top){
		for(var i=0;i<pages.length;i++){
			pages[i].style.width=width;
	  		pages[i].style.height=height;
	  		pages[i].style.top=left;
	  		pages[i].style.left=top;
		}
	}
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

window.addEventListener('load',loadTouch, false); 
function loadTouch (){  
	var startY;
	var startTime;
	var bodyHeight;
	var moveAction;
	var canMove;
	var isMoving;
	var currentPage;
	var activePage;
	bodyHeight = document.body.clientHeight;
	document.addEventListener('touchstart',touch, false);  
	document.addEventListener('touchmove',touch, false);  
	document.addEventListener('touchend',touch, false);  
	function touch (event){  
	    var event = event || window.event;  
	    switch(event.type){  
	        case "touchstart": 
	        	moveAction = '';
	        	canMove = false;
	        	startY = event.touches[0].clientY;
	        	startTime = new Date();
	        	event.preventDefault(); 
	            break;  
	        case "touchmove":  
	        	if(isMoving) return;
	        	var offsetY = startY-event.touches[0].clientY;
	        	if(moveAction==''){
	        		if(offsetY<0){
		        		moveAction = 'down';
		        	}else{
		        		moveAction = 'up';
		        	}
		        	moveBefore(moveAction);
	        	}
	        	if(canMove){
	        		if(moveAction == 'up' && offsetY<=bodyHeight){
	        			currentPage.css('transform','scale('+(1-offsetY/bodyHeight)+')');
	        			activePage.css('transform','translateY('+(bodyHeight-offsetY)+'px)');
	        		}else if(moveAction == 'down' && offsetY>=-bodyHeight){
	        			currentPage.css('transform','scale('+(1+offsetY/bodyHeight)+')');
	        			activePage.css('transform','translateY('+(-bodyHeight-offsetY)+'px)');
	        		}
	        	}
	        	
	            break;  
	        case "touchend": 
	        	if(isMoving) return;
	        	if(!canMove) return;
	        	var offsetY = startY-event.changedTouches[0].clientY;
	        	var offsetTime = new Date()-startTime;
	        	var moveSpeed = (Math.abs(offsetY)/offsetTime)
	        	var forward = false;
	        	if(moveSpeed>0.8&&(offsetY>0&&moveAction=='up'||offsetY<0&&moveAction=='down')){
	        		forward = true;
	        	}else if(offsetY>bodyHeight/3){
	        		forward = true;
	        	}
	        	if(forward){
	        		currentPage.css('transform','scale(0.2)');
	        		activePage.css('transform','translateY(0)');
	        		currentPage.css('transition','transform 600ms');
	        		activePage.css('transition','transform 600ms');
	        		isMoving = true;
	        		setTimeout(function() {
	        			currentPage.css('transition','');
	        			activePage.css('transition','');
	        			currentPage.removeClass('currentPage');
	        			activePage.addClass('currentPage');
	        			activePage.removeClass('activePage');
	        			isMoving = false;
	        			pageShown(activePage);
	        		}, 700);
	        	}else{
	        		currentPage.css('transform','scale(1)');
	        		if(moveAction=='up'){
	        			activePage.css('transform','translateY(100%)');
	        		}else if(moveAction=='down'){
	        			activePage.css('transform','translateY(-100%)');
	        		}
	        		currentPage.css('transition','transform 600ms');
	        		activePage.css('transition','transform 600ms');
	        		isMoving = true;
	        		setTimeout(function() {
	        			currentPage.css('transition','');
	        			activePage.css('transition','');
	        			activePage.removeClass('activePage');
	        			isMoving = false;
	        		}, 700);
	        	}
	            break;  
	    }   
	} 

	function moveBefore(moveAction){
		currentPage = $('.currentPage');
		if(moveAction == 'up'){
			currentPage.css('transform-origin','center top 0px');
			activePage = currentPage.next();
			activePage.css('transform','translateY(100%)');
			
		}else{
			currentPage.css('transform-origin','center bottom 0px');
			activePage = currentPage.prev();
			activePage.css('transform','translateY(-100%)');
			
		}
		if(activePage[0]&&activePage.hasClass('page')){
			activePage.addClass('activePage');
			canMove = true;
			pageShow(activePage);
		}
	}

	function pageShow(page){
		console.info(page.attr('class').split(' ')[1].charAt(4));
	}

	function pageShown(page){
		console.info(page.attr('class').split(' ')[1].charAt(4));
	}
} 

function pauseMusic(dom) {
	var audio = $(dom).find('audio')[0];
	if(audio.paused)                     {                 
		audio.play();
		$(dom).addClass('action-rotate-n');
	}else{
		audio.pause();
		$(dom).removeClass('action-rotate-n');
	}
}
// JavaScript Document
function init(){
	uicontent_header();
	owl_start();
	people_menu();
	qaopen();
}

function owl_start(){
	//alert("owl1");
	/* Owl carousel */
	$(".owl-carousel").owlCarousel({
		slideSpeed : 500,
		rewindSpeed : 1000,
		mouseDrag : true,
		stopOnHover : true
	});
	//alert("aa");
	/* Own navigation */
	$(".owl-nav-prev").click(function(){
		//alert("prev");
		$(this).parent().next(".owl-carousel").trigger('owl.prev');
	});
	$(".owl-nav-next").click(function(){
		//alert('owl.next');
		$(this).parent().next(".owl-carousel").trigger('owl.next');
	});
}

function uicontent_header(){
	<!-- For Each Heading -->
	$(".ui-content h4").each(function(){
				var max = $(this).attr("data-valuemax");
				$(this).prop('Counter', 0 ).animate({ width: max + "%", Counter: max }, {			//Min value 0 and Max value attribute value	
					duration: 2000,
					easing: 'swing',
					step: function () {
					  $(this).children("span").text(Math.ceil(this.Counter) + "%");		//Count Number
					}
				});
	});
}

function qaopen(){
	<!-- On Click Event -->
	$(".ui-content h3 > a").click(function(e){
		e.preventDefault();
		if(!($(this).hasClass("active"))){
			$(this).parents("h3").next("p").slideDown(350);		//Slide Down
			$(this).addClass("active");					//Add Class
		}else{
			$(this).parent("h3").next("p").slideUp(350);			//Slide Up
			$(this).removeClass("active");					//Remove Class
		}
	});
}

function people_menu(){
	<!-- On Button Click -->
	$(".ui-action a.ui-btn").click(function(e){
		e.preventDefault();
		if(!($(this).parent(".ui-action").hasClass("open"))){
			$(this).parent(".ui-action").animate({
				right:"0px"      									//Animate Right
			});
			$(this).parent(".ui-action").addClass("open");			//Add Class to Action
		}else{
			$(this).parent(".ui-action").animate({
				right:"-92px"
			});
			$(this).parent(".ui-action").removeClass("open");		//Remove Class from Action
		}
	});	
	
	$(function () {
		$('.ui-tooltip').tooltip({ container: 'body' });			//Tooltip
	});
}
$(function(){
  jQuery.fn.exists = function(){return jQuery(this).length>0;}
  if(typeof(history) != 'undefined'){
    window.onpopstate = handlePopState;
    history.replaceState({ slide: getSlidenum() }, '', '/presentation/' + getSlidenum());
  }
  
  $('#prev-icon').click(function(){
    if(!$('#first-slide-marker').exists()){
      confirmFlash($(this));
      if(typeof(history) != 'undefined'){
      window.history.back();
      }else{

        window.navigate('/presentation/' + getSlidenum() -1);
      }
    }else{
      warningFlash($(this));
    }
  });

  $('#next-icon').click(function(){
    if(!$('#last-slide-marker').exists()){
      confirmFlash($(this));
      var slidenum = getSlidenum();
      newSlidenum = slidenum +1;
      if(typeof(history) != 'undefined'){
        history.pushState({ slide: newSlidenum }, '', '/presentation/' + newSlidenum)
        animateSlide('left');
      }else{
        window.navigate('/presentation/' + newSlidenum);
      }
    }else{
      warningFlash($(this));
    }
  });

  $(document).keydown(function(e){
    if (e.keyCode == 37) { 
      $('#prev-icon').click(); 
      return false;
    }else if(e.keyCode == 39){
      $('#next-icon').click();
      return false;
    }
  });
  

  $('.extendable').live('click',function(){
    $(this).next().toggle(500);
  });

  function animateSlide(direction){
    var slidenum = $('.slide').attr('slide_count');
    if(direction == 'left'){
      slidenum = parseInt(slidenum) +1;
    }else if(direction == 'right'){
      slidenum = parseInt(slidenum) -1;
    }else{
      return;
    }

    $.get('/render_slide/' + slidenum, function(data){
      $('#slide-container').append(data);
      oldSlide = $('.slide').first();
      newSlide = $('.slide').last();
      newSlide.hide();
      newSlide.css(direction,'700px');
      newSlide.css('top','-100%');
      newSlide.show();
      animation = new Object();
      animation[direction] = -700;
      oldSlide.animate(animation,
      {
        duration: 500,
        step: function(now){
          newSlide.css( direction, 700 + now);
        },
        complete: function(){
          oldSlide.remove();
          newSlide.attr('style','');
        }
      });
    });
  }

  function handlePopState(event){
    var slidenum = getSlidenum();
    slidenum = parseInt(slidenum);
    var nextSlidenum = event.state.slide;
    if(nextSlidenum > slidenum){
      animateSlide('left');
    }else if(nextSlidenum < slidenum){
      animateSlide('right');
    }
  }

  function getSlidenum(){
    return  parseInt($('.slide').attr('slide_count'));
  }


  function warningFlash(element){
    flash(element, '#FFDDDDD');
  }

  function confirmFlash(element){
    flash(element, '#DDFFDD');
  }
  function flash(element, hexColor){
    var thisElm = $(element);
    var origColor = thisElm.css('backgroundColor');
    thisElm.animate({
      backgroundColor: hexColor
    },{
      duration: 200,
      complete: function(){
        thisElm.animate({
          backgroundColor: origColor
        },{
          duration: 200,
          complete: function(){
            thisElm.attr('style','');
          }
        });
      }
    });
  }

});

  function loadCode(snippetName){
    $.get('/snippets/' + snippetName , function(data){
      $('pre.prettyprint').html(data);
      prettyPrint();
    });
  }

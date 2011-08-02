$(function(){
  ignored = false;
  jQuery.fn.exists = function(){return jQuery(this).length>0;}
  webkitFix();
  window.onpopstate = handlePopState;
  history.replaceState({ slide: getSlidenum() }, '', '/presentation/' + getSlidenum());
  
  $('#prev-icon').click(function(){
    if(!$('#first-slide-marker').exists()){
      confirmFlash($(this));
      console.log('back');
      window.history.back();
    }else{
      warningFlash($(this));
    }
  });

  $('#next-icon').click(function(){
    if(!$('#last-slide-marker').exists()){
      confirmFlash($(this));
      console.log('next');
      var slidenum = getSlidenum();
      newSlidenum = slidenum +1;
      console.log('slidenum is ' + slidenum);
      history.pushState({ slide: newSlidenum }, '', '/presentation/' + newSlidenum)
      animateSlide('left');
    }else{
      warningFlash($(this));
    }
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
    if(ignored){
      var slidenum = getSlidenum();
      slidenum = parseInt(slidenum);
      console.log(event.state);
      var nextSlidenum = event.state.slide;
      console.log('slidenum = ' + slidenum + ', nextSlidenum = ' + nextSlidenum);
      if(nextSlidenum > slidenum){
        animateSlide('left');
      }else if(nextSlidenum < slidenum){
        animateSlide('right');
      }
    }else{
      ignored = true;
    }
    return false;
  }

  function getSlidenum(){
    return  parseInt($('.slide').attr('slide_count'));
  }

  function webkitFix(){
    if(navigator.userAgent.match('AppleWebKit')){
      ignored = false;
    }else ignored = true;
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

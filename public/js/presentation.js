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
      slideRight();
    }else{
      warningFlash($(this));
    }
  });

  function slideLeft(){
    if(!$('#first-slide-marker').exists()){
      var slidenum = $('.slide').attr('slide_count');
      slidenum = parseInt(slidenum) -1;
      $.get('/render_slide/' + slidenum, function(data){
        $('#slide-container').append(data);
        oldSlide = $('.slide').first();
        newSlide = $('.slide').last();
        newSlide.hide();
        newSlide.css('right','700px');
        newSlide.show();
        oldSlide.animate({
          right: -700
        }, {
          duration: 500,
          step: function(now){
            newSlide.css( "right", 700 + now );
          },
          complete: function(){
            oldSlide.remove();
            newSlide.attr('style','');
          }
        });

      });
    }
  }

  function slideRight(){
    if(!$('#last-slide-marker').exists()){
      var slidenum = getSlidenum();
      var newSlidenum = slidenum +1;
      $.get('/render_slide/'+ newSlidenum, function(data){
        $('#slide-container').append(data);
        oldSlide = $('.slide').first();
        newSlide = $('.slide').last();
        newSlide.hide();
        newSlide.css('left','700px');
        newSlide.css('top', '-100%');
        newSlide.show();
        oldSlide.animate({
          left: -700
        }, {
          duration: 500,
          step: function(now){
            newSlide.css( "left", 700 + now );
          },
          complete: function(){
            oldSlide.remove();
            newSlide.attr('style', '');
          }
        });
      });
    }
  }

  function handlePopState(event){
    if(ignored){
      var slidenum = getSlidenum();
      slidenum = parseInt(slidenum);
      console.log(event.state);
      var nextSlidenum = event.state.slide;
      console.log('slidenum = ' + slidenum + ', nextSlidenum = ' + nextSlidenum);
      if(nextSlidenum > slidenum){
        slideRight();
      }else if(nextSlidenum < slidenum){
        slideLeft();
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

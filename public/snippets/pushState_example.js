$('#next-icon').click(function(){
  if(!$('#last-slide-marker').exists()){
    confirmFlash($(this));
    var newSlidenum = getSlidenum() +1;
    history.pushState(
      {slide: newSlidenum},
      '',
      '/presentation/' + newSlidenum
    );
    animateSlide('left');
  }else{
    warningFlash($(this));
  }
});

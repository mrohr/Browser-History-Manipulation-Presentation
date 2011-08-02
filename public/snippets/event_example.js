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

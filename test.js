  /* wrap name */
  var names = document.getElementsByClassName('name');
  for (var i = 0; i < names.length; i++) {
    var text = names[i].innerText;
    names[i].innerHTML = '<div class="name__bg"><span class="name__text">' + text + '</span></div>';
  }

  $(window).on('load resize onload_responsive_group', function () {
    $(".item").each(function () {
      $(this).find(".category").appendTo($(this).find(".thumbnail-wrap"));
    });
  });

  /* view */
  var pagings_el = '<div class="pagings"></div>';
  var paging_el = '';
  var total_page = $('.page-position').length;

  $('.pages').after(pagings_el);
  for (var i = 0; i < total_page; i++) {
    paging_el += '<span class="paging" paging-idx= "' + i + '"><i class="bar"></i></span>';
  }
  $('.pagings').append(paging_el);
  
  var pause_el = '<button class="pause" onclick="onClickPauseButton()">pause</button>'; 
  $('.pagings').after(pause_el);


  var curr_idx = 0; // current_page_index
  var $pause_button = $('.pause');
  var is_playing = true;

  $('.paging').on('click', function () {
    var curr_paging_idx = $(this).index();
    curr_idx = curr_paging_idx;
    gotoPage(curr_paging_idx)
    stopAutoSwipeTimer();
    
    $pause_button.html('pause');
    startAutoSwipeTimer();
    is_playing = true;
  });
  
  function fixCurrThumbnailScale($curr_item) {
    var curr_thumbnail = $curr_item.find('.thumbnail');
    var curr_thumbnail_trans = curr_thumbnail.css('transform');
    var curr_thumbnail_scale = curr_thumbnail_trans.split('(')[1].split(')')[0].split(',')[0]
    curr_thumbnail.css({
      'transform': 'scale('+ curr_thumbnail_scale +')'
    });
  }
  function fixCurrPagingBarWidth($curr_paging) {
    var curr_paging_bar = $curr_paging.find('.bar');
    var curr_paging_bar_width = curr_paging_bar.css('width');
    curr_paging_bar.css({
      'width': curr_paging_bar_width,
    });
  }

  function onClickPauseButton() { // toggle
    var $curr_item = $('.item:eq(' + curr_idx + ')');
    var $curr_paging = $('.paging:eq(' + curr_idx + ')');
    if (is_playing) {  // playing -> pause      
      fixCurrThumbnailScale($curr_item);
      fixCurrPagingBarWidth($curr_paging);
      $pause_button.html('start');
      stopAutoSwipeTimer();
      $curr_item.removeClass('current');
      $curr_paging.removeClass('current');
      is_playing = false;
    } else { // pause -> play
      $pause_button.html('pause');
      startAutoSwipeTimer();
      $curr_item.addClass('current');
      $curr_paging.addClass('current');
      is_playing = true;
    }
  }

  function applyPagingClass(curr_idx) {
    var $all_pagings = $('.paging');
    var $curr_paging = $('.paging:eq(' + curr_idx + ')');
    var $prev_pagings = $curr_paging.prevAll('.paging');
    $all_pagings.removeClass('current passed');
    $curr_paging.addClass('current');
    $prev_pagings.addClass('passed');
  }

  function applyItemClass(curr_idx) {
    var $all_items = $('.item');
    var $curr_item = $('.item' + curr_idx);
    $all_items.removeClass('current');
    $curr_item.addClass('current');
  }

  function applyNameClass(curr_idx) {
    var $all_items_name = $('.item .name');
    var $curr_item_name = $('.item' + curr_idx).find('.name');
    $all_items_name.removeClass('current');
    $curr_item_name.addClass('current');
  }

  var paging_timer = null;
  /* autoswipe */
  function startAutoSwipeTimer() {
    paging_timer = setInterval(nextPage, 5000);
  }
  function stopAutoSwipeTimer() {
    clearTimeout(paging_timer);
  }
  
  function gotoPage(curr_idx){
    $('.list').trigger('swipe_page', curr_idx + 1);
    $('.paging .bar').removeAttr('style');
    $('.thumbnail').removeAttr('style');
    applyItemClass(curr_idx);
    applyNameClass(curr_idx);
    applyPagingClass(curr_idx);
  }
  
  function nextPage() {
    curr_idx = ++curr_idx % total_page; // loop
    gotoPage(curr_idx);
  }
  gotoPage(curr_idx);
  startAutoSwipeTimer();

  // TODO: animation -> transition 과정에서 name의 사라지는 효과들 사라짐.
  // TODO: pause 눌렀다가 다시 실행하면, transition이 남은 시간이 아닌 최초값 기준 5초동안 실행됨. -> javascript로 실행해야 하나? 아니면 남은 초도 함께 저장하는 방법?
  // TODO: 잊고있던 좌우 arrow 추가, trigger 기능
  // TODO: 코드 정리 깔끔하게

  //start 할 때도 현재 bar 를 잘 찾아와서 current class를 붙인다.
  // idx 변수에 든 숫자를 쓴다.
  // 1. idx 변수를 위로 올린다.
  // 2. current index 만 공유하냐 아니면 current idx 요소를 공유하냐 -> 일단 idx 만 공유하고 나머지는 추가 작업으로 남겨둠.
  // 
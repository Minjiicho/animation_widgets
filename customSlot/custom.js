
/* 슬라이드 효과의 재생 시간 */
/* 단위는 'second' 입니다 */
/* 시간 설정 */
var init_duration_time = 5; /* A */

/* view */
var total_page = $('.item:not(.item-sub)').length,
    total_width = 100 * total_page;

  /* width */
  $('.target-wrap').css('width', total_width + '%');

  /* name */
  var names = document.getElementsByClassName('name');
  for (var i = 0; i < names.length; i++) {
    var text = names[i].innerText;
    names[i].innerHTML = '<div class="name__bg"><span class="name__text">' + text + '</span></div>';
  }

  /* paging */
  var pagings_el = '<div class="pagings"></div>';
  var paging_el = '';

  for (var i = 0; i < total_page; i++) {
    paging_el += '<span class="paging" paging-idx= "' + i + '"><i class="bar"></i></span>';
  }
  $('.target').after(pagings_el);
  $('.pagings').append(paging_el);

  /* prev & next & pause */
  var prev_el = '<span class="btn__prev"><span class="prev-icon"></span></span>';
  var next_el = '<span class="btn__next"><span class="next-icon"></span></span>';
  var pause_el = '<button class="btn__pause" onclick="onClickPauseButton()"></button>'; 

  $('.target').after(prev_el, pause_el, next_el);

  /* read more button */
  $('.item-link').each(function(){
    var item_url = $(this).attr('href');
    var read_more_btn_el = '<a class="btn__more" href="'+ item_url +'" target="_blank">READ MORE</a>';
    $(this).after(read_more_btn_el);
  })


  /* function */
  var item_width = 100 / total_page,
      curr_idx = 0, // current_page_index
      duration_time = init_duration_time, // init
      count_duration = null,
      is_playing = true,
      $pause_button = $('.btn__pause');

  function resetSwipeOption(){
    stopAutoSwipeTimer();
    startAutoSwipeTimer(init_duration_time);
    $pause_button.removeClass('paused');
    is_playing = true;
  }

  $('.paging').on('click', function () {
    var curr_paging_idx = $(this).index();
    var $curr_item = $('.item:eq(' + curr_paging_idx + ')');
    var $curr_paging = $('.paging:eq(' + curr_paging_idx + ')');

    if(curr_idx !== curr_paging_idx){
      curr_idx = curr_paging_idx;
      gotoPage(curr_idx);
      resetSwipeOption();
    }else{
      if(!is_playing){
        updateDurationTime($(this));
        startAutoSwipeTimer(duration_time);
        countDurationTime();
        $pause_button.removeClass('paused');
        $curr_item.addClass('current');
        $curr_paging.addClass('current');
        is_playing = true;
      }
    }
  });

  $('.btn__prev').on('click', function () {
    if (curr_idx === 0){
      curr_idx = total_page - 1;
    } else {
      curr_idx --;
    }
    gotoPage(curr_idx);
    resetSwipeOption();
  });
  $('.btn__next').on('click', function () {
    if (curr_idx === total_page - 1){
      curr_idx = 0;
    } else {
      curr_idx ++;
    }
    gotoPage(curr_idx);
    resetSwipeOption();
  });

  function countDown(){
    duration_time --;
    count_duration = setTimeout(countDown, 1000);
  }
  function countDurationTime() {
    count_duration = setTimeout(countDown, 1000);
  }
  function pauseDurationTime() {
    clearTimeout(count_duration);
  }

  function updateDurationTime($curr_paging) {
    if (duration_time === 0) {
      duration_time = 1;
    }
    var $all_thumbnail = $('.item .thumbnail');
    var $curr_paging_bar = $curr_paging.find('.bar');
    $all_thumbnail.css({
      'transition-duration': duration_time + 's',
    });
    $curr_paging_bar.css({
      'transition-duration': duration_time + 's',
    });
  }
  function fixCurrThumbnailScale($curr_item) {
    var $curr_thumbnail = $curr_item.find('.thumbnail');
    var curr_thumbnail_trans = $curr_thumbnail.css('transform');
    var curr_thumbnail_scale = curr_thumbnail_trans.split('(')[1].split(')')[0].split(',')[0]
    $curr_thumbnail.css({
      'transform': 'scale('+ curr_thumbnail_scale +')',
    });
  }
  function fixCurrPagingBarWidth($curr_paging) {
    var $curr_paging_bar = $curr_paging.find('.bar');
    var curr_paging_bar_width = $curr_paging_bar.css('width');
    $curr_paging_bar.css({
      'width': curr_paging_bar_width,
    });
  }

  function onClickPauseButton() { // toggle
    var $curr_item = $('.item:eq(' + curr_idx + ')');
    var $curr_paging = $('.paging:eq(' + curr_idx + ')');
    if (is_playing) {  // playing -> pause      
      fixCurrThumbnailScale($curr_item);
      fixCurrPagingBarWidth($curr_paging);
      stopAutoSwipeTimer();
      pauseDurationTime();
      $pause_button.addClass('paused');
      $curr_item.removeClass('current');
      $curr_paging.removeClass('current');
      is_playing = false;
    } else { // pause -> play
      updateDurationTime($curr_paging);
      startAutoSwipeTimer(duration_time);
      countDurationTime();
      $pause_button.removeClass('paused');
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

  var swipe_timer = null;

  /* autoswipe */
  function startAutoSwipeTimer(duration_time) {
    swipe_timer = setTimeout(nextPage, duration_time * 1000);
  }
  function stopAutoSwipeTimer() {
    clearTimeout(swipe_timer);
  }


  /* reco-api util 코드 */
  var simpleStringHash = function(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return Math.abs(hash);
  };
  var logByHiddenImg = function(url) {
    if (url === '#?') return;
    if (url.indexOf('is_gif=1') === -1) {
      url += (url.indexOf('?') > -1 && '&' || '?') + 'is_gif=1';
    }
    var hash = simpleStringHash(url);
    var id = "beacon-" + hash;
    if ($("#" + id).length === 0) {
      $('body').append(
        '<img id="' + id + '" width="1" height="1" src="' + url + '" style="display:none">'
      );
    }
    // bfcache와 같은 iframe cache reload시 발생할 수 있는 중복로그 방어
    $("#" + id).on('load', function() {
      $("#" + id).remove();
    });
  };

  var curr_adSlot_idx = 0;
  function gotoPage(curr_idx){
    var $curr_item = $('.item:eq(' + curr_idx + ')');
    duration_time = init_duration_time;
    target_pos = - item_width * curr_idx;
    $('.target').css('left', target_pos + '%');
    $('.paging .bar, .thumbnail').removeAttr('style');
    applyItemClass(curr_idx);
    applyNameClass(curr_idx);
    applyPagingClass(curr_idx);
    if ($curr_item.hasClass('item-sp') && curr_adSlot_idx < total_adSlot){ // 현재 활성화된 아이템이 광고슬롯이고, 전체 광고슬롯 안에 포함된 경우,
      var arrCurrAdExposeLink = arrAdExposeLinks[curr_adSlot_idx],
          strCurrAdExposeLink = arrCurrAdExposeLink.toString();
      logByHiddenImg(strCurrAdExposeLink);
      curr_adSlot_idx ++;
    }
  }

  function nextPage() {
    curr_idx = ++curr_idx % total_page; // loop
    gotoPage(curr_idx);
    swipe_timer = setTimeout(nextPage, duration_time * 1000);
  }

  /* customize ad exposelog */
  var total_adSlot = $('.item-sp').length; // 전체 광고슬롯의 갯수
  var arrAdExposeLinks = window.PARAMS.ad_exposelog_links.slice(); // 기존 배열을 복제/저장해둔다
  window.PARAMS.ad_exposelog_links.length = 0; // 기존 배열을 비운다

  $(window).on('expose', function() {
    setTimeout(function(){
      gotoPage(curr_idx);
    }, 10);
    startAutoSwipeTimer(duration_time);
    countDurationTime();
  });
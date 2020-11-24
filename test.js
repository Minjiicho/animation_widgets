  /* wrap name */
  var names = document.getElementsByClassName('name');
  for (var i = 0; i < names.length; i++) {
    var text = names[i].innerText;
    names[i].innerHTML = '<div class="name-inner">' + text + '</div>';
  }

  $(window).on('load resize onload_responsive_group', function () {
    $(".item").each(function () {
      $(this).find(".category").appendTo($(this).find(".thumbnail-wrap"));
    });
  });

  /* paging view */
  var pagings = '<div class="pagings"></div>';
  $('.pages').after(pagings);

  var paging = '';
  var total_page = $('.page-position').length; //set total pages
  for (var i = 0; i < total_page; i++) {
    paging += '<span class="paging" paging-idx= "' + i + '"><i class="bar"></i></span>';
  }
  $('.pagings').append(paging);

  /* paging function */
  $('.paging').each(function (index) {
    $(this).on('click', function () {

      // 페이지 변경
      $('.list').trigger('swipe_page', index + 1);

      // swipe 그 시점부터 다시 활성화
      // stopAutoSwipeTimer(); // stop이 아니라 해당 위치의 이후 페이지에만 auto되도록...

      // 썸네일 zoom 애니메이션
      var pagingIndex = $(this).attr('paging-idx');
      $('.item').removeClass('current');
      $('.item[data-idx=' + pagingIndex + ']').addClass('current');

      // paging 애니메이션
      // 이미 current인 paging은 클릭해도 변함없음
      $(this).siblings('.paging').removeClass('current passed');
      $(this).prevAll('.paging').addClass('passed');
      $(this).removeClass('passed').addClass('current');

    });
  });

  /* pause view */
  var pause = '<button class="pause" onclick="onClickPauseButton()">pause</button>';
  $('.pagings').after(pause);

  function fixCurrentPagingBarWidth($curr_paging) {
    var currPagingBar = $curr_paging.find('.bar');
    var currPagingBarWidth = currPagingBar.css('width')
    currPagingBar.css({
      'width': currPagingBarWidth,
    });
  }

  /* pause function */
  var is_playing = true;
  function onClickPauseButton() { // toggle
//     1. 버튼 텍스트 바꾸기, 2. progressbar 너비 유지, 다시 autoSwipe 시작.
    var pauseButton = $('.pause');
    var $curr_paging = $('.paging.current');
    
    // toggle
    if (is_playing) {  // playing -> pause
      fixCurrentPagingBarWidth($curr_paging);
      pauseButton.html('start');
      stopAutoSwipeTimer();
      $curr_paging.removeClass('current');
      is_playing = false;
    } else { // pause -> play
      pauseButton.html('pause');
      startAutoSwipeTimer();
      $curr_paging.addClass('current');
      is_playing = true;
    }
  }

  var paging_timer = null;
  /* autoswipe */
  function startAutoSwipeTimer() {
    console.log("running startAutoSwipeTimer")
    paging_timer = setInterval(nextPage, 5000);
  }

  
  function gotoPage(idx){
    console.log('running gotoPage: ', idx)
    $('.list').trigger('swipe_page', idx + 1);
    applyClass(idx);
  }

  function applyClass(idx) {
    var $all_pagings = $('.paging');
    var $current_paging = $('.paging:eq(' + idx + ')');
    var $prev_pagings = $current_paging.prevAll('.paging');
    // var $next_pagings = $current_paging.nextAll('.paging');
    $all_pagings.removeClass('current passed');
    $current_paging.addClass('current');
    $prev_pagings.addClass('passed');
  }
  
  var idx = 0; // current_page
  function nextPage() {
    console.log("running nextPage");
    idx = ++idx % total_page; // loop
    gotoPage(idx);
  }
  gotoPage(idx);
  
  startAutoSwipeTimer();

  function stopAutoSwipeTimer() {
    clearTimeout(paging_timer);
  }

  // TODO: 일시정지 한 다음 start 눌렀을 때 nav 바의 파란 막대가 멈춘채로 있다 넘어감.
  // TODO: 같은 상황에서 파란 nav bar 채워지는 속도가 느려짐.
  // TODO: 현재 네비게이션 바 클릭시 썸네일 zoom 이 의도대로 안 됨.
  // TODO: 코드 정리 깔끔하게
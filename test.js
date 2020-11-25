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
  var idx = 0; // current_page

  var pause = '<button class="pause" onclick="onClickPauseButton()">pause</button>';
  $('.pagings').after(pause);

  function fixCurrentPagingBarWidth($curr_paging) {
    var currPagingBar = $curr_paging.find('.bar');
    var currPagingBarWidth = currPagingBar.css('width')
    currPagingBar.css({
      'width': currPagingBarWidth,
    });
  }
  function resetPagingBarWidth($curr_paging){
    var currPagingBar = $curr_paging.find('.bar');
  };

  /* pause function */
  var is_playing = true;
  function onClickPauseButton() { // toggle
//     1. 버튼 텍스트 바꾸기, 2. progressbar 너비 유지, 다시 autoSwipe 시작.
    var pauseButton = $('.pause');
    var $curr_paging = $('.paging:eq(' + idx + ')');
    
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
    $('.paging .bar').removeAttr('style');
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

  
  // TODO: 현재 네비게이션 바 클릭시 썸네일 zoom 이 의도대로 안 됨.
    // pause 상태에서 페이지 바를 누르면 버튼은 start 인 채로 파란 bar 는 차오르는데 bar 가 가득차도 다음 페이지로 넘어가진 않음.
    // 위 경우에 대한 시나리오 정리 필요.
  // TODO: 코드 정리 깔끔하게

  //start 할 때도 현재 bar 를 잘 찾아와서 current class를 붙인다.
  // idx 변수에 든 숫자를 쓴다.
  // 1. idx 변수를 위로 올린다.
  // 2. current index 만 공유하냐 아니면 current idx 요소를 공유하냐 -> 일단 idx 만 공유하고 나머지는 추가 작업으로 남겨둠.
  // 
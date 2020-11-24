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
    // var setAutoSwipe1 = setTimeout(function () {
    //   $('.item[data-idx=' + 0 + ']').addClass('current');
    //   $('.paging:eq(' + 0 + ')').delay(1000).addClass('current');
    //   console.log('init')
    // }, 100);

    // for (j = 1; j < total_page; j++) {
    //   (function (j) {
    //     // 작업 중
    //     // state : current, passed
    //     // action : swipe 
    //     var setAutoSwipe = setTimeout(function (j) {
    //       var currPaging = $('.paging:eq(' + j + ')');
    //       currPaging.siblings().removeClass('current passed');
    //       currPaging.prevAll('.paging').addClass('passed'); // addClass 여러번
    //       currPaging.removeClass('passed').addClass('current');

    //       $('.list').trigger('swipe_page', j + 1)
    //       $('.item').removeClass('current');
    //       $('.item[data-idx=' + j + ']').addClass('current');
    //     }, 5000 * j);
    //   })(j);
    // }

    paging_timer = setInterval(nextPage, 1000);
  }

  
  function gotoPage(i){$('.list').trigger('swipe_page', i);} // i = 1, 2, 3...
  var i = 1; // current_page
  
  function nextPage() {
    i = i % total_page + 1; // loop
    gotoPage(i);
    // setCurrentPageBars(i);
    // setPrevPageBars(i);
    // removeClassPageBars();
  }
  

  /* 
  1. 모든 페이지에 대해
  2. 5초에 한번 페이지를 넘긴다. $('.list').trigger('swipe_page', j + 1)
  3. 페이지를 넘길 때 (index)
    1. 현재 페이지만 current 를 갖는다.
    2. 이전 페이지들만 passed 를 갖는다.
    3. 이후 페이지는 아무런 class도 없다. 
  */
  startAutoSwipeTimer();

  function stopAutoSwipeTimer() {
    clearTimeout(paging_timer);
  }
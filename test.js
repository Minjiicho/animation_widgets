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
  var total_page = 3; //set total pages
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
      stopAutoSwipe(); // stop이 아니라 해당 위치의 이후 페이지에만 auto되도록...

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

  /* pause function */
  function onClickPauseButton() {
    var pauseButton = $('.pause');;

    if (pauseButton.html() === 'pause') {
      var currPaging = $('.paging.current');
      var currPagingIndex = currPaging.attr('paging-idx');
      var currPagingBar = currPaging.find('.bar');
      var currPagingBarWidth = currPagingBar.css('width')

      console.log(currPagingIndex)

      pauseButton.html('start');
      stopAutoSwipe();

      currPagingBar.css({
        'width': currPagingBarWidth
      });
      currPaging.removeClass('current');

    } else {
      pauseButton.html('pause');
      autoSwipe();
      $('.paging:eq(' + currPagingIndex + ')').addClass('current')
    }
  }

  /* autoswipe */
  function autoSwipe() {
    setAutoSwipe1 = setTimeout(function () {
      $('.item[data-idx=' + 0 + ']').addClass('current');
      $('.paging:eq(' + 0 + ')').delay(1000).addClass('current');
      console.log('init')
    }, 100);

    for (j = 1; j < total_page; j++) {
      (function (j) {
        setAutoSwipe = setTimeout(function (j) {
          var currPaging = $('.paging:eq(' + j + ')');
          currPaging.siblings().removeClass('current passed');
          currPaging.prevAll('.paging').addClass('passed');
          currPaging.removeClass('passed').addClass('current');

          $('.list').trigger('swipe_page', j + 1)
          $('.item').removeClass('current');
          $('.item[data-idx=' + j + ']').addClass('current');
        }, 5000 * j);
      })(j);
    }
  }
  autoSwipe();

  function stopAutoSwipe() {
    clearTimeout(setAutoSwipe1);
    clearTimeout(setAutoSwipe);
  }
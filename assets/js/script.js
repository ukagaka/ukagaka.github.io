
/*!--------------------------------*\
   3-Jekyll Theme
   @author Peiwen Lu (P233)
   https://github.com/P233/3-Jekyll
   Modified by saymagic
   http://blog.saymagic.cn/
\*---------------------------------*/

// Detect window size, if less than 1280px add class 'mobile' to sidebar therefore it will be auto hide when trigger the pjax request in small screen devices.
if ($(window).width() <= 1280) {
  $('#sidebar').addClass('mobile')
}

// Variables
var sidebar    = $('#sidebar'),
    container  = $('#post'),
    content    = $('#pjax'),
    button     = $('#icon-arrow');

// Tags switcher
var clickHandler = function(id) {
  return function() {
    $(this).addClass('active').siblings().removeClass('active');
    $('.pl__all').hide();
    $('.' + id).delay(50).fadeIn(350);
  }
};

$('#tags__ul li').each(function(index){
  $('#' + $(this).attr('id')).on('click', clickHandler($(this).attr('id')));
});

// If sidebar has class 'mobile', hide it after clicking.
$('.pl__all').on('click', function() {
  $(this).addClass('active').siblings().removeClass('active');
  if (sidebar.hasClass('mobile')) {
    $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
  }
});

// Enable fullscreen.
$('#js-fullscreen').on('click', function() {
  if (button.hasClass('fullscreen')) {
    goback_normal();
  } else {
    goto_fullscreen();
  }
});

$('#mobile-avatar').on('click', function(){
  $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
});

$(document).keydown(function(event){ 
  switch(event.keyCode){
    case 38:
    case 40:
    case 83:
    case 87:
      if(sidebar.hasClass('fullscreen')){
        goback_normal();
      }else{
         goto_fullscreen();
      }
      break;
    case 37:
    case 65:
      //上一篇
      if($("#goto_previous_page").length > 0){
        location.href = $("#goto_previous_page").attr("href"); 
      } 
      break;
    case 39:
    case 68:
      //下一篇
      if($("#goto_next_page").length > 0){
        location.href = $("#goto_next_page").attr("href");  
      }
      break;
  }
});

// Pjax
$(document).pjax('#avatar, #mobile-avatar, .pl__all', '#pjax', { fragment: '#pjax', timeout: 10000 });
$(document).on({
  'pjax:click': function() {
    content.removeClass('fadeIn').addClass('fadeOut');
    sidebar.addClass('fullscreen');
    button.addClass('fullscreen');
    content.addClass('fullscreen');
    NProgress.start();
  },
  'pjax:start': function() {
    content.css({'opacity':0});
  },
  'pjax:end': function() {
    NProgress.done();
    container.scrollTop(0);
    content.css({'opacity':1}).removeClass('fadeOut').addClass('fadeIn');
    afterPjax();
  }
});

// Re-run scripts for post content after pjax
function afterPjax() {

  $("pre").addClass("prettyprint linenums");
  prettyPrint();
  // 这里我们将post__content页面中没有target属性的链接全部用新窗口打开
  $('#post__content a').each(function(){
    if(typeof($(this).attr("target"))=="undefined"){
      $(this).attr('target','_blank');
    }
  })

  // Generate post TOC for h1 h2 and h3
  var toc = $('#post__toc-ul');
  // Empty TOC and generate an entry for h1
  toc.empty().append('<li class="post__toc-li post__toc-h1"><a href="#post__title" class="js-anchor-link">' + $('#post__title').text() + '</a></li>');

  // Generate entries for h2 and h3
  $('#post__content').children('h2,h3').each(function() {
    // Generate random ID for each heading
    $(this).attr('id', function() {
      var ID = "",
          alphabet = "abcdefghijklmnopqrstuvwxyz";

      for(var i=0; i < 5; i++) {
        ID += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }
      return ID;
    });

    if ($(this).prop("tagName") == 'H2') {
      toc.append('<li class="post__toc-li post__toc-h2"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');
    } else {
      toc.append('<li class="post__toc-li post__toc-h3"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');
    }
  });

  // Smooth scrolling
  $('.js-anchor-link').on('click', function() {
    var target = $(this.hash);
    container.animate({scrollTop: target.offset().top + container.scrollTop() - 70}, 500, function() {
      target.addClass('flash').delay(700).queue(function() {
        $(this).removeClass('flash').dequeue();
      });
    });
  });

  $('#search-input').on('click', function() {
    $('#search-input').hide();
    var cx = $("#google_cx").text();
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
        '//www.google.com/cse/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
  });
  var ds = document.createElement('script');
  ds.type = 'text/javascript';ds.async = true;
  ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
  ds.charset = 'UTF-8';
  (document.getElementsByTagName('head')[0] 
     || document.getElementsByTagName('body')[0]).appendChild(ds);
  pajx_loadDuodsuo();
  pajx_load_fullscreen();
}afterPjax();


function pajx_load_fullscreen(){
    sidebar.addClass('fullscreen');
    button.addClass('fullscreen');
    content.addClass('fullscreen');
      //小屏时不进行显示右侧章节列表
    if($(window).width() > 500){
      $("#post__toc-trigger").removeClass("trigger_unhover");
      $("#post__toc-trigger").addClass("trigger_hover");
    }
}
/**
 * 切换到全屏
 * @return {[type]} [description]
 */
function goto_fullscreen(){
    sidebar.addClass('fullscreen');
    button.addClass('fullscreen');
    content.delay(200).queue(function(){
      $(this).addClass('fullscreen').dequeue();
    });

    //小屏时不进行显示右侧章节列表
    if($(window).width() > 500){
      $("#post__toc-trigger").removeClass("trigger_unhover");
      $("#post__toc-trigger").addClass("trigger_hover")
    }
}

/**
 * 切换到三栏模式
 * @return {[type]} [description]
 */
function goback_normal(){
    sidebar.removeClass('fullscreen');
    button.removeClass('fullscreen');
    content.delay(300).queue(function(){
      $(this).removeClass('fullscreen').dequeue();
    });
       $("#post__toc-trigger").removeClass("trigger_hover");
    $("#post__toc-trigger").addClass("trigger_unhover")
}
/**
 * pjax后需要回调函数.加载多说
 */
function pajx_loadDuodsuo(){
    var dus=$(".ds-thread");
    if($(dus).length==1){
        var el = document.createElement('div');
        el.setAttribute('data-thread-key',$(dus).attr("data-thread-key"));//必选参数
        el.setAttribute('data-url',$(dus).attr("data-url"));
        DUOSHUO.EmbedThread(el);
        $(dus).html(el);
    }
}



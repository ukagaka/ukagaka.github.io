// Window Scroll
var windowScroll = function () {
    $(window).scroll(function () {

        var scrollPos = $(this).scrollTop();

        if ($(window).scrollTop() > 70) {
            $('.site-header').addClass('site-header-nav-scrolled');
        } else {
            $('.site-header').removeClass('site-header-nav-scrolled');
        }
    });
};

$( document ).ready(function() {
    var ds = document.createElement('script');
    ds.type = 'text/javascript';ds.async = true;
    ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
    ds.charset = 'UTF-8';
    (document.getElementsByTagName('head')[0]
    || document.getElementsByTagName('body')[0]).appendChild(ds);
    windowScroll();
    // pajx_loadDuodsuo();
});
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
function pajx_loadDuodsuo(){
    var dus=$(".comments");
    if($(dus).length==1){
        var el = document.createElement('div');
        el.setAttribute('data-thread-key',$(dus).attr("data-thread-key"));//必选参数
        el.setAttribute('data-url',$(dus).attr("data-url"));
        DUOSHUO.EmbedThread(el);
        $(dus).html(el);
    }
}
$( document ).ready(function() {
    windowScroll();
});
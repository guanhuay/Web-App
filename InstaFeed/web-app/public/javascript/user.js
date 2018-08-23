$(function(){
    var settings = {
        eventElem: document
    };
    new Particleground.particle( '.bg', settings );
});

$("footer").attr('postion','fixed');
$(".button-collapse").sideNav();
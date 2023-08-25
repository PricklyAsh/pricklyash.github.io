var slideshow = {
    elements: $(".contents > li"),
    currentIndex: 0,
    init: function(){
        this.currentIndex = Math.floor(this.elements.length / 2);
        $(this.elements[this.currentIndex]).addClass("main");
        $("#info").text($(".main").data("info"));
        this.startTransition();
    },
    startTransition: function(){
        setInterval(()=> this.transition(), 2000)
    },
    transition: function(){
        if (document.hidden) {
            $("#info").stop(true, true);
        } else {
            $("#info").fadeOut(function() {
                $("#info").text($(".main").data("info"));
            }).fadeIn();
        }
        
        this.elements.removeClass();

        this.currentIndex++;
        this.currentIndex = this.currentIndex >= this.elements.length ? 0 : this.currentIndex;
        $(this.elements[this.currentIndex]).addClass("main");
        $(".main").prev().addClass("l1").prev().addClass("l2").prev().addClass("r2").prev().addClass("r1");
        $(".main").next().addClass("r1").next().addClass("r2").next().addClass("l2").next().addClass("l1");
        
    },
}

slideshow.init();
mobileChecker();
function mobileChecker(){
    $("body").removeClass("mobile");
    if ($(window).width() < 700) {
        $("body").addClass("mobile");
    }
}
addEventListener("resize", mobileChecker);

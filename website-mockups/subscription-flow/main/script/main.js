var swiper = new Swiper(".swiper", {
  noSwiping: true,
  allowSlideNext: false
});

var swiperPB = {
  activeSlideIndex: 1,
  handleVisibilityChange: function(){
    if (document.hidden) {
      activeSlideIndex = swiper.activeIndex;
    } else {
      console.log("ok")
      swiper.slideTo(1);
    }
  }
}

var subscriptionFlow = {
  pages: [
    "learn",
    "earn",
    "gifts",
    "letsGo",
    "learningPlan"
  ],
  selections: [],
  selectors: {
    elements: {
      learn: $('#learn ul.selectors li'),
      earn: $('#earn ul.selectors li')
    },
    animate: function(element){
      console.log("animate", this)
      element.each(function(i, el) {
        setTimeout(function() {
            $(el).addClass('visible');
        }, i * 100);
      });
    }
  },
  progressBar: {
    element: $("#progressBar .bar"),
    update: function(value) {
      this.element.css("width", value + "%");
    }
  },
  init: function(){
    $(".top").addClass("show");
    this.selectors.animate(this.selectors.elements.learn);
    this.events.clickEvents.init();
    this.events.window.init();

    var pageNumb = $("body").data("page");
    $.each(this.pages, function( index, value ) {
      if (pageNumb <= 1){
        return;
      }
      $("#" + value).hide();
    });
    $("#"+ this.pages[pageNumb]).show();
    this.onPageChange(pageNumb);
  },
  onPageChange: function(page){
    if (page == 1) {
      this.progressBar.update(20);
      this.selectors.animate(this.selectors.elements.earn);
    } else if (page == 2){
      slideshow.init();
      this.progressBar.update(40);
    } else if (page == 3){
      this.progressBar.update(60);
      $("#gifts").fadeOut();
      $("#letsGo").fadeIn(function(){
        $("#letsGo").find("li").each(function(index){
          $(this).delay(index * 500).queue(function () {
            $(this).addClass("visible").dequeue();
          });
        });
      });
    } else if (page == 4){
        this.progressBar.update(80);
        setTimeout(function(){
          $("#letsGo").hide();
          $("#learningPlan").fadeIn("slow");
          $("#learningPlan").find(".plan").each(function() {
            var moreInfoEle = $(this).find(".more-info");
            var outerHeight = moreInfoEle.outerHeight();
            moreInfoEle.attr("data-height", outerHeight);
            console.log(moreInfoEle, outerHeight)
            moreInfoEle.css("height", 0);
          });

          var duration = $("[data-earn]").data("earn");
          if (duration == "casual"){
            $("#plus").addClass("expand");
            $("[data-tier]").data("tier","plus")
            $(".more-info").css("height","0");
            $("#plus .more-info").css("height",$("#plus .more-info").data("height")+"px");

            $("#plus").get(0).scrollIntoView();
          } else if (duration == "engaged"){
            $("#pro").addClass("expand");
            $("[data-tier]").data("tier","pro")
            $(".more-info").css("height","0");
            $("#pro .more-info").css("height",$("#pro .more-info").data("height")+"px");

            $("#pro").get(0).scrollIntoView();
          } else if (duration == "dedicated"){
            $("#drops").addClass("expand");
            $("[data-tier]").data("tier","drops")
            $(".more-info").css("height","0");
            $("#drops .more-info").css("height",$("#drops .more-info").data("height")+"px");

            $("#drops").get(0).scrollIntoView();
          }
        },300);
    }
  },
  events: {
    window: {
      init: function(){
        addEventListener("resize", mobileChecker);
      }
    },
    clickEvents: {
      slideTo: function(){
      },
      init: function(){
        var oneSelected = false;
        $("body").on("click",".selectors li", function(){
          if ($(this).parent().parent().attr("id") == "learn"){
            $(this).toggleClass("selected");
            $(this).hasClass("selected") ? subscriptionFlow.selections.push($.trim($(this).text().toLowerCase())) : subscriptionFlow.selections.pop($.trim($(this).text().toLowerCase()))
            $("[data-learn]").attr("data-learn",subscriptionFlow.selections.join(","));
            if ($(this).parent().find(".selected").length) {
              // swiper.allowSlideNext = true;
              $(".bottom").addClass("show");
            } else {
              // swiper.allowSlideNext = false;
              $(".bottom").removeClass("show");
            }
          } else {
            if (!oneSelected){
              $(this).addClass("selected").addClass("animate");
              $("[data-earn]").attr("data-earn", $(this).find("span:nth-of-type(1)").text().toLowerCase());
              oneSelected = true;
            }
          }
          
        })
        
        $("body").on("click", "[data-swiper-to]", function(){
          $(this).addClass("animate");
          var swipeInt = parseInt($(this).data("swiper-to"));
          setTimeout(function() {
            swiper.allowSlideNext = true;
            swiper.slideTo(swipeInt);
            $("body").attr("data-page", swipeInt);
            subscriptionFlow.onPageChange(swipeInt);
          }, 800);
        });

        $("body").on("click", "[data-go-to-page]", function(){
          var pageInt = parseInt($(this).data("go-to-page"));
          console.log(pageInt);
          if (!oneSelected && pageInt == 2 || pageInt != 2){
            $(this).addClass("animate");
          }
          
          setTimeout(function() {
            $("body").attr("data-page", pageInt);
            subscriptionFlow.onPageChange(pageInt);
          }, 800);
        });

        $("body").on("click","#learningPlan .plan", function(){
          console.log($(this));
          var currentMoreInfo = $(this).find(".more-info");
          $("#learningPlan .plan").removeClass("expand")
          $(this).addClass("expand");
          $("[data-tier]").data("tier",$(this).attr("id"))
          $(".more-info").css("height","0");
          currentMoreInfo.css("height",currentMoreInfo.data("height")+"px");
        });

        $("body").on("click", "#openStripe", function(){
          var tier = $("[data-tier]").data("tier");
          if (tier == "plus") {
            window.open("https://buy.stripe.com/4gwcNwdv9djD9MY004", "_self");
          } else if (tier == "plus") {
            window.open("https://buy.stripe.com/9AQ00K2Qv5Rb0coeUZ", "_self");
          } else if (tier == "drops") {
            window.open("https://buy.stripe.com/3cs4h02Qv3J32kwaEK", "_self");
          }
        });
      }
    }
  }
}

var slideshow = {
  elements: $(".contents > li"),
  currentIndex: 0,
  shouldAnimate: false,
  init: function(){
      this.currentIndex = Math.floor(this.elements.length / 2);
      $(this.elements[this.currentIndex]).addClass("main");
      $("#info").text($(".main").data("info"));
      $(".swiper").fadeOut();
      $("#gifts").show();
      $("#gifts").addClass("show");
      $(".slideshow").addClass("show");
      $(".rays").addClass("show");
      shouldAnimate = true;
      this.startTransition();
  },
  startTransition: function(){
      setInterval(()=> this.transition(), 2000)
  },
  transition: function(){
    if (!shouldAnimate){
      subscriptionFlow.onPageChange(3);
      return
    }
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
      
      if (
        $("#info").hasClass("l1") &&
        $("#info").hasClass("l2") &&
        $("#info").hasClass("r1") &&
        $("#info").hasClass("r2")
      ){
        shouldAnimate = false;
      }
  },
}

subscriptionFlow.init();








mobileChecker();
function mobileChecker(){
  $("body").removeClass("mobile").addClass("desktop");
  if ($(window).width() < 700) {
      $("body").addClass("mobile").removeClass("desktop");
  }
}




document.addEventListener('visibilitychange', swiperPB.handleVisibilityChange, false);
var swiper = new Swiper(".swiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
      el: ".swiper-pagination",
    },
    allowSlideNext: false
});

var subscriptionFlow = {
  pages: [
    "learn",
    "earn",
    "gifts",
    "letsGo",
    "learningPlan"
  ],
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
          $(this).delay(index * 1000).queue(function () {
            $(this).addClass("visible").dequeue();
          });
        });
      });
    } else if (page == 4){
        $("#gifts").show();
        $("#learningPlan").find(".plan").each(function() {
          var moreInfoEle = $(this).find(".more-info");
          var outerHeight = moreInfoEle.outerHeight();
          console.log(outerHeight);
          moreInfoEle.attr("data-height", outerHeight);
          moreInfoEle.css("height", 0);
        });
      
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
            console.log(pageInt+"HHH");
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
          $(".more-info").css("height","0");
          currentMoreInfo.css("height",currentMoreInfo.data("height")+"px");
        });
      }
    }
  }
}

var slideshow = {
  elements: $(".contents > li"),
  currentIndex: 0,
  init: function(){
      this.currentIndex = Math.floor(this.elements.length / 2);
      $(this.elements[this.currentIndex]).addClass("main");
      $("#info").text($(".main").data("info"));
      $(".swiper").fadeOut();
      $("#gifts").show();
      $("#gifts").addClass("show");
      $(".slideshow").addClass("show");
      $(".rays").addClass("show");
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

subscriptionFlow.init();








mobileChecker();
function mobileChecker(){
  $("body").removeClass("mobile").addClass("desktop");
  if ($(window).width() < 700) {
      $("body").addClass("mobile").removeClass("desktop");
  }
}





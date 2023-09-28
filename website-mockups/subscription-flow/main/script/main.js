var debug = false;

if (!debug) {
  console = {
    log: function(){
      
    }
  }
}

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
    "inputEmail",
    "letsGo",
    "learningPlan",
    "areYouSure"
  ],
  backPressed: false,
  earnSelected: false,
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
  onBackPressed: function(page){

  },
  onPageChange: function(page){
    if (page == 0) {
      this.progressBar.update(15);
      swiper.slideTo(0);
    } else if (page == 1) {
      this.progressBar.update(30);
      this.selectors.animate(this.selectors.elements.earn);
      $("#learnEarn").fadeIn();
      $("#gifts").fadeOut();
    } else if (page == 2) {
      $("#learnEarn").fadeOut();
      this.earnSelected = false;
      if (this.backPressed){
        $("#inputEmail").fadeOut();
        this.backPressed = false;
        $("#gifts").fadeIn();
      } else {
        $("#gifts").fadeIn();
      }
      if (!swiperPB.swiperInitialised) {
        slideshow.init();
        swiperPB.swiperInitialised = true;
      }
      
      this.progressBar.update(45);
    } else if (page == 3) {
      $("#gifts").fadeOut();
      $("#letsGo").fadeOut();
      $("#inputEmail").fadeIn();
    } else if (page == 4) {
      this.progressBar.update(60);
      $("#inputEmail").fadeOut();
      $("#learningPlan").fadeOut();
      $("#letsGo").fadeIn(function(){
        $("#letsGo").find("li").each(function(index){
          $(this).delay(index * 500).queue(function () {
            $(this).addClass("visible").dequeue();
          });
        });
      });
    } else if (page == 5){
        this.progressBar.update(75);
        if (this.backPressed){
          $("#areYouSure").fadeOut();
          $("#learningPlan").show();
          this.backPressed = false;
          return;
        }
        setTimeout(function(){
          $("#letsGo").hide();
          $("#learningPlan").fadeIn("slow");
          $("#learningPlan").find(".plan").each(function() {
            var moreInfoEle = $(this).find(".more-info");
            var outerHeight = moreInfoEle.outerHeight();
            moreInfoEle.attr("data-height", outerHeight);

            if ($("body").hasClass("squashed")) {
              moreInfoEle.css("height", 0);
            }

          });

          var duration = $("[data-earn]").data("earn");
          if (duration == "dedicated" || subscriptionFlow.selections.includes("language")){
            $("#drops").addClass("expand").addClass("recommended").addClass("selected");
            $("[data-tier]").attr("data-tier","drops")
            $("#drops .more-info").css("height",$("#drops .more-info").data("height")+"px");

            if ($("body").hasClass("squashed")) {
              // $(".more-info").css("height","0");
            }
            $("#drops").get(0).scrollIntoView();
          } else if (duration == "engaged"){
            $("#pro").addClass("expand").addClass("recommended").addClass("selected");
            $("[data-tier]").attr("data-tier","pro")
            $("#pro .more-info").css("height",$("#pro .more-info").data("height")+"px");

            if ($("body").hasClass("squashed")) {
              // $(".more-info").css("height","0");
            }
            $("#drops").get(0).scrollIntoView();
          } else if (duration == "casual"){
            $("#plus").addClass("expand").addClass("recommended").addClass("selected");
            $("[data-tier]").attr("data-tier","plus")
            $("#plus .more-info").css("height",$("#plus .more-info").data("height")+"px");
            if ($("body").hasClass("squashed")) {
              // $(".more-info").css("height","0");
            }
            $("#drops").get(0).scrollIntoView();
            
          }
        },300);
    } else if (page == 6){
      $("#learningPlan").hide();
      $("#areYouSure").show();
      $("[data-tier]").attr("data-tier","plus")
    }
    this.backPressed = false;
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
        $("body").on("click",".selectors li", function(){
          if ($(this).parent().parent().attr("id") == "learn"){
            $(this).toggleClass("selected");
            $(this).hasClass("selected") ? subscriptionFlow.selections.push($.trim($(this).text().toLowerCase()).replace(/ /g, "_")) : subscriptionFlow.selections.pop($.trim($(this).text().toLowerCase()).replace(/ /g, "_"))
            $("[data-learn]").attr("data-learn",subscriptionFlow.selections.join(","));
            if ($(this).parent().find(".selected").length) {
              // swiper.allowSlideNext = true;
              $(".bottom").addClass("show");
            } else {
              // swiper.allowSlideNext = false;
              $(".bottom").removeClass("show");
            }
          } else {
            if (!subscriptionFlow.earnSelected){
              $(this).parent().find(".selected").removeClass("selected").removeClass("animate");
              $(this).addClass("selected").addClass("animate");
              $("[data-earn]").attr("data-earn", $(this).find("span:nth-of-type(1)").text().toLowerCase());
              subscriptionFlow.earnSelected = true;
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
          console.log("this:",this, subscriptionFlow.earnSelected, pageInt
          );
          if (!subscriptionFlow.earnSelected && pageInt == 2 || pageInt != 2){
            $(this).addClass("animate");
          }
          
          setTimeout(function() {
            $("body").attr("data-page", pageInt);
            subscriptionFlow.onPageChange(pageInt);
          }, 800);
        });

        $("body").on("click", "#inputEmail .checkbox", function() {
          $(this).toggleClass("ticked");
          $("[data-checked]").attr("data-checked", $(this).hasClass("ticked"))
        });

        $("body").on("click","#learningPlan .plan", function(){
          console.log($(this));
          var currentMoreInfo = $(this).find(".more-info");
          $("#learningPlan .plan").removeClass("selected");
          if (!$("body").hasClass("squashed")){
            $("#learningPlan .plan").removeClass("expand")
          }
          $(this).addClass("expand").addClass("selected");
          $("[data-tier]").attr("data-tier",$(this).attr("id"))
          if ($("body").hasClass("squashed")) {
            $("#learningPlan .more-info").css("height","0");
          }
          currentMoreInfo.css("height",currentMoreInfo.data("height")+"px");
        });

        $("body").on("click", "#openStripe", function(){
          var email = $("#emailAddress").val().trim();
          var tier = $("[data-tier]").attr("data-tier");
          if (tier == "plus") {
            window.open("https://buy.stripe.com/4gwcNwdv9djD9MY004?prefilled_email=" + email, "_self");
          } else if (tier == "plus") {
            window.open("https://buy.stripe.com/9AQ00K2Qv5Rb0coeUZ?prefilled_email=" + email, "_self");
          } else if (tier == "drops") {
            window.open("https://buy.stripe.com/3cs4h02Qv3J32kwaEK?prefilled_email=" + email, "_self");
          }
        });

        $("body").on("click", "#submit", function(){
          console.log($("#emailAddress").val());
          $("body").attr("data-page", 4);
          subscriptionFlow.onPageChange(4);
        });

        $("body").on("click", "#back", function(){
          var currPage = $("[data-page]").attr("data-page");
          var prevPage = currPage -= 1;
          subscriptionFlow.backPressed = true;

          if (prevPage < 0) {
            window.open("/get-started-subscription/", "_self");
          } else {
            subscriptionFlow.onPageChange(prevPage);
            $("body").attr("data-page", prevPage);
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
  swiperInitialised: false,
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
    if (!shouldAnimate && $("[data-page]").attr("data-page") == 2){
      $("[data-page]").attr("data-page", 3)
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
  if ($(window).width() < $(window).height()) {
    $("body").addClass("squashed");
  } else {
    $("body").removeClass("squashed");
  }
  if ($(window).width() < 700) {
    $("body").addClass("mobile").removeClass("desktop");
  } else {
    $("body").removeClass("mobile").addClass("desktop");
  }
}




document.addEventListener('visibilitychange', swiperPB.handleVisibilityChange, false);
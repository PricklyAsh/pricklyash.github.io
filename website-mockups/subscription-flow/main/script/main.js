var swiper = new Swiper(".swiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
      el: ".swiper-pagination",
    },
});

$(".top").addClass("show");

$('#learn ul.selectors li').each(function(i, el) {
  setTimeout(function() {
     $(el).addClass('visible');
  }, i * 100);
});

function checkAnimation(page){
  if (page == 1) {
    updateProgress(20);
    $('#earn ul.selectors li').each(function(i, el) {
      setTimeout(function() {
         $(el).addClass('visible');
      }, i * 100);
    });
  }
}

function updateProgress(value) {
  $("#progressBar .bar").css("width", value + "%");
}

$("body").on("click",".selectors li", function(){
  $(this).toggleClass("selected");
  if ($(this).parent().find(".selected").length) {
    $(".bottom").addClass("show");
  } else {
    $(".bottom").removeClass("show");
  }
})
$("body").on("click", "[data-goto]", function(){
  $(this).addClass("animate");
  setTimeout(function(){
    swiper.slideTo(1);
    checkAnimation(1);
  }, 800);
})

mobileChecker();
function mobileChecker(){
  $("body").removeClass("mobile").addClass("desktop");
  if ($(window).width() < 700) {
      $("body").addClass("mobile").removeClass("desktop");
  }
}
addEventListener("resize", mobileChecker);

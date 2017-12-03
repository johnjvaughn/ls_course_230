$(function() {
  $("nav a").on("mouseenter", function() {
    $(this).next("ul").addClass('opened');
  });

  $("nav").on("mouseleave", function() {
    $(this).find("ul ul").removeClass('opened')
  });

  $(".button, button").on("click", function(e) {
    e.preventDefault();
    $(this).addClass("clicked");
  });

  $(".toggle").on("click", function(e) {
    e.preventDefault();
    $(this).next(".accordion").toggleClass("opened");
  });

  function ccNumberLuhnValid(cc_number) {
    var cc_number = cc_number.split("").reverse(),
        total = 0,
        len = cc_number.length,
        this_num;

    if (len < 15 || len > 16) return false;
    for (var i = 0; i < len; i++) {
      if (i % 2 == 1) {
        this_num = +cc_number[i] * 2;
        total += (this_num >= 10) ? this_num - 9 : this_num;
      } else {
        total += +cc_number[i];
      }
    }

    return (total % 10 === 0);
  }

  $("form").on("submit", function(e) {
    e.preventDefault();
    var cc_valid = ccNumberLuhnValid($(this).find("[type=text]").val());

    $(this).find(".success").toggle(cc_valid);
    $(this).find(".error").toggle(!cc_valid);
  });

  var MONTH_BIRTHSTONES = {
    "January": "garnet",
    "February": "amethyst",
    "March": "aquamarine or bloodstone",
    "April": "diamond",
    "May": "emerald",
    "June": "pearl, moonstone, or alexandrite",
    "July": "ruby",
    "August": "peridot",
    "September": "sapphire",
    "October": "opal or tourmaline",
    "November": "topaz or citrine",
    "December": "turquoise, zircon, or tanzanite",
  }

  $("ul a").on("click", function(e) {
    e.preventDefault();
    var month = $(this).text();

    $("#birthstone").text("Your birthstone is " + MONTH_BIRTHSTONES[month]);
  });
});

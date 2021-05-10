function debounce(fn,delay) {
  let timer = null;

  return function() {
    let context = this;
    let args = arguments;

    clearTimeout(timer); // restart timer

    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  }
}

/* Lazy Loading for Blanqi (custom) 
=========================================*/
$(document).ready(function() {
  
  $(window).on('resize scroll', function() {
    //backgrounds
    $('*[data-background-url]').each(function() {     
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();
      if(elementBottom > viewportTop && elementTop < viewportBottom) {
        //console.log('LLB attrs: '+JSON.stringify($(this).attr()));
        if($(this).data('background-url')) {
          $(this).css('background-image','url('+$(this).data('background-url')+')').removeAttr('data-background-url');
        }
      }
    });
    //images
    $('img[data-lazy-src]').each(function() {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();
      if(elementBottom > viewportTop && elementTop < viewportBottom) {
        $(this).attr('src',$(this).data('lazy-src')).removeAttr('data-lazy-src');
      }
      //fallback for flickity if in init viewport
      var width = $('#Categories .flickity-viewport').width();
      var height = (width * 0.3333);
      $('#Categories .flickity-viewport').height(height);
      //fallback for flickity if in init viewport
      if(
        $(this).closest('.flickity-enabled').length
        &&
        !$(this).closest('.flickity-enabled').first().attr('lazy-resized')
      ){
        console.log('LLB Flickity enabled, do resize');
        $(this).closest('.flickity-enabled').first().attr('lazy-resized','true').resize();
      }
    });    
  });
});

/* EOF Lazy Loading for Blanqi (custom) 
=========================================*/


$(document).ready(function() {
  $('header.header *:contains("™"), header.header *:contains("™"), .main-content *:contains("™"), header.header *:contains("&trade;"), header.header *:contains("&trade;"), .main-content *:contains("&trade;"),  header.header *:contains("®"), header.header *:contains("®"), .main-content *:contains("®"), header.header *:contains("&reg;"), header.header *:contains("&reg;"), .main-content *:contains("&reg;")').each(function(elem){
    $(this).addClass('has-trade');
    if ( $(this).children().length == 0 ) {
      var html = $(this).html();
      var newHtml = html.replace('&trade;','<sup>&trade;</sup>').replace('™','<sup>&trade;</sup>').replace('&reg;','<sup>&trade;</sup>').replace('®','<sup>&reg;</sup>');
      console.log(html + ' => '+ newHtml);
      $(this).html(newHtml);
    }
  });
  //fix search bar opening
  $(".icon-mag").on("click", function(e) {
    console.log('fix search? 1');
    $(".js-search-bar").addClass("open");
  });
});

$(document).ready(function () {
  
  var $body = $("#Body");
  var $header = $("#Header");
  
  var breakpoint_sm_max = 575; // this should match $breakpoint-sm-max in style.scss.liquid 
  var window_width = $(window).width();
  var is_scrolled = false;
  var prev_scroll = 0;
  var scroll_top = 0;

  // reduce header on scroll
  var header_on_scroll = function () {
    scroll_top = $(window).scrollTop();
    
    if (!is_scrolled || scroll_top === 0) {
      is_scrolled = true;
      if (scroll_top > 0) {
        $('body').addClass('header-shrink');
      } 
      else {
        $('body').removeClass('header-shrink');
        is_scrolled = false;
      }
    }
    prev_scroll = scroll_top;
  };
  window.addEventListener('scroll', header_on_scroll);
  
  // add padding to page on resize
  var header_on_resize = function () {
    $body.css("marginTop", ($header.outerHeight() - 1) + "px");
    window_width = $(window).width();
  };
  header_on_resize();  
  window.addEventListener('resize',debounce(header_on_resize, 100));

  if ($body.hasClass("index") || $body.hasClass('page-gift-guide-2018-landing-page')) {
    console.log('sllides: '+$('HomepageSlideshow .gallery-cell').length);
    if($('#HomepageSlideshowMobile .gallery-cell').length > 1) {
      var flkty_home = new Flickity('#HomepageSlideshowMobile', {
        wrapAround: true,
        cellAlign: 'center',
        autoPlay: 6000,
        pageDots: true,
        arrowShape: { 
          x0: 15,
          x1: 60, y1: 50,
          x2: 65, y2: 45,
          x3: 25
        },
        watchCSS: true
      });
    }
    if($('#HomepageSlideshowDesktop .gallery-cell').length > 1) {
      var flkty_home = new Flickity('#HomepageSlideshowDesktop', {
        wrapAround: true,
        cellAlign: 'center',
        autoPlay: 6000,
        pageDots: true,
        arrowShape: { 
          x0: 15,
          x1: 60, y1: 50,
          x2: 65, y2: 45,
          x3: 25
        },
        watchCSS: true
      });
    }

    var flkty_category = new Flickity('#Categories', {
      wrapAround: true,
      cellAlign: 'left',
      arrowShape: { 
        x0: 15,
        x1: 60, y1: 50,
        x2: 65, y2: 45,
        x3: 25
      }
    });
  }

  function jqUpdateSize(){
    var width = $(window).width();

    if (width > 768) {
      $('.mobile-menu_enabled').removeClass('mobile-menu_enabled');
      $('.menu.show').removeClass('show');
    }
  };

  $(document).ready(jqUpdateSize);
  $(window).resize(jqUpdateSize); 
  
  $(".m-burger").on("click", function(e) {
    console.log('m-burger -------------------------------------------------- ');
    $(".menu").toggleClass("d-none");
    $(".menu").toggleClass("show");
    $("#Body").toggleClass("mobile-menu_enabled");
  });

  $(".filter .title").on("click", function(e) {
    $(this).parent().toggleClass("open");
  });
  
  $(".js-icon-mag").on("click", function(e) {
    $(this).parent().children(".js-search-bar").addClass("open");
  });

  $(".js-close-search").on("click", function(e) {
    $(this).parents(".js-search-bar").removeClass("open");
  });

  if ($("#BlanqiMusings").length) {
    $.get(
      "https://blog.blanqi.com/tag/shop/feed/",
      function(data) { 
        if (data) {
          var feed_count = 0;
          var dummydom = document.createElement("div");
          $(data).find("item").each(function () {
            if (feed_count < 3) {
              var has_shop_cat = false;
              $(this).find("category").each(function() {
                if ($(this).text() == "shop") {
                  has_shop_cat = true;
                }
              });
              if (has_shop_cat) {
                var title = $(this).find("title").text();
                var link = $(this).find("link").text();
                dummydom.innerHTML = $(this).find("description").text();
                var excerpt = $(dummydom).find(".excerpt").get(0).childNodes[0].nodeValue;
                var date = new Date($(this).find("pubDate").text());
                date = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getYear().toString().substring(1);
                var img = $(dummydom).find("img").get(0).getAttribute("src");
                console.log(title, link, excerpt, date);
                
                $("#BlanqiMusings").append('<div class="col-12 col-md-4 musings-col px-md-075rem"><div class="img-cont mb-3"><img class="musings-img" src="'+img+'"></div><p class="serif serif-big mb-075rem px-sm-4 title"><a href="'+link+'" target="_blank">'+title+'</a></p><p class="rss-date mb-3">'+date+'</p><p class="excerpt d-none d-md-block">'+excerpt+'</p></div>');
                
                feed_count++;
              }
            }
          });
        }
      }
    );
  }


// $("#BlanqiMinorImages").flickity({
//   wrapAround: true,
//   pageDots: false,
//   initialIndex: 1,
//   accessibility: true, //true by default
//   autoPlay: false // advance cells every 3 seconds
// });



  if ($body.hasClass("product"))
  { 
    var flkty_product = new Flickity('#DisplayImage', {
      pageDots: true,
    });

    $(".image-select").on("click", function() {
      $(this).parent().siblings().removeClass("active");
      $(this).parent().addClass("active");
      var id = $(this).data("id"); 
      var index = $("#DisplayImage-"+id).index();
      flkty_product.select(index);
    });
    
    // ------------------------------------------------
    // REPLACE QUANTITY NUMBER INPUT WITH DROPDOWN
    // ------
    $("#quantity-options").on('change', function (e) {
      var optionSelected = $("option:selected", this);
      var valueSelected = this.value;
      $("#quantity").val(valueSelected);
    });
    
    // ------------------------------------------------ 
    // REPLACE SWATCH BUTTONS WITH DROPDOWN
    // ------
    /* 
    	hides swatches from product-swatch.liquid that aren't 
        color options (ie, sizes) then finds the corresponding 
        dropdown select (created by option_selection.js in 
        app.js.liquid) and makes it visible
    */
    $(".select").each(function() {
      var item = $(this);
      item.next().after(item);
    });
    function build_selector()
    {
      var index = $(".swatch.is_not_color").index();
      var found = 0;
      $(".selector-wrapper").eq(index).each(function(){
        found++;
        $(this).addClass("blanqi-show-me");
        $(this).find('select').addClass("product-size-custom");
      }); 
      if (found == 0) {
        setTimeout(build_selector,500);
      }
    }
    build_selector();
    
    // ------------------------------------------------ 
    // UPDATE "SELECTED COLOR" ON SWATCH CLICK
    // ------
    $(".swatch-element.color > label").on("click touchstart", function(e)
    {
      var color = $(this).parent().data("value");
      $(".blanqi-selected-color span").text(color);
    });
    

    
    
	// ------------------------------------------------ 
    // MAIL ICON REDIRECT
    // ------
    $(".icon-mail").on("click",function(e){
      location.href = "https://customercare.blanqi.com/";
      e.preventDefault();
      return false;
    });
    
    // ------------------------------------------------
    // DISPLAY PRODUCT IMAGES BY SELECTED VARIANT COLOR
    // ------
    function show_only_color_images(color)
    {
      var imgcont = document.getElementById('BlanqiMinorImages');
      color = color.replace(/\s+/g, '-').toLowerCase();
      var first_color = false;
      for (var i = 0; i < imgcont.children.length; i++)
      {
        if (imgcont.children[i].dataset.color == color) {
          imgcont.children[i].className = "d-block";
          if (!first_color) {
            imgcont.children[i].className += " active";
          	first_color = true;
            imgcont.children[i].children[0].click();
          }
        } else {
          imgcont.children[i].className = "d-none";
        }
      }
    }
    $(".swatch-element.color > label").each(function()
	{
      $(this).on("click touchstart",function(e)
	  {
        show_only_color_images($(this).parent().get(0).dataset.value);
      });
    });

    var first_shown_variant = $("#MetaSelectedVariant").data("variantcolor");

	if (first_shown_variant === "giftcard")
    {
      show_only_color_images("giftcard");
    }
    else
    { 
      $("." + first_shown_variant + "-swatch > label").trigger("click");
    }
  }
  
  

    // ------------------------------------------------ 
    //  Select maternity image if m= is present in query string
    // ------    
      function getUrlParameter(name) {
          name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
          var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
          var results = regex.exec(location.search);
          return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
      };

  
    // ------------------------------------------------ 
    //  Show 50% off Black Friday Bug if querystring has bf=1
    // ------    
		var blackfirdaybug = getUrlParameter('bf');  
  
  		if (blackfirdaybug == "1"){
          $('#blackfridaybug').fadeIn();
        }
  
  
  
  $(document).on("click", ".js-faq", function() {
    var id = $(this).data("target");
    var $unit = $(id).parent();
    
    if($(this).hasClass("active")) {
      $(this).removeClass("active");
      $unit.siblings().show();
      $unit.show();
    }
    else {
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
      var id = $(this).data("target");
      var $unit = $(id).parent();
      $unit.siblings().hide();
      $unit.show();
    }
  });
  
  $(document).on("click", ".js-email-reason", function() {
    $(".js-email-reason").removeClass("active");
    $(this).addClass("active");
    
    var $input = $('.js-reason-input input[value="'+$(this).data('value')+'"]');
    $input.click();
    trigger_manual_event($input.get(0));
  });
  
  $(document).on("click", ".js-nursing-checkbox", function() {
    $(".js-nursing-checkbox").removeClass("active");
    $(this).addClass("active");
	
    var $input = $('.js-nursing-input input[value="'+$(this).data('value')+'"]');
    $input.click();
    trigger_manual_event($input.get(0));
  });
  
  var modal_capture = null;
  
  var email_capture_id = "email-capture";
  var email_capture_found = "email-capture-found";
  
  $("#mc-embedded-subscribe-form-2").on("submit", function (e) {
    window.localStorage.setItem(email_capture_found, "true");
    modal_capture.close();
  });
  
  function open_email_capture (now) {
    window.localStorage.setItem(email_capture_id, now);
    modal_capture = $('[data-remodal-id="modal-email-capture"]').remodal();
    modal_capture.open();
  }
  
  var email_capture_time = window.localStorage.getItem(email_capture_id);
  var email_capture_caught = window.localStorage.getItem(email_capture_found);
  var now = Date.now();
  if (email_capture_caught === null) {
    if (window.localStorage.getItem(email_capture_id) !== null) {
      window.localStorage.setItem(email_capture_id, now);
      if (now - email_capture_time > 86400000 /*24 hours*/) {
        open_email_capture(now);
      }
    }
    else {
      open_email_capture(now);
    }
  }
  
  // alert local storage
  var alert_popup = "privacy-alert-123";
  if (window.localStorage.getItem(alert_popup) == null) {
    $body.addClass("alert-privacy");
  }
  
  $(".alert-privacy-policy .close").on("click",function(e) {
    $("body").removeClass("alert-privacy");
    window.localStorage.setItem(alert_popup, 1);
  });
});



// BLACK FRIDAY SLIDER FORM SUBMIT CODE
$('#mc-embedded-subscribe-form').on('submit', function(e) {
    e.preventDefault();
      var email_val = $('.input-slider').val().trim();
      if(email_val.length > 0) {
        
        var current_form = $(this);
        $.ajax({
          type: "GET",
          url: current_form.attr('action'),
          data: current_form.serialize(),
          cache: false,
          dataType: 'jsonp',
          contentType: "application/json; charset=utf=8",
          error: function(err) { console.log('errrrrr') },
          success: function(data) {
            if(data.result != "success") {

            } else {

            }
            carryOn(current_form);
          }  
        });
      }
}); 

function carryOn(form) {
  window.location.replace('/collections/black-friday-sale');
}

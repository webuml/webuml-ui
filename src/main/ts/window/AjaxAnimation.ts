export=AjaxAnimation;

class AjaxAnimation {

  "use strict";

  public static registerGlobalAjaxEventsForAnimation() {
    $(document).ajaxStart(function () {
      $(".ajax-loading-animation").show('fast');
    });
    $(document).ajaxComplete(function () {
      $(".ajax-loading-animation").hide('slow');
    });
  }
}

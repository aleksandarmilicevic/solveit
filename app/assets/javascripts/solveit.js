Red.subscribe(function() {
  return function (data) {
    var p = data.payload;
    if (data.type === "status_message" && p.kind === "event_completed") {
      if (p.event.name === "Register") {
        var msg = "User '" + p.event.params.name + "' created"; 
        Red.publish_status(msg);
      }
    }
  };
}());

$(function() {
    $(document).on("click", ".block", function(e) {
        var $elem = $(this);
        $elem.parent().find(".block").removeClass("block-selected");
        $elem.addClass("block-selected");
    });
    
    $(document).on("dblclick", ".block", function(e) {
        var $elem = $(this);
        $elem.prop("contenteditable", "true");
        $elem.keypress(function(e) {
            if(e.which == 13) {
                $elem.blur();
            }
        });
        $elem.focus();
        $elem.select();
        $elem.on("blur", function() {$elem.prop("contenteditable", "false");});
    });     
    
    $("#create_block").on("eventFinished", function(event, response){
        var blocksContainer = $("#project-blocks");
        var title = $('<div/>').text(response.ans.title).html();
        var sec = "<a class=\"block red-autosave\" href=\"#\" " +
                      "style=\"display:none\"" +
                      "data-record-id=\"" + response.ans.id + "\" " + 
                      "data-record-cls=\"Block\" " + 
                      "data-field-name=\"title\">" + title + "</a>";
        var child = $.parseHTML(sec);
        blocksContainer.append(child);
        $(child).fadeIn(); 
    });
});



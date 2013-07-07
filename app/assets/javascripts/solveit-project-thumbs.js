$(function() {
  /* ------------------------------------------------------------
   * Creates and inserts a new block upon the "CreateProjectBlock"
   * event completion.
   * ------------------------------------------------------------ */
  $(document).on("CreateProjectBlockDone", "button#create_block", function(ev, resp){
    var $container = getProjectBlocksDOM();
    SolveIT.renderAndAppendTo($container, function() {
      return Red.Utils.remoteRenderRecord(new Block(resp.ans.id), {
        partial: "blocks/block_thumb",
        as: "block"
      });
    }, function() {
      var $child = $container.children().last();
      $child.find(".block-title").first().click();
    });
  });

  $(document).on("DeleteRecordDone", ".delete_block", function(event, response){
    var selectedBlock = $($(this).attr("data-block-div"));
    if (selectedBlock.size() == 0) return;
    selectedBlock.fadeOut(SolveIT.fadeDuration, "swing", function() {
      selectedBlock.detach();
    });
  });

  var isThumbMode = function() {
    return !getProjectBlocksDOM().hasClass("side_bar");
  };

  var switchToEditMode = function($selectedBlock) {
    getProjectBlocksDOM().addClass("side_bar", SolveIT.fadeDuration, function(){
      $selectedBlock.click();
    });    
  };

  $(document).on("dblclick", ".block-preview-outer", function(e) {
    var $elem = $(this);
    if (isThumbMode()) {
      switchToEditMode($elem);
    } else {
    }
  });
}); 
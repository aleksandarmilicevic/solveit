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

var getBlockContainer  = function() { return $("#project-blocks"); };
var getSelectedBlocks  = function() { return getBlockContainer().find(".block-selected"); };
var getSelectedBlockRecords = function() {
    return getSelectedBlocks().map(function(idx, b) {return new Block($(b));});
}    
    
$(function() {
    /* ==========================================================
     * Project blocks (sections)
     *
     *  - on click                  : select single block
     *  - on dblClick               : edit block title 
     *  - on createProjectBlockDone : create and insert new block 
     * ========================================================== */
    
    var blockSelectedCls  = "block-selected"; 
    var selectBlock       = function(blck) { blck.addClass(blockSelectedCls); }
    var unselectBlock     = function(blck) { blck.removeClass(blockSelectedCls); }
    var isBlockSelected   = function(blck) { return blck.hasClass(blockSelectedCls); }
    var toggleSelection   = function(blck) { if (isBlockSelected(blck)) unselectBlock(blck); else selectBlock(blck); }
    
    /* ------------------------------------------------------------
     * Handles the "click" event for all ".block" events. 
     * 
     *  - removes the "block-selected" css class from all other 
     *    blocks in the parent project;
     *  - adds the same class to the clicked block. 
     * ------------------------------------------------------------ */
    $(document).on("click", ".block", function(e) {
        var $elem = $(this);
        if (e.ctrlKey) {
            toggleSelection($elem);
        } else {
            unselectBlock($elem.parent().find(".block"));
            selectBlock($elem);
        }
    });
    
    /* ------------------------------------------------------------
     * Handles the "dblclick" event for all ".block" events. 
     * 
     *  - makes the block "contenteditable";
     *  - assigns a "keypress" handler that makes it not 
     *    "contenteditable" when the return key is pressed;    
     *  - makes the block focuesed;
     *  - assigns a "blur" handler which makes the block not
     *    contenteditable.
     * ------------------------------------------------------------ */
    $(document).on("dblclick", ".block", function(e) {
        var $elem = $(this);
        $elem.prop("contenteditable", "true");
        $elem.keypress(function(e) { if(e.which == 13) { $elem.blur(); } });
        $elem.focus();
        $elem.selectText();
        $elem.on("blur", function() {$elem.prop("contenteditable", "false");});
    });     
    
    var fadeDuration = 500;
    
    /* ------------------------------------------------------------
     * Creates and inserts a new block upon the "CreateProjectBlock"
     * event completion. 
     * 
     *  - 
     * ------------------------------------------------------------ */
    $("#create_block").on("CreateProjectBlockDone", function(event, response){
        var blocksContainer = getBlockContainer();
        // hack to escapeHTML(title)
        var title = $('<div/>').text(response.ans.title).html();
        // TODO: this should be returned by the server by rendering the appropriate template
        var sec = "<a class=\"block red-autosave\" href=\"#\" " +
                      "style=\"opacity: 0\"" +
                      "data-record-id=\"" + response.ans.id + "\" " + 
                      "data-record-cls=\"Block\" " + 
                      "data-field-name=\"title\">" + title + "</a>";
        var child = $.parseHTML(sec);
        blocksContainer.append(child);
        $(child).animate({
            opacity: 1.0,            
        }, fadeDuration, function() {
            $(child).click();
            $(child).dblclick();
        });
    });
    
    $("#delete_block").on("DeleteRecordsDone", function(event, response){
        var selectedBlocks = getSelectedBlocks();
        if (selectedBlocks.size() == 0) return;
        selectedBlocks.animate({
            opacity: 0.0,            
        }, fadeDuration, function() {
            selectedBlocks.detach();
        });
        
    });
});



$(function() {
  /* ==========================================================
   * Project blocks (sections)
   *
   *  - on click                  : select single block
   *  - on dblClick               : edit block title
   *  - on createProjectBlockDone : create and insert new block
   * ========================================================== */

  var refreshDeleteBtn  = function()     {
    if (getSelectedBlocks().size()>0) $("#delete_block").removeAttr('disabled');
    else                              $("#delete_block").attr('disabled', 'disabled');
  };

  var asyncUpdate = Red.Utils.asyncUpdate;
  var readParam = Red.Utils.readParamValue;
  var readData = function(el, par) { return readParam(el, "data-" + par); } ;

  var refreshCurrentSection = function() {
    var blocks = getSelectedBlockRecords();
    if (blocks.size() > 1) return;
    if (blocks.size() == 0) {
      getBlockContentDOM().html("<div id=\"no_block_selected\">Please select a section on the left...</div>");
    } else {
      asyncUpdate(getBlockContentDOM(), "block", {
        action: function() {
          return Red.Utils.remoteRenderRecord(blocks[0], {
            partial: "blocks/block",
            as: "block"
          });
        },
        done: function(html, cont) {
          getBlockContentDOM().html(html);
          cont.cancel = true;
          getBlockContentDOM().fadeIn(SolveIT.fadeDuration, "swing", cont); 
        },
        fail: function() {
          getBlockContentDOM().html("Failed to load block content");
        }
      });
    }
  };


  var sectionChanged = function() {
    refreshDeleteBtn();
    refreshCurrentSection();
  };


  /* ------------------------------------------------------------
   * Handles the "click" event for all ".block" events.
   *
   *  - removes the "block-selected" css class from all other
   *    blocks in the parent project;
   *  - adds the same class to the clicked block.
   * ------------------------------------------------------------ */
  $(document).on("click", ".side_bar .block", function(e) {
    var oldSelection = getSelectedBlocks();
    var $elem = $(this);
    if (e.ctrlKey) {
      toggleSelection($elem);
    } else {
      unselectBlock($elem.parent().find(".block"));
      selectBlock($elem);
    }
    var newSelection = getSelectedBlocks();
    if (!(newSelection.size() == oldSelection.size() == 1 &&
         newSelection[0] == oldSelection[0])) {
      sectionChanged();
    }
  });

  /* ------------------------------------------------------------
   * Handles the "dblclick" event for all "a.block" nodes.
   *
   *  - makes the block "contenteditable";
   *  - assigns a "keypress" handler that makes it not
   *    "contenteditable" when the return key is pressed;
   *  - makes the block focuesed;
   *  - assigns a "blur" handler which makes the block not
   *    contenteditable.
   * ------------------------------------------------------------ */
  $(document).on("dblclick", ".side_bar a.block", function(e) {
    var $elem = $(this);
    $elem.prop("contenteditable", "true");
    $elem.keypress(function(e) { if(e.which == 13) { $elem.blur(); } });
    $elem.focus();
    $elem.selectText();
    $elem.on("blur", function() {$elem.prop("contenteditable", "false");});
  });


  /* ------------------------------------------------------------
   * Creates and inserts a new block upon the "CreateProjectBlock"
   * event completion.
   * ------------------------------------------------------------ */
  $("a#create_block").on("CreateProjectBlockDone", function(event, resp){
    var $container = getProjectBlocksDOM();
    SolveIT.renderAndAppendTo($container, function() {
      return Red.Utils.remoteRenderRecord(new Block(resp.ans.id), {
        partial: "projects/block",
        as: "block"
      });
    }).done(function(){
      var $child = $container.children().last();
      $child.click();
      $child.dblclick();
    });
  });

  $("a#delete_block").on("DeleteRecordsDone", function(event, response){
    // TODO: read the response to see which sections got deleted, as oppose to deleting the current selection.
    var selectedBlocks = getSelectedBlocks();
    if (selectedBlocks.size() == 0) return;
    selectedBlocks.animate({
      opacity: 0.0
    }, SolveIT.fadeDuration, function() {
      selectedBlocks.detach();
      sectionChanged();
    });
  });

}); 
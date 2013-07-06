
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
};
    
$(function() {
  /* ==========================================================
   * Project blocks (sections)
   *
   *  - on click                  : select single block
   *  - on dblClick               : edit block title 
   *  - on createProjectBlockDone : create and insert new block 
   * ========================================================== */
  
  var blockSelectedCls  = "block-selected"; 
  var selectBlock       = function(blck) { blck.addClass(blockSelectedCls); };
  var unselectBlock     = function(blck) { blck.removeClass(blockSelectedCls); };
  var isBlockSelected   = function(blck) { return blck.hasClass(blockSelectedCls); };
  var toggleSelection   = function(blck) { if (isBlockSelected(blck)) unselectBlock(blck); else selectBlock(blck); };

  var getBlockContentDOM = function() { return $("#block_content"); };
  var getBlockItemsDOM = function() { return $("#block_items"); };
  
  var refreshDeleteBtn  = function()     { 
    if (getSelectedBlocks().size()>0) $("#delete_block").removeAttr('disabled'); 
    else                              $("#delete_block").attr('disabled', 'disabled'); 
  };
  
  var replaceWithInvisibleHtml = function($elem, html) {
    $elem.before(html);
    var repl = $elem.prev();
    repl.hide();
    $elem.detach();
    return repl;
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
        fail:   function() { 
          getBlockContentDOM().html("Failed to load block content"); 
        }
      });
    }
  };

  var renderAndInsertNewItem = function(itemCls, itemId) {
    var item = Red.Meta.createRecord(itemCls, itemId);
    
    var newItemDiv = $('<div></div>');
    getBlockItemsDOM().append(newItemDiv);
    asyncUpdate(newItemDiv, "block", {
      action: function() { return Red.Utils.remoteRenderRecord(item, {
        partial: "items/item",
        as: "item"
      }); }, 
      done:   function(html) {
        var newItem = replaceWithInvisibleHtml(newItemDiv, html);
        newItem.fadeIn(fadeDuration);
      },
      fail:   function(response) { 
        newItemDiv.html("Failed to load item content"); 
      }
    });        
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
  $(document).on("click", ".block", function(e) {
    var $elem = $(this);
    if (e.ctrlKey) {
      toggleSelection($elem);
    } else {
      unselectBlock($elem.parent().find(".block"));
      selectBlock($elem);
    }
    sectionChanged();
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
   * ------------------------------------------------------------ */
  $("#create_block").on("CreateProjectBlockDone", function(event, response){
    var blocksContainer = getBlockContainer();
    // hack to escapeHTML(title)
    var title = $('<div/>').text(response.ans.title).html();
    // TODO: this should be returned by the server by rendering the appropriate template
    var sec = "<a class=\"block red-autotrigger\" href=\"#\"" +
          " style=\"opacity: 0\"" +
          " data-record-id=\"" + response.ans.id + "\"" + 
          " data-event-name=\"LinkToRecord\"" + 
          " data-param-target=\"${new Block(" + response.ans.id + ")}\"" +
          " data-param-saveTarget=\"true\"" +
          " data-param-fieldName=\"title\"" +
          " data-field-name=\"fieldValue\">" + title + "</a>";
    var child = $.parseHTML(sec);
    blocksContainer.append(child);
    $(child).animate({
      opacity: 1.0
    }, fadeDuration, function() {
      $(child).click();
      $(child).dblclick();
    });
  });
  
  $("#delete_block").on("DeleteRecordsDone", function(event, response){
    // TODO: read the response to see which sections got deleted, as oppose to deleting the current selection.
    var selectedBlocks = getSelectedBlocks();
    if (selectedBlocks.size() == 0) return;
    selectedBlocks.animate({
      opacity: 0.0
    }, fadeDuration, function() {
      selectedBlocks.detach();
      sectionChanged();
    });
  });
  
  var newItemSel = "#block_content_toolbar>.toolbar-btn[data-trigger-event]";
  $(document).on("CreateRecordAndLinkDone", newItemSel, function(event, response){
    renderAndInsertNewItem($(this).attr('data-param-className'), response.ans.id);    
  });

  Red.Events.subscribe_event_completed("CreateItemFromFile", function(data, ans) {
    var newItem = ans;
    renderAndInsertNewItem(newItem.__type__, newItem.id);
  });
  
  var delItemSel = "#block_items [data-trigger-event='DeleteRecord']";
  $(document).on("DeleteRecordTriggered", delItemSel, function(e, redEvent){
    var containerId = $(this).attr('data-container-id');
    var container = $("#" + containerId);
    var titleElem = container.find(".item_title");
    titleElem.html("Deleting...");

    redEvent.cancel();
    asyncUpdate(container, "item", {
      action: function() { return redEvent.fire(); }, 
      done:   function(r) {
        titleElem.html("Success!");
        container.fadeOut(fadeDuration, function() {container.detach();});
      }, 
      fail :  function(r) {
        titleElem.html("Failed to delete item!");
      }
    });
    return false;
  });
  
  var figureImgSel = "#block_items .upload_figure";
  $(document).on("UploadFigureTriggered", figureImgSel, function(e, redEvent){
    var $elem = $(this);
    var container = $(readData($elem, "img-container"));
    var loadingDiv = $(readData($elem, "loading-div"));
    if (container.size() != 1) throw new Error("containers");
    if (loadingDiv.size() != 1) throw new Error("loading div");

    redEvent.cancel();
    loadingDiv.show();
    asyncUpdate(container, "fig-img", {
      actions: [
        function() { return redEvent.fire(); }, 
        function() { 
          var fig = readData($elem, "param-figure");
          return Red.Utils.remoteRenderRecord(fig, {
            partial: "items/fig-image",
            as: "item"
          });
        }
      ],
      done:   function(html) {
        console.debug("Successfully uploaded and reloaded image");
        var topElem = container;
        // var repl = replaceWithInvisibleHtml(topElem, html);
        // repl.fadeIn(fadeDuration);
        container.hide();
        container.html(html);
        container.fadeIn(fadeDuration);
      }, 
      fail :  function(r) {
        console.debug("Failed to upload and reload image");
      },
      always : function(r) {
        loadingDiv.hide();
      }
    });
    return false;
  });
  
  
  /* ==========================================================
   * show/hide
   * ========================================================== */

  $(document).on("click", "[data-toggle-show]", function(e) {
    Red.Utils.toggleShow($(this), {duration: fadeDuration});
  });

  $(document).on("click", ".show_desc", function(e) {
    var $elem = $(this);
    if ($elem.hasClass("showing")) {
      $elem.removeClass("showing");
      $elem.addClass("hiding");
    } else {
      $elem.removeClass("hiding");
      $elem.addClass("showing");
    }
  });  
  
  var commentActionSel = ".post_comment_text";
  $(document).on("CreateAndAddCommentDone", commentActionSel, function(e, response){
    var $elem = $(this);
    
    var commentId = response.ans.id;
    var comment = new Comment(commentId);
    
    var newDiv = $('<div></div>');
    var commentItems = $elem.parent().prev();
    commentItems.append(newDiv);
    asyncUpdate(newDiv, "comment", {
      action: function() {
        return Red.Utils.remoteRenderRecord(comment, {
          partial: "comments/comment",
          as: "comment"
        }); 
      }, 
      done:   function(html) {
        var newItem = replaceWithInvisibleHtml(newDiv, html);
        newItem.fadeIn(fadeDuration);
        $elem.val("");
      },
      fail:   function(response) { 
        newDiv.html("Failed to load comment"); 
      }
    });        
    return false;
  });
  
});

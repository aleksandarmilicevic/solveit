
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

//TODO: move it to SolveIT
var blockSelectedCls  = "block-selected";
var getProjectBlocksDOM = function() { return $("#project_blocks"); };
var getBlockContentDOM        = function() { return $("#block_content"); };
var getBlockItemsDOM          = function() { return $("#block_items"); };

var getSelectedBlocks         = function() { 
  return getProjectBlocksDOM().find("." + blockSelectedCls); 
};
var getSelectedBlockRecords = function() {
    return getSelectedBlocks().map(function(idx, b) {return new Block($(b));});
};

var selectBlock       = function(blck) { blck.addClass(blockSelectedCls); };
var unselectBlock     = function(blck) { blck.removeClass(blockSelectedCls); };
var isBlockSelected   = function(blck) { return blck.hasClass(blockSelectedCls); };
var toggleSelection   = function(blck) { 
  if (isBlockSelected(blck)) unselectBlock(blck); else selectBlock(blck); 
};

var SolveIT = {

  fadeDuration: 500,

  /* ==========================================================
   * zoom in/out
   * ========================================================== */

  zoomStep: 0.05,
  zoomTo: function(sel, zoomLevel) { $(sel).css("zoom", zoomLevel); },
  zoomBy: function(sel, by) {
    var $elem = $(sel);
    var currZoom = Number($elem.css("zoom"));
    SolveIT.zoomTo($elem, currZoom + by);
  },
  zoomIn: function(sel,by){SolveIT.zoomBy(sel, by||SolveIT.zoomStep); return false;},
  zoomOut: function(sel,by){SolveIT.zoomBy(sel, -by||-SolveIT.zoomStep); return false; },

  replaceWithInvisibleHtml: function($elem, html) {
    if (typeof(html) === "string") {
      $elem.before(html);
      var repl = $elem.prev();
      repl.hide();
      $elem.detach();
      return repl;
    } 
    if (html instanceof jQuery) {
      $elem.before(html);
      $elem.detach();
      return html;
    }
    throw "invalid 'html' argument";
  },

  renderAndAppendTo: function($container, renderer, cls, onDoneCont){
    cls = Red.Utils.defaultTo(cls, "");
    if (typeof(cls) === "function" && typeof(onDoneCont) === "undefined") {
      onDoneCont = cls;
      cls = "";
    }
    var newItemDiv = $('<div style="display:none"></div>');
    $container.append(newItemDiv);
    return renderer().
      done(function(html) {
        var newItem = SolveIT.replaceWithInvisibleHtml(newItemDiv, html);
        newItem.fadeIn(SolveIT.fadeDuration, onDoneCont);
      })
      .fail(function(response) {
        newItemDiv.html("Failed to load item content");
      });
  },

  renderAndInsertNewItem: function(itemCls, itemId, $container) {
    var item = Red.Meta.createRecord(itemCls, itemId);
    SolveIT.renderAndAppendTo($container, function() {
      return Red.Utils.remoteRenderRecord(item, {
        partial: "items/item",
        as: "item"
      });
    });
  }

};


/* ==========================================================
 * bindings
 * ========================================================== */

$(function() {

  var asyncUpdate = Red.Utils.asyncUpdate;
  var readParam = Red.Utils.readParamValue;
  var readData = function(el, par) { return readParam(el, "data-" + par); } ;

  var getBlockContentDOM = function() { return $("#block_content"); };
  var getBlockItemsDOM = function() { return $("#block_items"); };

  var newItemSel = "#block_content_toolbar>.toolbar-btn[data-trigger-event]";
  $(document).on("CreateRecordAndLinkDone", newItemSel, function(event, response){
    var cls = $(this).attr('data-param-className');
    SolveIT.renderAndInsertNewItem(cls, response.ans.id, getBlockItemsDOM());
  });

  Red.Events.subscribe_event_completed("CreateItemFromFile", function(data, ans) {
    var newItem = ans;
    SolveIT.renderAndInsertNewItem(newItem.__type__, newItem.id, getBlockItemsDOM());
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
        container.fadeOut(SolveIT.fadeDuration, function() {container.detach();});
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
        container.hide();
        // container.html(html);
        container.empty();
        container.append(html);
        container.fadeIn(SolveIT.fadeDuration);
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
    Red.Utils.toggleShow($(this), {duration: SolveIT.fadeDuration});
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

  // var commentActionSel = ".post_comment_text";
  // $(document).on("CreateAndAddCommentDone", commentActionSel, function(e, response){
  //   var $elem = $(this);

  //   var commentId = response.ans.id;
  //   var comment = new Comment(commentId);

  //   var newDiv = $('<div></div>');
  //   var commentItems = $elem.parent().prev();
  //   commentItems.append(newDiv);
  //   asyncUpdate(newDiv, "comment", {
  //     action: function() {
  //       return Red.Utils.remoteRenderRecord(comment, {
  //         partial: "comments/comment",
  //         as: "comment"
  //       });
  //     },
  //     done:   function(html) {
  //       var newItem = SolveIT.replaceWithInvisibleHtml(newDiv, html);
  //       newItem.fadeIn(SolveIT.fadeDuration);
  //       $elem.val("");
  //     },
  //     fail:   function(response) {
  //       newDiv.html("Failed to load comment");
  //     }
  //   });
  //   return false;
  // });

});

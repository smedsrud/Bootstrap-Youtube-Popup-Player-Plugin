/*!
 * Bootstrap Qbrick Popup Player Plugin
 * http://lab.abhinayrathore.com/bootstrap-youtube/
 * https://github.com/abhinayrathore/Bootstrap-Youtube-Popup-Player-Plugin
 */
(function ($) {
  var $QbrickModal = null,
    $QbrickModalDialog = null,
    $QbrickModalTitle = null,
    $QbrickModalBody = null,
    margin = 5;

  //Plugin methods
  var methods = {
    //initialize plugin
    init: function (options) {
      options = $.extend({}, $.fn.QbrickModal.defaults, options);

      // initialize Qbrick Player Modal
      if ($QbrickModal == null) {
        $QbrickModal = $('<div class="modal fade ' + options.cssClass + '" id="QbrickModal" role="dialog" aria-hidden="true">');
        var modalContent = '<div class="modal-dialog" id="QbrickModalDialog">' +
                              '<div class="modal-content" id="QbrickModalContent">' +
                                '<div class="modal-header">' +
                                  '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                                  '<h4 class="modal-title" id="QbrickModalTitle"></h4>' +
                                '</div>' +
                                '<div class="modal-body" id="QbrickModalBody" style="padding:0;"></div>' +
                              '</div>' +
                            '</div>';
        $QbrickModal.html(modalContent).hide().appendTo('body');
        $QbrickModalDialog = $("#QbrickModalDialog");
        $QbrickModalTitle = $("#QbrickModalTitle");
        $QbrickModalBody = $("#QbrickModalBody");
        $QbrickModal.modal({
          show: false
        }).on('hide.bs.modal', resetModalBody);
      }

      return this.each(function () {
        var obj = $(this);
        var data = obj.data('Qbrick');
        if (!data) { //check if event is already assigned
          obj.data('Qbrick', {
            target: obj
          });
          $(obj).bind('click.QbrickModal', function () {
            var qbrickId = options.qbrickId;
            if ($.trim(qbrickId) == '' && obj.is("a")) {
              qbrickId = getQbrickIdFromUrl(obj.attr("href"));
            }
            if ($.trim(qbrickId) == '' || qbrickId === false) {
              qbrickId = obj.attr(options.idAttribute);
            }
            var videoTitle = $.trim(options.title);
            if (videoTitle == '') {
              if (options.useQbrickTitle) setQbrickTitle(qbrickId);
              else videoTitle = obj.attr('title');
            }
            if (videoTitle) {
              setModalTitle(videoTitle);
            }

            resizeModal(options.width);

            //Setup Qbrick Modal
            var QbrickURL = getQbrickUrl(qbrickId, options);
            var QbrickPlayerIframe = getQbrickPlayer(QbrickURL, options.width, options.height);
            setModalBody(QbrickPlayerIframe);
            $QbrickModal.modal('show');

            return false;
          });
        }
      });
    },
    destroy: function () {
      return this.each(function () {
        $(this).unbind(".QbrickModal").removeData('Qbrick');
      });
    }
  };

  function setModalTitle(title) {
    $QbrickModalTitle.html($.trim(title));
  }

  function setModalBody(content) {
    $QbrickModalBody.html(content);
  }

  function resetModalBody() {
    setModalTitle('');
    setModalBody('');
  }

  function resizeModal(w) {
    $QbrickModalDialog.css({
      width: w + (margin * 2)
    });
  }

  function getQbrickUrl(qbrickId, options) {
    return ["//publisher.qbrick.com/Embed.aspx?mcid=", qbrickId, "?width=", options.width,
      "&height=", options.height
    ].join('');
  }

  function getQbrickPlayer(URL, width, height) {
  	
  	return ['<iframe id="iframe_player" src="', URL, '&width=640&height=360" width="', width, '" height="', height, '" frameborder="0" scrolling="no">You need a browser that can handle Iframes to be able to view this page.</iframe>
  			].join('');
  }
    return ['<iframe title="Qbrick video player" width="', width, '" height="', height, '" ',
      'style="margin:0; padding:0; box-sizing:border-box; border:0; -webkit-border-radius:5px; -moz-border-radius:5px; border-radius:5px; margin:', (margin - 1), 'px;" ',
      'src="', URL, '" frameborder="0" allowfullscreen seamless></iframe>'
    ].join('');
  }

  function setQbrickTitle(qbrickId) {
    var url = ["https://publisher.qbrick.com/Embed.aspx?mcid=", qbrickId].join('');
    $.ajax({
      url: url,
      dataType: 'jsonp',
      cache: true,
      success: function (data) {
        setModalTitle(data.entry.title.$t);
      }
    });
  }

  function getQbrickIdFromUrl(youtubeUrl) {
    var regExp = /^.*(publisher.qbrick.com\/Embed.aspx\?mcid=)([^#\&\?]*).*/;
    var match = youtubeUrl.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return false;
    }
  }

  $.fn.QbrickModal = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on Bootstrap.QbrickModal');
    }
  };

  //default configuration
  $.fn.QbrickModal.defaults = {
    qbrickId: '',
    title: '',
    useQbrickTitle: true,
    idAttribute: 'rel',
    cssClass: 'QbrickModal',
    width: 640,
    height: 480,
    autohide: 2,
    autoplay: 1,
    color: 'red',
    controls: 1,
    fs: 1,
    loop: 0,
    showinfo: 0,
    theme: 'light'
  };
})(jQuery);

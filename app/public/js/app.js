"use strict";

var state = null;

var view = {
  init: function() {
    this.volTimeout = null;

    // Set initial "loading" screen
    this.hide(lang.loading);

    this.setStaticStr();
    this.addListeners();
  },

  render: function() {
    this.renderPlaying();
    this.renderTitle();
    this.renderProgress();
    this.renderProgressBar();
    this.renderVolButtons();
    this.setView();
  },

  renderPlaying: function() {
    if (state.playing) {
      $("#playing").text(lang.playing);
      $("#span-ps")
        .addClass("glyphicon-stop")
        .removeClass("glyphicon-play");
      $("#btn-ps")
        .addClass("btn-danger")
        .removeClass("btn-default");
    } else {
      $("#playing").text(lang.notPlaying);
      $("#span-ps")
        .addClass("glyphicon-play")
        .removeClass("glyphicon-stop");
      $("#btn-ps")
        .addClass("btn-default")
        .removeClass("btn-danger");
    }
  },

  renderTitle: function() {
    $("#title").text(state.title);
    $("#artist").text(state.artist);
    if (state.local) {
      $("#title").addClass("text-uppercase");
    } else {
      $("#title").removeClass("text-uppercase");
    }
  },

  renderProgress: function() {
    if (state.local && state.playing) {
      $("#elapsed").text(this.toMinSec(state.elapsed));
      $("#length").text(this.toMinSec(state.length));
      $("#progress").show();
    } else {
      $("#progress").hide();
    }
  },

  renderProgressBar: function() {
    if (state.local && state.playing) {
      var progress = state.elapsed / state.length;
      $("#progress-bar").css("width", progress * 100 + "%");
    } else {
      $("#progress-bar").css("width", "0%");
    }
  },

  renderVolButtons: function() {
    // Only show buttons if volume is available
    if (state.vol < 0) {
      $("#btn-vdown, #btn-vup").attr("disabled", true);
    } else {
      $("#btn-vdown, #btn-vup").attr("disabled", false);
    }
  },

  setView() {
    if (state.con_mpd && this.hidden) {
      this.unhide(state.playing);
    } else if (!state.con_mpd) {
      this.hide(lang.disconnectedMpd);
    }
  },

  setStaticStr: function() {
    $("#lbl-random").text(lang.sBtnRandom);
    $("#lbl-radios").text(lang.sBtnRadios);
    $("#lbl-player").text(lang.sBtnPlayer);
    $("#radios-welcome").text(lang.sRadiosWelcome);
    $("#insert").text(lang.sInsert);
  },

  showPlayer: function() {
    $(".view").hide();
    $("#player").show();
  },

  showRadios: function() {
    $(".view").hide();
    $("#radios").show();
  },

  showAlert: function(text, textMore) {
    if (textMore === undefined) {
      textMore = "";
    }

    $("#alert-text-main").text(text);
    $("#alert-text-more").text(textMore);

    $(".view").hide();
    $("#alert").show();
  },

  hide: function(text) {
    this.showAlert(text);
    this.hidden = true;
  },

  unhide: function(playing) {
    if (playing) {
      view.showPlayer();
    } else {
      view.showRadios();
    }
    this.hidden = false;
  },

  osdVol: function(vol) {
    $("#osd-text").text(vol);
    $("#player-bottom").hide();
    $("#osd").show();

    clearTimeout(this.volTimeout);
    this.volTimeout = setTimeout(function() {
      $("#osd").hide();
      $("#player-bottom").show();
    }, timeConst.volOsd);
  },

  addListeners: function() {
    // Prevent href="#" to be executed
    $('a[href="#"]').click(function(event) {
      return false;
    });

    $("#btn-vup").click(function(event) {
      controller.clickVol("+5");
    });

    $("#btn-vdown").click(function(event) {
      controller.clickVol("-5");
    });

    $("#btn-ps").click(function(event) {
      controller.clickPs();
    });

    $("#btn-random").click(function(event) {
      controller.clickRandom();
    });

    $("#btn-radios").click(function(event) {
      view.showRadios();
    });

    $("#btn-player").click(function(event) {
      view.showPlayer();
    });

    $(".radio-name").click(function(event) {
      var name = $(this).text();
      controller.clickRadio(name);
    });

    $("#insert").click(function(event) {
      var url = prompt(lang.urlInsert);
      controller.clickInsert(url);
    });
  },

  toMinSec: function(sec) {
    return new Date(sec * 1000).toISOString().substr(14, 5);
  }
};

var controller = {
  PLAYER_API: "/api/player",

  init: function() {
    view.init();
    this.updateState(true);
  },

  updateState: function(repeat) {
    var self = controller;
    var fetchState = $.get(self.PLAYER_API)
      .done(function(response) {
        state = response;
        view.render();
      })
      .fail(function() {
        view.hide(lang.disconnectedNet);
      });

    if (repeat) {
      fetchState.always(function() {
        setTimeout(controller.updateState, timeConst.update, true);
      });
    }
  },

  clickRandom: function() {
    var text;
    var waitTime;

    // Define which alert to show based on player state
    if (state.playing && state.local) {
      text = lang.randomNext;
      waitTime = timeConst.randomNext;
    } else {
      text = lang.randomFirst;
      waitTime = timeConst.randomFirst;
    }
    view.showAlert(text);

    $.post(this.PLAYER_API, { cmd: "play_random" }).always(function() {
      setTimeout(view.showPlayer, waitTime);
    });
  },

  clickVol: function(delta) {
    $.post(this.PLAYER_API, { cmd: "change_vol", delta: delta }).done(function(
      response
    ) {
      view.osdVol(response);
    });
  },

  clickPs: function() {
    var cmd = state.playing ? "stop" : "play";
    $.post(this.PLAYER_API, { cmd: cmd }).done(function() {
      controller.updateState(false);
    });
  },

  clickRadio: function(name) {
    if (name === state.title && !state.local && state.playing) {
      view.showPlayer();
    } else {
      this.playStream(true, name);
    }
  },

  clickInsert: function(url) {
    if (url !== null && url !== "") {
      this.playStream(false, url.trim());
    }
  },

  playStream: function(isName, value) {
    view.showAlert(lang.streamTrying, value);

    if (isName) {
      var data = { cmd: "play_radios", names: [value] };
    } else {
      var data = { cmd: "play_urls", urls: [value] };
    }

    $.post(this.PLAYER_API, data)
      .done(function() {
        setTimeout(view.showPlayer, timeConst.playStream);
      })
      .fail(function() {
        view.showAlert(lang.streamError, value);
        setTimeout(view.showRadios, timeConst.error);
      });
  }
};

var timeConst = {
  playStream: 2000,
  error: 3000,
  randomNext: 1500,
  randomFirst: 5000,
  volOsd: 1300,
  update: 1000
};

$(document).ready(function() {
  controller.init();
});

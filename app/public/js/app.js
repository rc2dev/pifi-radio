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

	render: function(state) {
		if (state.playing) {
			$("#playing").html(lang.playing);
			$("#span-ps").attr("class", "glyphicon glyphicon-stop");
			$("#btn-ps").attr("class", "btn btn-danger btn-lg");
		} else {
			$("#playing").html(lang.notPlaying);
			$("#span-ps").attr("class", "glyphicon glyphicon-play");
			$("#btn-ps").attr("class", "btn btn-default btn-lg");
		}

		$("#title").html(state.title);
		$("#artist").html(state.artist);
		if (state.local) {
			$("#title").attr("class", "text-uppercase");
		} else {
			$("#title").attr("class", "");
		}

		// Playing local music: Update additional info
		if (state.local && state.playing) {
			$("#elapsed").html(this.toMinSec(state.elapsed));
			$("#length").html(this.toMinSec(state.length));
			$("#progress").show();
		} else {
			$("#progress").hide();
		}

		// Local music: Update progress bar
		if (state.local && state.playing) {
			var progress = state.elapsed / state.length
			$("#progress-bar").css("width", progress * 100 + "%");
		} else {
			$("#progress-bar").css("width", "0%");
		}

		// Only show buttons if volume is available
		if (state.vol < 0) {
			$("#btn-vdown").attr("disabled", true);
			$("#btn-vup").attr("disabled", true);
		} else {
			$("#btn-vdown").attr("disabled", false);
			$("#btn-vup").attr("disabled", false);
		}
	},

	setStaticStr: function() {
		$("#btn-random").append(lang.sBtnRandom);
		$("#btn-radios").append(lang.sBtnRadios);
		$("#btn-player").append(lang.sBtnPlayer);
		$("#radios-welcome").text(lang.sRadiosWelcome);
		$("#insert h4").text(lang.sInsert);
	},

	showPlayer: function() {
		$("#alert").hide();
		$("#radios").hide();
		$("#player").show();
	},

	showRadios: function() {
		$("#alert").hide();
		$("#player").hide();
		$("#radios").show();
	},

	hide: function(text) {
		this.osdAlert(text);
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

	osdAlert: function(text) {
		$("#alert-text").text(text);
		$("#player").hide();
		$("#radios").hide();
		$("#alert").show();
	},

	osdVol: function(vol) {
		$("#osd-text").html(vol);
		$("#player-bottom").hide();
		$("#osd").show();

		clearTimeout(this.volTimeout);
		this.volTimeout = setTimeout(function() {
			$("#osd").hide();
			$("#player-bottom").show();
		}, timeConst.volOsd);
	},

	addListeners: function() {
		// "Unclick" buttons after clicked
		$("button").click(function(event) {
			$(this).blur();
		});

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

		$("#btn-ps").click(function( event ) {
			controller.clickPs();
		});

		$("#btn-random").click(function( event ) {
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
	init: function() {
		view.init();

		// Initial update. Don't rely on setInterval, because it can delay
		this.updatingState();

		// Get API data and update player periodically
		setInterval(function() {
			controller.updatingState();
		}, timeConst.update);
	},

	// Async
	updatingState: function() {
		$.get("/api", function(response) {
			state = response;
			view.render(state);

			// Hide data if backend is disconnected from MPD
			if (state.con_mpd) {
				if (view.hidden) {
					view.unhide(state.playing);
				}
			} else {
				view.hide(lang.disconnectedMpd);
			}
		})
			.fail(function() {
				view.hide(lang.disconnectedNet);
			});
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
		view.osdAlert(text);

		$.post("/api", { cmd: "play_random" })
			.always(function(data) {
				setTimeout(function() {
					view.showPlayer();
				}, waitTime);
			});
	},

	clickVol: function(inc) {
		$.post( "/api", { cmd: "vol_ch", inc: inc }, function(response) {
			view.osdVol(response);
		});
	},

	clickPs: function() {
		var cmd = state.playing ? "stop" : "play";
		$.post( "/api", { cmd: cmd }, function(response) {
			controller.updatingState();
		});
	},

	clickRadio: function(name) {
		if (name === state.song && ! state.local && state.playing) {
			view.showPlayer();
		} else {
			this.playStream("name", name);
		}
	},

	clickInsert: function(url) {
		if (url !== null && url !== "") {
			this.playStream("url", url);
		}
	},

	playStream: function(type, value) {
		view.osdAlert(lang.streamTrying);

		$.post("/api", { cmd: "play_stream", type: type, value: value },
			function() {
				setTimeout(function() {
					view.showPlayer();
				}, timeConst.playStream);
			})
			.fail(function() {
				view.showRadios();
				alert(lang.streamError);
			});
	}
};

var timeConst = {
	playStream: 2000,
	randomNext: 1500,
	randomFirst: 5000,
	volOsd: 1300,
	update: 1000,
};


$(document).ready(function() {
	controller.init();
});

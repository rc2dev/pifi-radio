"use strict";

var app = function(){

	var hidden = true;
	var timeout = null;
	var state = null;
	var time = {
		playStream: 2000,
		randomNext: 1500,
		randomFirst: 5000,
		volOsd: 1300,
		update: 1000,
	}

	// Async, returns promise
	function $updateState() {
		return $.get("/api", function(data) {
			state = data;
			updateViews();

			// Hide data if backend is disconnected from MPD
			if (state.con_mpd) {
				if (hidden) {
					unhide();
				}
			} else {
				hide(lang.disconnectedMpd);
			}
		})
			.fail(function() {
				hide(lang.disconnectedNet);
			});
	};

	function updateViews() {
			if (state.playing) {
				$("#status").html(lang.playing);
				$("#span-ps").attr('class', 'glyphicon glyphicon-stop');
				$("#btn-ps").attr('class', 'btn btn-danger btn-lg');
			} else {
				$("#status").html(lang.notPlaying);
				$("#span-ps").attr('class', 'glyphicon glyphicon-play');
				$("#btn-ps").attr('class', 'btn btn-default btn-lg');
			}
			$("#song").html(state.song);

			// Update additional info if playing local music
			if (state.local && state.playing) {
				$("#elapsed").html(toMinSec(state.elapsed));
				$("#length").html(toMinSec(state.length));
				$("#progress").show();
			} else {
				$("#progress").hide();
			}
	}

	function setStartView() {
		if (state.playing) {
			showPlayer();
		} else {
			showRadios();
		}
	}

	function setStaticStr() {
		$("#btn-random").append(lang.sBtnRandom);
		$("#btn-radios").append(lang.sBtnRadios);
		$("#btn-player").append(lang.sBtnPlayer);
		$("#title strong").text(lang.sTitle);
		$("#insert h4").text(lang.sInsert);
	}


	function clickRandom() {
		var text;
		var waitTime;

		// Define which alert to show based on player state
		if (state.playing && state.local) {
			text = lang.randomNext;
			waitTime = time.randomNext;
		} else {
			text = lang.randomFirst;
			waitTime = time.randomFirst;
		}
		osdAlert(text);

		$.post("/api", { cmd: "play_random" })
			.always(function(data) {
				setTimeout(function() {
					showPlayer();
				}, waitTime);
			});
	}

	function clickVol(inc) {
		$.post( "/api", { cmd: "vol_ch", inc: inc }, function(data) {
			osdVol(data);
		});
	}

	function clickPs() {
		var cmd = state.playing ? "stop" : "play";
		$.post( "/api", { cmd: cmd }, function(data) {
			$updateState();
		});
	}

	function clickRadio(name) {
		if (name == state.song && ! state.local && state.playing) {
			showPlayer();
		} else {
			playStream("name", name);
		}
	}

	function clickInsert(url) {
		if (url != null) {
			playStream("url", url);
		}
	}

	function playStream(type, value) {
		osdAlert(lang.streamTrying);

		$.post("/api", { cmd: "play_stream", type: type, value: value })
		.done(function() {
			setTimeout(function() {
				showPlayer();
			}, time.playStream);
		})
		.fail(function() {
			showRadios();
			alert(lang.streamError);
		});
	}

	function showPlayer() {
		$("#alert").hide();
		$("#radios").hide();
		$("#player").show();
	}

	function showRadios() {
		$("#alert").hide();
		$("#player").hide();
		$("#radios").show();
	}

	function hide(text) {
		osdAlert(text);
		hidden = true;
	}

	function unhide() {
		setStartView();
		hidden = false;
	}

	function osdAlert(text) {
		$("#alert-text").text(text);
		$("#player").hide();
		$("#radios").hide();
		$("#alert").show();
	}

	function osdVol(vol) {
		$("#osd-text").html(vol);
		$("#player-bottom").hide();
		$("#osd").show();

		clearTimeout(timeout);
		timeout = setTimeout(function() {
			$("#osd").hide();
			$("#player-bottom").show();
		}, time.volOsd);
	}

	function toMinSec(sec) {
		return new Date(sec * 1000).toISOString().substr(14, 5);
	}


	return {
		time: time,
		setStaticStr: setStaticStr,
		$updateState: $updateState,
		showPlayer: showPlayer,
		showRadios: showRadios,
		hide: hide,
		clickPs: clickPs,
		clickVol: clickVol,
		clickRandom: clickRandom,
		clickRadio: clickRadio,
		clickInsert: clickInsert
	}
}();

// Document
$(document).ready(function() {

	// Set initial "loading" screen
	app.hide(lang.loading);

	// Set static strings
	app.setStaticStr();

	// Initial update. Don't rely on setInterval, because it can delay
	app.$updateState();

	// Get API data and update player periodically
	setInterval(function() {
		app.$updateState();
	}, app.time.update);

	// "Unclick" buttons after clicked
	$("button").click(function(event) {
		$(this).blur();
	});

	// Prevent href="#" to be executed
	$('a[href="#"]').click(function(event) {
		return false;
	});

	$("#btn-vup").click(function(event) {
		app.clickVol("+5");
	});

	$("#btn-vdown").click(function(event) {
		app.clickVol("-5");
	});

	$("#btn-ps").click(function( event ) {
		app.clickPs();
	});

	$("#btn-random").click(function( event ) {
		app.clickRandom();
	});

	$("#btn-radios").click(function(event) {
		app.showRadios();
	});

	$("#btn-player").click(function(event) {
		app.showPlayer();
	});

	$(".radio-name").click(function(event) {
		var name = $(this).text();
		app.clickRadio(name);
	});

	$("#insert").click(function(event) {
		var url = prompt(lang.urlInsert);
		app.clickInsert(url);
	});
});

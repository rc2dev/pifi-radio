"use strict";

var app = function(){

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

			// Update info on screen
			if (state.playing) {
				$("#status").html(lang.playing);
				$("#span-ps").attr('class', 'glyphicon glyphicon-stop');
			} else {
				$("#status").html(lang.notPlaying);
				$("#span-ps").attr('class', 'glyphicon glyphicon-play');
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
		});
	};

	function setStaticStr() {
		$("#btn-random").append(lang.sBtnRandom);
		$("#btn-radios").append(lang.sBtnRadios);
		$("#btn-player").append(lang.sBtnPlayer);
		$("#title strong").text(lang.sTitle);
		$("#insert h4").text(lang.sInsert);
	}

	function startView() {
		$updateState().then(function (response) {
			showPlayer();
		});
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
			}, to.playStream);
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
		}, to.volOsd);
	}

	function toMinSec(sec) {
		return new Date(sec * 1000).toISOString().substr(14, 5);
	}


	return {
		startView: startView,
		setStaticStr: setStaticStr,
		$updateState: $updateState,
		showPlayer: showPlayer,
		showRadios: showRadios,
		clickPs: clickPs,
		clickVol: clickVol,
		clickRandom: clickRandom,
		clickRadio: clickRadio,
		clickInsert: clickInsert,
		time: time
	}
}();

// Documento
$(document).ready(function() {
	app.startView();

	// Set static strings
	app.setStaticStr();

	// Update player periodically
	setInterval(function() {
		app.$updateState();
	}, app.to.update);

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

app = function(){

	var timeout = null;
	var state = null;
	var to = {
		play_stream: 2000,
		random_next: 1500,
		random_first: 5000,
		vol_osd: 1300,
		update: 1000,
	}

	// Async, returns promise
	function $update_state() {
		return $.get("/api", function(data) {
			state = data;

			// Update info on screen
			if (state.playing) {
				$("#status").html(lang.playing);
				$("#span-ps").attr('class', 'glyphicon glyphicon-stop');
			} else {
				$("#status").html(lang.not_playing);
				$("#span-ps").attr('class', 'glyphicon glyphicon-play');
			}
			$("#song").html(state.song);

			// Update additional info if playing local music
			if (state.local && state.playing) {
				$("#elapsed").html(to_min_sec(state.elapsed));
				$("#length").html(to_min_sec(state.length));
				$("#progress").show();
			} else {
				$("#progress").hide();
			}
		});
	};

	function set_static_str() {
		$("#btn-random").append(lang.s_btn_random);
		$("#btn-radios").append(lang.s_btn_radios);
		$("#btn-player").append(lang.s_btn_player);
		$("#title strong").text(lang.s_title);
		$("#insert h4").text(lang.s_insert);
	}

	function start_view() {
		$update_state().then(function (response) {
			show_player();
		});
	}

	function click_random() {
		var text;
		var time;

		// Define which alert to show based on player state
		if (state.playing && state.local) {
			text = lang.random_next;
			time = to.random_next;
		} else {
			text = lang.random_first;
			time = to.random_first;
		}
		osd_alert(text);

		$.post("/api", { cmd: "play_random" })
			.always(function(data) {
				setTimeout(function() {
					show_player();
				}, time);
			});
	}

	function click_vol(vol) {
		$.post( "/api", { cmd: "vol_ch", inc: vol }, function(data) {
			osd_vol(data);
		});
	}

	function click_ps() {
		var cmd = state.playing ? "stop" : "play";
		$.post( "/api", { cmd: cmd }, function(data) {
			$update_state();
		});
	}

	function click_radio(name) {
		if (name == state.song && ! state.local && state.playing) {
			show_player();
		} else {
			play_stream("name", name);
		}
	}

	function click_insert(url) {
		if (url != null) {
			play_stream("url", url);
		}
	}

	function play_stream(type, value) {
		osd_alert(lang.stream_trying);

		$.post("/api", { cmd: "play_stream", type: type, value: value })
		.done(function() {
			setTimeout(function() {
				show_player();
			}, to.play_stream);
		})
		.fail(function() {
			show_radios();
			alert(lang.stream_error);
		});
	}

	function show_player() {
		$("#alert").hide();
		$("#radios").hide();
		$("#player").show();
	}

	function show_radios() {
		$("#alert").hide();
		$("#player").hide();
		$("#radios").show();
	}

	function osd_alert(text) {
		$("#alert-text").text(text);
		$("#player").hide();
		$("#radios").hide();
		$("#alert").show();
	}

	function osd_vol(vol) {
		$("#osd-text").html(vol);
		$("#player-bottom").hide();
		$("#osd").show();

		clearTimeout(timeout);
		timeout = setTimeout(function() {
			$("#osd").hide();
			$("#player-bottom").show();
		}, app.to.vol_osd);
	}

	function to_min_sec(sec) {
		return new Date(sec * 1000).toISOString().substr(14, 5);
	}


	return {
		start_view: start_view,
		set_static_str: set_static_str,
		$update_state: $update_state,
		show_player: show_player,
		show_radios: show_radios,
		click_ps: click_ps,
		click_vol: click_vol,
		click_random: click_random,
		click_radio: click_radio,
		click_insert: click_insert,
		to: to
	}
}();

// Documento
$(document).ready(function() {
	app.start_view();

	// Set static strings
	app.set_static_str();

	// Update player periodically
	setInterval(function() {
		app.$update_state();
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
		app.click_vol("+5");
	});

	$("#btn-vdown").click(function(event) {
		app.click_vol("-5");
	});

	$("#btn-ps").click(function( event ) {
		app.click_ps();
	});

	$("#btn-random").click(function( event ) {
		app.click_random();
	});

	$("#btn-radios").click(function(event) {
		app.show_radios();
	});

	$("#btn-player").click(function(event) {
		app.show_player();
	});

	$(".radio-name").click(function(event) {
		var name = $(this).text();
		app.click_radio(name);
	});

	$("#insert").click(function(event) {
		var url = prompt(lang.url_insert);
		app.click_insert(url);
	});
});

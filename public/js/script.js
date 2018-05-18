// Variáveis globais
var timeout;
var state;


// Funções

// É assíncrona, retorna promisse
function $update_state() {
	return $.get("/api", function(data) {
		state = data;

		// Atualiza play-stop, status e nome
		if (state.playing) {
			$("#status").html(lang.playing);
			$("#span-ps").attr('class', 'glyphicon glyphicon-stop');
		} else {
			$("#status").html(lang.not_playing);
			$("#span-ps").attr('class', 'glyphicon glyphicon-play');
		}
		$("#song").html(state.song);

		// Se local e tocando: atualiza duração, tempo e os exibe
		if (state.local && state.playing) {
			$("#elapsed").html(to_min_sec(state.elapsed));
			$("#length").html(to_min_sec(state.length));
			$("#progress").show();
		} else {
			$("#progress").hide();
		}
	});
};

function to_min_sec(sec) {
	return new Date(sec * 1000).toISOString().substr(14, 5);
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

function show_alert(text) {
	$("#alert-text").text(text);
	$("#player").hide();
	$("#radios").hide();
	$("#alert").show();
}

function vol_osd(vol) {
	$("#osd-text").html(vol);
	$("#player-bottom").hide();
	$("#osd").show();

	clearTimeout(timeout);
	timeout = setTimeout(function() {
		$("#osd").hide();
		$("#player-bottom").show();
	}, 1300);
}

// Decide o que mostrar ao iniciar, baseado se
// está tocando.
function start_view() {
	$update_state().then(function (response) {
		show_player();
	});
}

function play_stream(type, value) {
	show_alert(lang.stream_trying);

	$.post("/api", { cmd: "play_stream", type: type, value: value })
	.done(function() {
		setTimeout(function() {
			show_player();
		}, 2000);
	})
	.fail(function() {
		show_radios();
		alert(lang.stream_error);
	});
}

function set_static_str() {
	$("#btn-random").append(lang.s_btn_random);
	$("#btn-radios").append(lang.s_btn_radios);
	$("#btn-player").append(lang.s_btn_player);
	$("#title strong").text(lang.s_title);
	$("#insert h4").text(lang.s_insert);
}

// Documento
$(document).ready(function() {
	start_view();

	// Set static strings
	set_static_str();

	// Atualiza player periodicamente
	setInterval(function() {
		$update_state();
	}, 1000);

	// "Desclica" botões após clicados
	$("button").click(function(event) {
		$(this).blur();
	});

	// Previne href="#" de ser executado
	$('a[href="#"]').click(function(event) {
    return false;
	});

	$("#btn-vup").click(function(event) {
		$.post( "/api", { cmd: "vol_ch", inc: "+5" }, function(data) {
			vol_osd(data);
		});
	});

	$("#btn-vdown").click(function(event) {
		$.post( "/api", { cmd: "vol_ch", inc: "-5" }, function(data) {
			vol_osd(data);
		});
	});

	$("#btn-ps").click(function( event ) {
		var cmd = state.playing ? "stop" : "play";
		$.post( "/api", { cmd: cmd }, function(data) {
			$update_state();
		});
	});

	$("#btn-random").click(function( event ) {
		var text;
		var time;

		// Define which alert to show based on player state
		if (state.playing && state.local) {
			text = lang.random_next;
			time = 1500;
		} else {
			text = lang.random_first;
			time = 5000;
		}
		show_alert(text);

		$.post("/api", { cmd: "play_random" })
			.always(function(data) {
				setTimeout(function() {
					show_player();
				}, time);
			});
	});

	$("#btn-radios").click(function(event) {
		show_radios();
	});

	$("#btn-player").click(function(event) {
		show_player();
	});

	$(".radio-name").click(function(event) {
		var name = $(this).text();
		if (name == state.song && ! state.local && state.playing) {
			show_player();
		} else {
			play_stream("name", name);
		}
	});

	$("#insert").click(function(event) {
		var url = prompt(lang.url_insert);
		if (url != null)
			play_stream("url", url);
		});
});

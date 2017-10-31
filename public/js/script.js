// Constantes (mensagens)
const PLAYING = "Tocando";
const NOT_PLAYING = "Parado";
const STREAM_ERROR = "Não foi possível tocar essa rádio.";
const STREAM_TRYING = "Sintonizando...";
const URL_INSERT = "Insira a URL";
const RANDOM_NEXT = "Próxima música";
const RANDOM_FIRST = "Conectando ao armazenamento...";

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
			$("#status").html(PLAYING);
			$("#span-ps").attr('class', 'glyphicon glyphicon-stop');
		} else {
			$("#status").html(NOT_PLAYING);
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
		if (state.playing) {
			show_player();
		} else {
			show_radios();
		}
	});
}

function play_stream(type, value) {
	show_alert(STREAM_TRYING);

	$.post("/api", { cmd: "play_stream", type: type, value: value })
	.done(function() {
		setTimeout(function() {
			show_player();
		}, 2000);
	})
	.fail(function() {
		show_radios();
		alert(STREAM_ERROR);
	});
}


// Documento
$(document).ready(function() {
	start_view();

	// Se janela perde foco: esconde player
	// Se janela ganha foco: reinicializa
	window_focus = true;
	$(window)
		.focus(function() {
			window_focus = true;
			start_view();
		})
		.blur(function() {
			window_focus = false;
			show_alert(document.title);
		});

	// Atualiza player periodicamente se janela em foco
	setInterval(function() {
		if (window_focus) $update_state();
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
			text = RANDOM_NEXT;
			time = 1500;
		} else {
			text = RANDOM_FIRST;
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
		var url = prompt(URL_INSERT);
		if (url != null)
			play_stream("url", url);
		});
});

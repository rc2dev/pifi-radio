// Constantes e variáveis globais
var URL_ERROR = "Não foi possível tocar essa rádio.";
var PLAYING = "Tocando";
var NOT_PLAYING = "Parado";
var timeout;


// Funções
function update_player() {
    $.get( "/api/state", function( data ) {
        $( "#status" ).html( data.playing ? PLAYING : NOT_PLAYING );
        $( "#name" ).html( data.name );
    }, "json");
};

function show_player() {
    update_player();
    $("#alert").hide();
    $("#radios").hide();
    $("#player").show();
}

function show_radios() {
    $("#silence").hide();   // Estratégico para só aparecer quando pedido.
    $("#alert").hide();
    $("#player").hide();
    $("#radios").show();
}

function show_alert() {
    $("#player").hide();
    $("#radios").hide();
    $("#alert").show();
}

function vol_osd() {
    $.get( "/api/vol", function( data ) {
        $("#player-bottom").hide();
        $("#osd-text").html(data);
        $("#osd").show();
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $("#osd").hide();
            $("#player-bottom").show();
        }, 2500);
    });
}

// Decide o que mostrar ao iniciar, baseado se
// está tocando. Inclui mensagem amigável.
function start_view() {
    $.get( "/api/state", function( data ) {
        if ( data.playing ) {
            $( "#status" ).html( PLAYING );
            $( "#name" ).html( data.name );
            show_player();
        } else {
            show_radios();
            $("#silence").show();
        }
    });
}

function play_url(url) {
    $("#alert-text").html("Sintonizando...");
    show_alert();

    $.get("/api/play-url", {url: url})
        .done(function() {
            setTimeout(function() {
                show_player();
            }, 2000);
        })
        .fail(function() {
            show_radios();
            alert(URL_ERROR);
        });
}


// Documento
$( document ).ready(function() {
    start_view();

    $( "#vup" ).click(function( event ) {
        $.get( "/api/vup", function( data ) { vol_osd(); });
    });

    $( "#vdown" ).click(function( event ) {
        $.get( "/api/vdown", function( data ) { vol_osd(); });
    });

    $( "#play" ).click(function( event ) {
        $.get( "/api/play", function( data ) { update_player(); });
    });

    $( "#stop" ).click(function( event ) {
        $.get( "/api/stop", function( data ) { update_player(); });
    });

    $( "#btn-random" ).click(function( event ) {
        $( "#alert-text" ).html("Aguarde...");
        show_alert();
        $.get( "/api/play-random" )
            .always(function(data) {
            setTimeout(function() {
                show_player();
                }, 2500);
        });
    });
    
    $("#btn-radios").click(function( event ) {
        show_radios();
    });

    $("#btn-player").click(function( event ) {
        show_player();
    });

    $(".radio-name").click(function( event ) {
        url = $(this).attr("url");
        play_url(url);
    });

    $("#insert").click(function( event ) {
        url = prompt("Insira a URL");
        if(url != null)
            play_url(url);
    });
});

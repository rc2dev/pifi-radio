var URL_ERROR="Não foi possível tocar essa rádio."

function update_player() {
    $.get( "/cmd/status", function( data ) {
        $( "#status" ).html( data );
    });
    $.get( "/cmd/name", function( data ) {
        $( "#name" ).html( data );
    });
    $.get( "/cmd/vol", function( data ) {
        $( "#vol" ).html( data );
    });
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

// Decide se mostra rádio ou listas, baseado se
// está tocando. Senão, ainda inclui mensagem amigável.
function start_view() {
    $.get( "/cmd/playing", function( data ) {
        if(data == "true") {
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
    
    $.post("/play-url", {url: url})
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



$( document ).ready(function() {
    
    start_view();
    
    $( "#vup" ).click(function( event ) {
        $.get( "/cmd/vup", function( data ) {
            $.get( "/cmd/vol", function( data ) {
                $( "#vol" ).html( data );
            });
        });
       event.preventDefault();
    });
    
    $( "#vdown" ).click(function( event ) {
        $.get( "/cmd/vdown", function( data ) {
            $.get( "/cmd/vol", function( data ) {
                $( "#vol" ).html( data );
            });
        });
       event.preventDefault();
    });

    // Button: Play (só mandar comando se estiver parado)
    $( "#play" ).click(function( event ) {
        $.get( "/cmd/playing", function( data ) {
            if( data == "false" )
                $.get( "/cmd/play", function( data ) { update_player(); });
        });
       event.preventDefault();
    });
   
    // Button: Stop (só mandar comando se estiver tocando)
    $( "#stop" ).click(function( event ) {
        $.get( "/cmd/playing", function( data ) {
            if( data == "true" )
                $.get( "/cmd/stop", function( data ) { update_player(); });
        });
       event.preventDefault();
    });
    
    // Button: play random
    $( "#btn-random" ).click(function( event ) {
        $.get( "/cmd/first_random", function( data ) {  
            $.get( "/play-random", function( data ) {
                update_player();
            });
            if( data == "true" ) {
                $( "#alert-text" ).html("Contactando o armazenamento...");
            } else {
                $( "#alert-text" ).html("Próxima música...");    
            }
            show_alert();
            setTimeout(function() {
                show_player();
                }, 2500);            
        });
        event.preventDefault();
    });
    
    // Button: Show radios
    $("#btn-radios").click(function( event ) {
        show_radios();
    });
    
    // Button: Show player
    $("#btn-player").click(function( event ) {
        show_player();
    });
    
    // Link: Play from radios list
    $(".radio-name").click(function( event ) {
        url = $(this).attr("url");
        play_url(url);
    });
            
    // Link: Insert URL
    $("#insert").click(function( event ) {
        var url = prompt("Insira a URL");
        if(url != "")
            play_url(url);
    });
});

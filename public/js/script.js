function update() {
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


$( document ).ready(function() {
    
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

    // Play control
    // Só mande comando de play se já não estiver tocando
    $( "#play" ).click(function( event ) {
        $.get( "/cmd/playing", function( data ) {
            if( data == "false" )
                $.get( "/cmd/play", function( data ) { update(); });
        });
       event.preventDefault();
    });
   
    // Stop control
    $( "#stop" ).click(function( event ) {
        $.get( "/cmd/playing", function( data ) {
            if( data == "true" )
                $.get( "/cmd/stop", function( data ) { update(); });
        });
       event.preventDefault();
    });
    
    // Play random
    // Espera se não está tocando
    $( "#btn-random" ).click(function( event ) {
        $.get( "/cmd/first_random", function( data ) {  
            $.get( "/play-random" );
            //div = $( ".player" ).clone();
            // Pede para esperar se estava parado.
            //if( data == "true" ) {
            //    $( "player").hide();
                //$( ".player" ).html('<h3 class="text-center">Aguarde...</h3> \
                  //                  <h3  class="text-center">Conectando-se ao AirPort...</h3>')
                //setTimeout(function() {
                    //$( ".player").replaceWith(div);
                //}, 2500); 
            //    update();
            //} else {
            //    $( ".player" ).html('<h3 class="text-center">Próxima</h3>')
            //    setTimeout(function() {
            //        $( ".player").replaceWith(div);
            //    }, 2000); 
                update();                
            //}
          });
       event.preventDefault();
    });
    
    
    $("#insert").click(function( event ) {
        var url = prompt("Insira a URL");
        if(url != "")
            $.post("/play-url", {url: url})
            .done(function() {
                window.location = "/player";
            })
            .fail(function() {
                alert("Erro abrindo a URL.");
            });
    });
    
});

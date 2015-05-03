
var sendMessage = function(str,yes,no,my_class,callback_yes,callback_no) {
        
    clearMessageTimeout(); // clear the timeout so it doesn't accidentaly slide up
    
    if (typeof no == 'string') {   // check if this is a yes/no message
        
        $message.slideUp(0, function() {  // slide up if not already
            // scroll to the top so the user gets to see the message             
            $("html").animate({'scrollTop': 0}, 'fast', function() {    // then
                $message
                .unbind('mouseout').attr('class','')      // kill old classes
                .addClass(my_class)    // add our class styling
                .html([ str, '<br />', // create an array to add our
                                       // two handlers with #yes and #no IDs
                        '<button id="yes">', yes ,'</button>',
                        '<button id="no">' , no  ,'</button>'
                      ].join('')       // join the array and
                     )                 // insert message
                .slideDown(1000)       // slide the message down
                .find('#yes,#no')      // find #yes and #no
                .click(function() { // add click handler to #yes and #no                            
                    var answer=$(this).attr('id');           // should be 'yes' or 'no'
                    $message.slideUp(1000, function() {      // slide up and
                        $("html").animate({'scrollTop': 0},  // scroll to top again and
                            eval('callback_' + answer)       // call our callback
                        );
                    });
                });     
            });        
        });
            
    } else {                  
                
        $message
            .unbind('mouseout')                // unbind previous mouseout
            .attr('class','')                  // kill old classes
            .addClass(yes)                     // add our class
            .html(str)                         // insert our message
            .slideDown(1000, function() {      // slide down the message
            $message.mouseout(function() {     // bind mouse out
                setMessageTimeout(function() { // with a timeout if the pointer comes back
                    $message.slideUp(1000);    // to slide back up
                }, 1000);                      // after 1 second
            });                           
        });
        
        if (typeof no == 'number') {       // if a timeout is specified
            setMessageTimeout(function() { // then it sets it
                $message.slideUp(1000);    // to slide up by itself
            }, no);                        // after x milliseconds
        }
    }
}
                           
// Initialize messenger

$("<div></div>").prependTo('body').attr('id','message');

var $message = $("#message")
    .mousemove(clearMessageTimeout),
    message_timeout;

function setMessageTimeout(callback, time) {
    clearTimeout(message_timeout);
    message_timeout = setTimeout(callback, time);
}

function clearMessageTimeout() {
    clearTimeout(message_timeout);
}

// Example:
    
$(".invoke_message").click(function(e) {

    sendMessage(
    
        [ 'Here I am, a message..',
          'I can be multiline',
          '<strong>and have any html</strong>',,
          'Do you like me?'
        ].join('<br />'),
    
        'Yeap','Nope',  // yes and no text
    
        'normal',       // normal class
    
        function() {    // yes callback
            sendMessage('Thank you. I\'ll be gone in 3 secs', 'happy', 3000);
        }, 
            
        function() {    // no callback
            sendMessage('OK, have it your way then. You need to mouseout me to make me leave', 'sad');
        }
                
    );

    return false;
});

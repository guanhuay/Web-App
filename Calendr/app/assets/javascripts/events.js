//= require jquery-ui.custom.min
//= require moment.min
//= require fullcalendar.min
//= require jquery-ui.custom2.min
//= require jquery-ui-timepicker-addon






function new_event(start, end) {
	$('#make-event #event_start').val(start);
	$('#make-event #event_end').val(end);
	$('#make-event').modal('show');


	$("#new_event").submit(function(e) {
		e.preventDefault();

		$("#new_event").on("ajax:success", function(e, data, status, xhr) {

			
		}).on("ajax:error", function(xhr, status, error) {
			console.log("Ajax error: " + xhr.responseText);
			console.log("Ajax error: " + error);
		});
	});
}

$(window).on("page:change", function() {

    /*$('#new_event_link').click(function(){
		var display = moment().format('MMMM DD, YYYY @ hh:mm A');
		new_event(display, display);
    });*/

    $('#new_event #event_start, #new_event #event_end').datetimepicker({
		minuteGrid: 10,
		dateFormat: 'MM dd, yy',
		timeFormat: '@ hh:mm tt',
		stepHour: 1,
		stepMinute: 5
	});


	$('#calendar').fullCalendar({
		header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
		},
		eventLimit: true,
		handleWindowResize: true,

		selectable: true,
		selectHelper: true,
		select: function(start, end) {

			var startDisplay = start.hasTime() ? start.format('MMMM DD, YYYY @ hh:mm A')
											   : start.format('MMMM DD, YYYY');

			var endDisplay = end.hasTime() ? end.format('MMMM DD, YYYY @ hh:mm A')
										   : end.format('MMMM DD, YYYY');

			new_event(startDisplay, endDisplay);
		},

	    eventClick: function(calEvent, jsEvent, view) {

	    	$.ajax({url: rootPath + '/events/' + calEvent.id, 
				error: function(xhr, status, error) {
					console.log(xhr.status);
					console.log(error);
					console.log(status);
				}
			});
	    },

	    editable: true,
	    eventDrop: function(event, delta, revertFunc) {

	    	$.ajax({url: rootPath + '/events/' + event.id,
    			method: 'PUT',
    			datatype: 'script',
    			data: {
    				'event[title]': event.title,
				    'event[start]': event.start.format(),
			 	    'event[end]': event.end.format()
				},
    			error: function(xhr, status, error) {
    				revertFunc();
    			}
    		});
	    },
	    events: rootPath + '/events.json'
	});	
});

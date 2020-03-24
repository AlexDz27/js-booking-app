////////////////////////////////////////////
// App code

function BookingApp(element) {
	this.element = element;
	this.dateInput = this.element.querySelector('#dateInput');

	var initDateInput = function() {
		var today = new Date().toISOString().substr(0, 10);
		this.dateInput.value = today;
		this.dateInput.min = today;
	}.bind(this);

	var init = function() {
		initDateInput();
	};
	init();
}

var bookingAppElement = document.getElementById('bookingApp');
var BookingApp = new BookingApp(bookingAppElement);

console.log(BookingApp);
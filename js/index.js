////////////////////////////////////////////
// App code

function BookingApp(element) {
	this.element = element;
	this.dateInput = this.element.querySelector('#dateInput');

	var setTodaysDate = function() {
		window.today = new Date().toISOString().substr(0, 10);
		this.dateInput.value = window.today;
		this.dateInput.min = window.today;
	}.bind(this);

	var handleSubmit = function (event) {
		event.preventDefault();

		var formData = new FormData(this.element.querySelector('form'));
		var booking = {
			date: null,
			time: null,
			name: null,
			phone: null
		};
		var iterationIndex = 0;
		for (var input of formData.entries()) {
			switch (iterationIndex) {
				case 0:
					booking.date = input[1];
					break;
				case 1:
					booking.time = input[1];
				case 2:
					booking.name = input[1];
				case 3:
					booking.phone = input[1];		
			}

			iterationIndex++;
		}

		// Send bookings data to Firebase
		window.ajax.request({
			url: 'https://booking-app-demo-6ac98.firebaseio.com/bookings.json',
			method: 'POST',
			requestData: JSON.stringify(booking),
			onLoad: function () {
				alert('Спасибо, Ваша бронь успешно отправлена');
			},
			onError: function () {
				alert('Ошибка при отправлении. Попробуйте позже');
			}
		});
	}.bind(this);
	this.element.addEventListener('submit', handleSubmit);

	setTodaysDate();
}

var bookingAppElement = document.getElementById('bookingApp');
var BookingApp = new BookingApp(bookingAppElement);
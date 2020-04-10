// Bookings screen functionality
var appScreen = document.getElementById('bookingApp');
var bookingsScreenBtn = document.getElementById('bookingsScreenBtn');
var bookingsScreen = document.getElementById('bookingsScreen');
bookingsScreenBtn.addEventListener('click', toggleScreen);

function toggleScreen () {
	appScreen.classList.toggle('booking-app--inactive');
	bookingsScreen.classList.toggle('bookings-screen--active');

	window.ajax.request({
		url: 'https://booking-app-demo-6ac98.firebaseio.com/bookings.json',
		method: 'GET',
		onLoad: function (response) {
			var fbBookings = JSON.parse(this.response);
			renderBookings(fbBookings);
		},
		onError: function () {
			console.error('Error requesting data from server. Try again later');
		}
	});	
}

function renderBookings (fbBookings) {
	var bookingDays = filterFbBookings(fbBookings);
	console.log('bookingDays', bookingDays);

	var html = '';
	bookingDays.forEach(function (day) {
		if (day.isTodaysDay) {
			html += '<div class="booking-day booking-day--today">';
			html += '<h2>' + day.beautifiedDate + ' (сегодня)</h2>';
		} else {
			html += '<div class="booking-day">';
			html += '<h2>' + day.beautifiedDate + '</h2>';
		}
		
		html += '<div class="bookings">';
		day.bookings.forEach(function (booking) {
			html += '<section class="booking">';

			html += '<ul class="booking-info">';
			html += '<li>Время: ' + booking.time + '</li>';
			html += '<li>Имя: ' + booking.name + '</li>';
			html += '<li>Телефон: ' + booking.phone + '</li>';
			html += '</ul>';

			html += '</section>';
		});

		html += '</div>';
		html += '</div>';
	});

	bookingsScreen.innerHTML = html;
}

function filterFbBookings (fbBookings) {
	var unorderedBookings = [];
	for (booking in fbBookings) {
		var fbBooking = fbBookings[booking];
		unorderedBookings.push(fbBooking);
	}

	var orderedBookings = [];
	
	// get only dates for further filtering
	var unorderedDates = unorderedBookings.map(function (booking) {
		return booking.date;
	});
	// remove duplicate dates for further filtering
	var dates = unorderedDates.filter(function (date, pos) {
		return unorderedDates.indexOf(date) === pos;
	});

	var numericDates = dates.map(function (date) {
		return parseInt(date.split('-').join(''));
	});

	var orderedNumericDates = [];
	var datesLength = numericDates.length;
	while (orderedNumericDates.length !== datesLength) {
		var pivotIndex = 0;
		var pivot = numericDates[pivotIndex];

		for (var j = 1; j < datesLength; j++) {
			var compared = numericDates[j];

			if (compared < pivot) {
				pivot = compared;
				pivotIndex = j;
			}
		}

		numericDates.splice(pivotIndex, 1);

		orderedNumericDates.push(pivot);
	}

	var orderedDates = orderedNumericDates.map(function (date) {
		var HYPHEN_AFTER_YEAR_POS = 4;
		var date = date.toString();
		var result = insertSubstringInString(date, '-', HYPHEN_AFTER_YEAR_POS);

		var HYPHEN_AFTER_MONTH_POS = 7;
		result = insertSubstringInString(result, '-', HYPHEN_AFTER_MONTH_POS);

		return result;
	});

	orderedBookings = orderedDates.map(function (date) {
		var bookingDay = {};
		bookingDay.date = date;
		bookingDay.beautifiedDate = getBookingBeautifiedDate(date);
		bookingDay.isTodaysDay = window.today === date;
		bookingDay.bookings = unorderedBookings.filter(function (booking) {
			return booking.date === date;
		});

		return bookingDay;
	});

	return orderedBookings;
}

function getBookingBeautifiedDate (date) {
	var DAY_START_POS = 8;
	var day = date.substring(DAY_START_POS);
	if (day[0] === '0') {
		day = day.substring(1);
	}

	var MONTH_START_POS = 5;
	var MONTH_END_POS = 7;
	var month = date.substring(MONTH_START_POS, MONTH_END_POS);

	var YEAR_END_POS = 4;
	var year = date.substring(0, YEAR_END_POS);

	switch (month) {
		case '01':
			month = 'января';
			break;
		case '02':
			month = 'февраля';
			break;
		case '03':
			month = 'марта';
			break;
		case '04':
		  month = 'апреля';
		  break;
	  case '05':
	  	month = 'мая';
	  	break;
	  case '06':
	  	month = 'июня';
	  	break;
	  case '07':
	  	month = 'июля';
	  	break;
	 	case '08':
	  	month = 'августа';
	  	break;
	  case '09':
	  	month = 'сентября';
	  	break;
	  case '10':
	  	month = 'октября';
	  	break;
	  case '11':
	  	month = 'ноября';
	  	break;
	  case '12':
	  	month = 'декабря';
	  	break;
	}

	return day + ' ' + month + ' ' + year;
}
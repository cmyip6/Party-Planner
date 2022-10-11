import { addNavbar } from '/functions/addNavbar.js';
import { loadName } from '/functions/loadName.js';
import { loadEventDetails, pasteInvitationLink } from '../loadEvent.js';
import { deletedParticipantsList } from '../listenButtons.js';

window.addEventListener('load', async () => {
	addNavbar();
	await loadName();
	await loadEventDetails();
	document.body.style.display = 'block';
});

// Submit datetime form
document.querySelector('#datetime-form').addEventListener('submit', async function (e) {
	e.preventDefault();
	const form = e.target;
	const startTime = form.datetime_start.value ? new Date(form.datetime_start.value).toISOString() : null;
	const endTime = form.datetime_end.value ? new Date(form.datetime_end.value).toISOString() : null;
	const nowTimeValue = new Date().getTime();
	const startTimeValue = new Date(startTime).getTime();
	const endTimeValue = new Date(endTime).getTime();

	let dataPass = true;

	if (startTimeValue && endTimeValue) {
		if (startTimeValue <= nowTimeValue) {
			dataPass = false;
			alert('Start time must be later than time now!');
		} else if (startTimeValue >= endTimeValue) {
			dataPass = false;
			alert('Start time cannot equals or later than end time!');
		}
	} else if (!!startTimeValue + !!endTimeValue) {
		dataPass = false;
		alert('You cannot only leave 1 time blank!');
	}

	if (dataPass) {
		const formObj = {
			startTime,
			endTime
		};
		const params = new URLSearchParams(window.location.search);
		const eventId = params.get('event-id');
		const res = await fetch(`/events/detail/datetime/${eventId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formObj)
		});

		const eventsResult = await res.json();
		if (eventsResult.status) {
			alert('Date & Time successfully updated!');
			const myModal = bootstrap.Modal.getInstance(document.getElementById('datetime-modal'));
			myModal.hide();
			loadEventDetails();
		} else {
			alert('Unable to update.');
		}
	}
});

// Submit venue form
document.querySelector('#venue-form').addEventListener('submit', async function (e) {
	e.preventDefault();
	const form = e.target;
	const venue = form.venue.value;

	let dataPass = true;

	if (!venue) {
		dataPass = false;
		alert('Please enter new venue to update!');
	}

	if (dataPass) {
		const formObj = {
			venue
		};
		const params = new URLSearchParams(window.location.search);
		const eventId = params.get('event-id');
		const res = await fetch(`/events/detail/venue/${eventId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formObj)
		});

		const eventsResult = await res.json();
		if (eventsResult.status) {
			alert('Venue successfully updated!');
			const myModal = bootstrap.Modal.getInstance(document.getElementById('venue-modal'));
			myModal.hide();
			loadEventDetails();
		} else {
			alert('Unable to update.');
		}
	}
});

// Venue edit-poll toggle
document.querySelector('#edit-venue-switch').addEventListener('change', ()=>{
	document.querySelector('.edit-input').classList.toggle("hide");
	document.querySelector('.poll-input').classList.toggle("hide");
});
document.querySelector('#poll-venue-switch').addEventListener('change', ()=>{
	document.querySelector('.edit-input').classList.toggle("hide");
	document.querySelector('.poll-input').classList.toggle("hide");
});

// Venue polling add option button
document.querySelector('#venue-add-option').addEventListener('click', (e)=>{
	e.preventDefault();
	const numberOfOptions = document.querySelectorAll('div[class^="venue_poll_"]').length;
	let newDiv = document.createElement('div');
	newDiv.classList = `venue_poll_${numberOfOptions+1}`;
	newDiv.innerHTML = `
		<label for="venue_poll">Option ${numberOfOptions+1}: </label>
		<input type="text" class="form-control" name="venue_poll" aria-label="venue_poll"
			aria-describedby="basic-addon1" />
	`;
	document.querySelector('.venue-poll-options-container').appendChild(newDiv);
})

// Venue polling remove option button
document.querySelector('#venue-remove-option').addEventListener('click', (e)=>{
	e.preventDefault();
	const venuePollOptionsDivList = document.querySelectorAll('div[class^="venue_poll_"]');
	const numberOfOptions = venuePollOptionsDivList.length;
	if (numberOfOptions > 2) {
		venuePollOptionsDivList[numberOfOptions - 1].remove();
	}
})

// Submit venue polling
document.querySelector('#venue-poll-form').addEventListener('submit', async (e)=> {
	e.preventDefault();
	const params = new URLSearchParams(window.location.search);
	const eventId = params.get('event-id');
	let formList = [];
	const form = e.target;
	const formInputNodeList = form.venue_poll;
	formInputNodeList.forEach((each)=>{
		if (!!each.value) {
			formList.push(each.value);
		}
	})
	const res = await fetch(`/events/poll/venue/${eventId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formList)
	});
	const result = await res.json();
	if (result.status) {
		alert('Successfully created a venue poll!');
		window.location.href = `/poll/venuePoll.html?event-id=${eventId}`;
	} else {
		if (result.created) {
			alert('Poll has been created before!');
			const venuePollModal = bootstrap.Modal.getInstance(document.getElementById('venue-modal'));
			venuePollModal.hide();
			const venuePollOverwriteModal = new bootstrap.Modal(document.getElementById('overwrite-venue-poll-modal'));
			venuePollOverwriteModal.show();
		} else {
			alert('Unable to create poll.');
		}
	}
});

// Overwrite venue poll confirmed
document.querySelector('#overwrite-venue-poll-submit').addEventListener('click', async (e)=> {
	e.preventDefault();
	const params = new URLSearchParams(window.location.search);
	const eventId = params.get('event-id');
	let formList = [];
	const form = document.querySelector('#venue-poll-form');
	const formInputNodeList = form.venue_poll;
	formInputNodeList.forEach((each)=>{
		if (!!each.value) {
			formList.push(each.value);
		}
	})
	const res = await fetch(`/events/poll/venue/overwrite/${eventId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formList)
	});
	const result = await res.json();
	if (result.status) {
		alert('Successfully created a venue poll!');
		window.location.href = `/poll/venuePoll.html?event-id=${eventId}`;
	} else {
		alert('Unable to create poll.');
	}
});


// Submit participants form
document.querySelector('#participants-submit').addEventListener('click', async () => {
	const params = new URLSearchParams(window.location.search);
	const eventId = parseInt(params.get('event-id'));
	const res = await fetch(`/events/participants/${eventId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(deletedParticipantsList)
	});
	if (res.status !== 200) {
		const data = await res.json();
		alert(data.msg);
		return;
	}
	const result = await res.json();
	if (result.status) {
		if (result.notDeletable.length) {
			let warnText = 'Unable to remove following participant(s):';
			for (let each of result.notDeletable) {
				warnText += `
    # ${each.deletedParticipant.id} ${each.deletedParticipant.first_name} ${each.deletedParticipant.last_name}
    Unsettled Item(s):`;
				for (let i = 0; i < each.itemInCharge.length; i++) {
					warnText += `
          [${each.itemInCharge[i].type_name}] ${each.itemInCharge[i].name}`;
				}
				warnText += `

        `;
			}
			alert(warnText);
			deletedParticipantsList.splice(0, deletedParticipantsList.length);
			loadEventDetails();
			//Warn
		} else {
			deletedParticipantsList.splice(0, deletedParticipantsList.length);
			loadEventDetails();
			alert('Successfully deleted all selected participants!');
		}
	} else {
		alert('Unable to delete selected participants!');
	}
});

// Reset participants form
document.querySelector('#participants-reset').addEventListener('click', async () => {
	deletedParticipantsList.splice(0, deletedParticipantsList.length);
	loadEventDetails();
});

// Submit Invitation Copy Link Button
document.querySelector('#invitation-form').addEventListener('submit', async function (e) {
	e.preventDefault();

	const params = new URLSearchParams(window.location.search);
	const eventId = params.get('event-id');
	const res = await fetch(`/events/detail/invitation/${eventId}`);

	const invitationResult = await res.json();
	if (invitationResult.status) {
		pasteInvitationLink(eventId, invitationResult.invitation_token);
		alert('Link renewed!');
	} else {
		alert('Unable to create link.');
	}
});

// Copy Invitation Link Button
document.querySelector('#invitation-link').addEventListener('click', (e) => {
	const linkTextDiv = document.querySelector('#invitation-modal .form-control');
	// Select the text field
	linkTextDiv.select();
	linkTextDiv.setSelectionRange(0, 99999); // For mobile devices

	// Copy the text inside the text field
	navigator.clipboard.writeText(linkTextDiv.value);

	// Change button to copied
	e.target.classList.add('copied');
	const currentWidth = e.target.offsetWidth;
	e.target.style.width = `${currentWidth}px`;
	e.target.innerHTML = 'Copied!';

	// Change back the button to normal
	setTimeout(() => {
		e.target.classList.remove('copied');
		e.target.innerHTML = 'Copy Link';
	}, 5000);
});

// Delete Event Button
document.querySelector('#delete-event-submit').addEventListener('click', async ()=>{
	const params = new URLSearchParams(window.location.search);
	const eventId = params.get('event-id');
	const res = await fetch(`/events/${eventId}`, {
		method: 'DELETE'
	});
	const result = await res.json();
	if (result.status) {
		alert("Event deleted!");
		window.location.href = "/index.html";
	} else {
		alert("Unable to delete event!");
	}
})
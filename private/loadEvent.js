import {
	listenCreateButtons,
	listenParticipateButtons,
	listenEditButtons,
	listenToSchedulePage,
	listenToItemPage,
	listenToDeleteParticipants
} from './listenButtons.js';

export let currentParticipantsList = [];
let deletedParticipantsList = [];

export async function loadCreateEvents(page) {
	const res = await fetch(`/events/created?page=${page}`);

	if (res.status !== 200) {
		const data = await res.json();
		alert(data.msg);
		return;
	}
	const result = await res.json();

	const events = result.object;
	const currentPage = result.currentPage;
	const totalPage = result.page;

	const eventsCreateContainer = document.querySelector('.create .events-container');
	const pageCreateContainer = document.querySelector('.create .turn-page-button-container');

	let eventsCreateHTML = '';

	for (let event of events) {
		let status = '';
		let statusClass = '';
		const today = new Date().getTime();
		const eventStartDate = new Date(event.start_datetime).getTime();
		if (event.deleted) {
			status = 'Deleted';
			statusClass = 'deletedStatus';
		} else {
			if (today > eventStartDate && eventStartDate) {
				status = 'Completed';
				statusClass = 'completedStatus';
			} else {
				status = 'Processing';
				statusClass = 'progressStatus';
			}
		}
		eventsCreateHTML += `
    <tr class="table-content-row">
      <th scope="col" class="ID_${event.id} hidable-2">
        <div>${event.id}</div>
      </th>
      <th scope="col" class="name_${event.id}">
        <div>${event.name}</div>
      </th>
      <th scope="col" class="address_${event.id}">
        <div>${!event.venue ? 'TBD' : event.venue}</div>
      </th>
      <th scope="col" class="start_datetime_${event.id}">
        <div>
          ${
				!event.start_datetime
					? 'TBD'
					: new Date(event.start_datetime)
							.toLocaleString('en-US', { hour12: false })
							.replace(', ', ' ')
							.slice(0, -3)
			}
        </div>
      </th>
      <th scope="col" class="end_datetime_${event.id} hidable-1">
        <div>
          ${
				!event.end_datetime
					? 'TBD'
					: new Date(event.end_datetime)
							.toLocaleString('en-US', { hour12: false })
							.replace(', ', ' ')
							.slice(0, -3)
			}
        </div>
      </th>
      <th scope="col" class="event_status_${event.id}">
        <div><div class="${statusClass}">${status}</div></div>
      </th>
      <th scope="col" class="created_detail_${event.id}">
        <div>
          <a class="edit-button">
            <i class="fa-regular fa-pen-to-square"></i>
          </a>
        </div>
      </th>
    </tr>
`;
	}
	const pageHTML = !totalPage ? '' : `Showing ${currentPage} of ${totalPage}`;
	eventsCreateContainer.innerHTML = eventsCreateHTML;
	pageCreateContainer.innerHTML = `
    <div class="page-number">${pageHTML}</div>
    <button type="button" class="previous-round btn btn-light">
      <i class="fa-sharp fa-solid fa-less-than"></i>
    </button>
    <button type="button" class="next-round btn btn-light">
      <i class="fa-sharp fa-solid fa-greater-than"></i>
    </button>
  `;
	listenCreateButtons();
	listenEditButtons();
	return currentPage;
}

export async function loadParticipateEvents(page) {
	const res = await fetch(`/events/participated?page=${page}`);

	if (res.status !== 200) {
		const data = await res.json();
		alert(data.msg);
		return;
	}
	const result = await res.json();

	const events = result.object;
	const currentPage = result.currentPage;
	const totalPage = result.page;

	const eventsParticipateContainer = document.querySelector('.participate .events-container');
	const pageParticipateContainer = document.querySelector('.participate .turn-page-button-container');

	let eventsParticipateHTML = '';

	for (let event of events) {
		let status = '';
		let statusClass = '';
		const today = new Date().getTime();
		const eventStartDate = new Date(event.start_datetime).getTime();
		if (event.deleted) {
			status = 'Deleted';
			statusClass = 'deletedStatus';
		} else {
			if (today > eventStartDate && eventStartDate) {
				status = 'Completed';
				statusClass = 'completedStatus';
			} else {
				status = 'Processing';
				statusClass = 'progressStatus';
			}
		}
		eventsParticipateHTML += `
        <tr class="table-content-row">
            <th scope="col" class="ID_${event.id} hidable-2">
              <div>${event.id}</div>
            </th>
            <th scope="col" class="name_${event.id}">
              <div>${event.name}</div>
            </th>
            <th scope="col" class="address_${event.id}">
              <div>${!event.venue ? 'TBD' : event.venue}</div>
            </th>
            <th scope="col" class="start_datetime_${event.id}">
              <div>
                ${
					!event.start_datetime
						? 'TBD'
						: new Date(event.start_datetime)
								.toLocaleString('en-US', { hour12: false })
								.replace(', ', ' ')
								.slice(0, -3)
				}
              </div>
            </th>
			      <th scope="col" class="end_datetime_${event.id} hidable-1">
              <div>
                ${
					!event.end_datetime
						? 'TBD'
						: new Date(event.end_datetime)
								.toLocaleString('en-US', { hour12: false })
								.replace(', ', ' ')
								.slice(0, -3)
				}
              </div>
            </th>
            <th scope="col" class="event_status_${event.id}">
              <div><div class="${statusClass}">${status}</div></div>
            </th>
            <th scope="col" class="participated_detail_${event.id}">
            <div>
              <a class="edit-button">
                <i class="fa-regular fa-pen-to-square"></i>
              </a>
            </div>
          </th>
        </tr>
        `;
	}
	const pageHTML = !totalPage ? '' : `Showing ${currentPage} of ${totalPage}`;
	eventsParticipateContainer.innerHTML = eventsParticipateHTML;
	pageParticipateContainer.innerHTML = `
    <div class="page-number">${pageHTML}</div>
    <button type="button" class="previous-round btn btn-light">
      <i class="fa-sharp fa-solid fa-less-than"></i>
    </button>
    <button type="button" class="next-round btn btn-light">
      <i class="fa-sharp fa-solid fa-greater-than"></i>
    </button>
  `;
	listenParticipateButtons();
	listenEditButtons();
	return currentPage;
}

export async function loadEventDetails() {
	const params = new URLSearchParams(window.location.search);
	const isCreator = parseInt(params.get('is-creator'));
	const eventId = params.get('event-id');

	const res = await fetch(`/events/detail/${isCreator ? 'created' : 'participated'}/${eventId}`);
	if (res.status !== 200) {
		const data = await res.json();
		alert(data.msg);
		return;
	}
	const result = await res.json();

	if (result.status) {
		// Check if the event is processing
		const today = new Date().getTime();
		const eventStartDate = new Date(result.detail.start_datetime).getTime();
		const processing = today <= eventStartDate || !eventStartDate;
		const deleted = result.detail.deleted;

		// Load Event Name into Page
		let deleteEventButton = '';
		if (isCreator && processing && !deleted) {
			deleteEventButton = `
        <div class="delete_event-button-container">
          <a class="delete-button" id="delete_event-button" data-bs-toggle="modal" data-bs-target="#delete-event-modal">
            <i class="fa-solid fa-trash-can"></i>
          </a>
        </div>
      `;
		}
		const eventName = document.querySelector('.eventname .background-frame');
		eventName.innerHTML = `
      <div class="name-block">
        <div class="emoji">
          🎉
        </div>
        <div>
          ${result.detail.name}
        </div>
      </div>
      ${deleteEventButton}
    `;

		// Load Date Time into Page
		let dateTimeLabel = '';
		let startDateTimeString = '';
		let endDateTimeString = '';
		if (result.detail.start_datetime && result.detail.end_datetime) {
			startDateTimeString = new Date(result.detail.start_datetime)
				.toLocaleString('en-US', { hour12: false })
				.replace(', ', ' ')
				.slice(0, -3);
			endDateTimeString = new Date(result.detail.end_datetime)
				.toLocaleString('en-US', { hour12: false })
				.replace(', ', ' ')
				.slice(0, -3);
			dateTimeLabel = `
        <div>Start:</div>
        <div>End:</div>
      `;
		} else {
			startDateTimeString = 'To Be Determined';
		}

		let editTimeButton = '';
		if (isCreator && processing && !deleted) {
			editTimeButton = `
        <a class="edit-button" data-bs-toggle="modal" data-bs-target="#datetime-modal">
          <i class="fa-regular fa-pen-to-square"></i>
        </a>
      `;
		}
		let datetimePollButton = '';
		if (result.detail.date_poll_created) {
			datetimePollButton = `
      <a class="poll-button" href="/poll/datetimePoll.html?${params}">
        <i class="fa-solid fa-check"></i>
      </a>
    `;
		}
		const dateTime = document.querySelector('.date-time .background-frame');
		dateTime.innerHTML = `
      <div class="frame-title">
        Date & Time
      </div>
      <div>
        <div class="frame-content-label">
          ${dateTimeLabel}
        </div>
        <div class="frame-content">
          <div>${startDateTimeString}</div>
          <div>${endDateTimeString}</div>        
        </div>
        <div class="datetime-buttons-container">
          ${datetimePollButton}
          ${editTimeButton}
        </div>
      </div>
    `;

		// Load Participants into Page
		let participantListHTML = '';
		participantListHTML += '<div>';
		participantListHTML += `
      <div class="red_creator creator_${result.creator.id}">
        <i class="fa-solid fa-user"></i>
        &nbsp; &nbsp;
        ${result.creator.first_name} ${result.creator.last_name}
      </div>
    `;
		if (result.participants.length) {
			const userList = result.participants;
			for (let user of userList) {
				participantListHTML += `
        <div class="user_${user.id}">
          <i class="fa-solid fa-user"></i>
          &nbsp; &nbsp;
          ${user.first_name} ${user.last_name}
        </div>
        `;
			}
		}
		participantListHTML += '</div>';

		let editParticipantsButton = '';
		if (isCreator && processing && !deleted) {
			editParticipantsButton = `
        <a class="edit-button" data-bs-toggle="modal" data-bs-target="#participants-modal">
          <i class="fa-regular fa-pen-to-square"></i>
        </a>
      `;
		}

		let inviteButton = '';
		if (isCreator && processing && !deleted) {
			inviteButton = `
        <div class="invite-button-container">
          <a class="invite-button" data-bs-toggle="modal" data-bs-target="#invitation-modal">
            +
          </a>
          <div>
            Invite more friends
          </div>
        </div>
      `;
		}
		const participant = document.querySelector('.participant .background-frame');
		participant.innerHTML = `
      <div class="frame-title-container">
        <div class="left">
          <div class="frame-title">
            Participants
          </div>
          <div id="number-of-participants">
            ${result.participants.length + 1}
          </div>
        </div>
        ${editParticipantsButton}
      </div>

      <div class="frame-content-container">
        ${participantListHTML}
      </div>
      ${inviteButton}
    `;

		// Load Participants Modal
		currentParticipantsList = structuredClone(result.participants);
		loadParticipantsModal(currentParticipantsList, deletedParticipantsList);

		// Load Invitation Link
		pasteInvitationLink(result.detail.id, result.detail.invitation_token);

		// Load Venue into Page
		let venueString = '';
		if (result.detail.venue) {
			venueString = `
        <a href="https://www.google.com/maps/search/${result.detail.venue.replaceAll(' ', '+')}/" target="_blank">
          ${result.detail.venue || ''}
        </a>
      `;
		} else {
			venueString = 'To Be Determined';
		}
		let editVenueButton = '';
		if (isCreator && processing && !deleted) {
			editVenueButton = `
        <a class="edit-button" data-bs-toggle="modal" data-bs-target="#venue-modal">
          <i class="fa-regular fa-pen-to-square"></i>
        </a>
      `;
		}
		let venuePollButton = '';
		if (result.detail.venue_poll_created) {
			venuePollButton = `
      <a class="poll-button" href="/poll/venuePoll.html?${params}">
        <i class="fa-solid fa-check"></i>
      </a>
    `;
		}
		const venue = document.querySelector('.venue .background-frame');
		venue.innerHTML = `
        <div class="frame-title-container">
          <div class="frame-title">
            Venue
          </div>
          <div class="venue-buttons-container">
            ${venuePollButton}  
            ${editVenueButton}
          </div>
        </div>
        <div class="frame-content-container">
          <i class="fa-solid fa-location-dot"></i>
          &nbsp; &nbsp;
          ${venueString}
        </div>
    `;

		// Load schedule into Page
		let infoButtonHTML = '';
		if (result.detail.start_datetime && result.detail.end_datetime) {
			infoButtonHTML = `
      <a class="info-button">
        <i class="fa-solid fa-info"></i>
      </a>
      `;
		}
		const schedule = document.querySelector('.schedule .background-frame');
		schedule.innerHTML = `
          <div class="frame-title-container">
            <div id="frame-content-container" class="frame-title">
              Schedule
            </div>
            ${infoButtonHTML}
          </div>
          <div class="frame-content-container">
            <div id="rundown-container" class="overflow-auto" data-current="0">
              <div id="rundown" class="row"> 
              </div>
            </div>
          </div>
      `;

		// Load item into Page
		const item = document.querySelector('.item .background-frame');

		item.innerHTML = `
            <div class="frame-title-container">
              <div class="frame-title">
                Item
              </div>
              <a class="info-button">
                <i class="fa-solid fa-info"></i>
              </a>
            </div>
            <div class="frame-content-container">
              <div class="shopping-list">
              <div class="item-list border">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col" class="pending-item-header">
                        Pending Items:
                        <div>
                          <button id="shopping-list-shorting" class="shorting-btn" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-filter-circle"></i></button>
                          <ul class="dropdown-menu">
                            <li><a class="dropdown-item">Food</a></li>
                            <li><a class="dropdown-item">Drink</a></li>
                            <li><a class="dropdown-item">Decoration</a></li>
                            <li><a class="dropdown-item">Other</a></li>
                          </ul>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody id="shopping-list-update">
                    <!--loaded with itemPost.js "shopping list JS"-->
                  </tbody>
                </table>
              </div>
            </div>


            </div>
            `;
		listenToSchedulePage(result.detail.start_datetime);
		listenToItemPage();
		listenToDeleteParticipants();
	} else {
		const roleName = isCreator ? 'creator' : 'participant';
		alert(`You are not ${roleName} of the event!`);
	}
}

export function loadParticipantsModal(currentList, deletedList) {
	let currentParticipantListModalHTML = '';
	if (currentList.length) {
		currentParticipantListModalHTML += '<div>';
		for (let user of currentList) {
			currentParticipantListModalHTML += `
      <div class="user-wrapper current" id="wrapper_user_${user.id}">
        <div class="user_${user.id}">
          <i class="fa-solid fa-user"></i>
          &nbsp; &nbsp;
          ${user.first_name} ${user.last_name}
        </div>
        <a class="delete-button" id="delete_button_user_${user.id}">
          <i class="fa-solid fa-trash-can"></i>
        </a>
      </div>
      `;
		}
		currentParticipantListModalHTML += '</div>';
	}
	const currentParticipantModal = document.querySelector('#participants-modal #current-participants-list');
	currentParticipantModal.innerHTML = `
    <div class="participants-list-title">
      Current
    </div>
    <div class="frame-content-container">
      ${currentParticipantListModalHTML}
    </div>
  `;

	let deletedParticipantListModalHTML = '';
	if (deletedList.length) {
		deletedParticipantListModalHTML += '<div>';
		for (let user of deletedList) {
			deletedParticipantListModalHTML += `
      <div class="user-wrapper current" id="wrapper_user_${user.id}">
        <div class="user_${user.id}">
          <i class="fa-solid fa-user"></i>
          &nbsp; &nbsp;
          ${user.first_name} ${user.last_name}
        </div>
      </div>
      `;
		}
		deletedParticipantListModalHTML += '</div>';
	}
	const deletedParticipantModal = document.querySelector('#participants-modal #deleted-participants-list');
	deletedParticipantModal.innerHTML = `
    <div class="participants-list-title">
      Deleted
    </div>
    <div class="frame-content-container">
      ${deletedParticipantListModalHTML}
    </div>
  `;
}

export function pasteInvitationLink(eventId, invitation_token) {
	document.querySelector(
		'#invitation-modal .form-control'
	).value = `http://${window.location.host}/invitationPage/invitation.html?event-id=${eventId}&token=${invitation_token}`;
}

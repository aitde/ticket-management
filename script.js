let addbtn = document.querySelector(".add-btn");
let modelbox = document.querySelector(".modal-cont");
let maincont = document.querySelector(".main-cont");
let taskarea = document.querySelector(".text-area");
let removebtn = document.querySelector(".remove-btn");
let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let allprioritycolors = document.querySelectorAll(".pri-color");

let addflag = false;
let removeflag = false;

let lockclass = "fa-lock";
let unlockclass = "fa-lock-open";

let toolboxcolor = document.querySelectorAll(".color");
let modelprioritycolor = colors[colors.length - 1];

let ticketarray = [];

if (localStorage.getItem("tickets")) {
	ticketarray = JSON.parse(localStorage.getItem("tickets"));
	ticketarray.forEach(function (ticket) {
		creatTicket(ticket.tickettask, ticket.ticketcolor, ticket.ticketid);
	});
}

addbtn.addEventListener("click", function () {
	addflag = !addflag;

	if (addflag) {
		modelbox.style.display = "flex";
	} else modelbox.style.display = "none";
});

modelbox.addEventListener("keydown", function (e) {
	let key = e.key;
	if (key == "Shift") {
		creatTicket(taskarea.value, modelprioritycolor);
		taskarea.value = "";
		modelbox.style.display = "none";
		addflag = false;
	}
});

function creatTicket(tickettask, ticketcolor, ticketid) {
	let id = ticketid || shortid();

	let ticketcont = document.createElement("div");
	ticketcont.setAttribute("class", "ticket-cont");

	ticketcont.innerHTML = `<div class="ticket-color ${ticketcolor}"></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${tickettask}</div>
    <div class="lock"><i class="fa-solid fa-lock"></i></div>`;

	maincont.appendChild(ticketcont);

	handleremoval(ticketcont, id);

	handlelock(ticketcont, id);

	handlecolor(ticketcont, id);

	if (!ticketid) {
		ticketarray.push({ tickettask, ticketcolor, ticketid: id });
		localStorage.setItem("tickets", JSON.stringify(ticketarray));
	}
}

removebtn.addEventListener("click", function () {
	removeflag = !removeflag;

	if (removeflag == true) {
		removebtn.style.color = "red";
	} else {
		removebtn.style.color = "white";
	}
});

function handleremoval(ticket, id) {
	ticket.addEventListener("click", function () {
		if (!removeflag) return;

		let idx = getticketidx(id);
		let deletedele = ticketarray.splice(idx, 1);

		localStorage.setItem("tickets", JSON.stringify(ticketarray));

		ticket.remove();
	});
}

allprioritycolors.forEach(function (colorelem) {
	colorelem.addEventListener("click", function (e) {
		allprioritycolors.forEach(function (prioritycolorele) {
			prioritycolorele.classList.remove("active");
		});
		colorelem.classList.add("active");

		modelprioritycolor = colorelem.classList[0];
	});
});

function handlelock(ticket, id) {
	let ticketlock = ticket.querySelector(".lock");
	let ticketlockicon = ticketlock.children[0];
	let tickettaskarea = ticket.querySelector(".task-area");

	ticketlockicon.addEventListener("click", function () {
		let ticketidx = getticketidx(id);
		if (ticketlockicon.classList.contains(lockclass)) {
			ticketlockicon.classList.remove(lockclass);
			ticketlockicon.classList.add(unlockclass);

			tickettaskarea.setAttribute("contenteditable", "true");
		} else {
			ticketlockicon.classList.remove(unlockclass);
			ticketlockicon.classList.add(lockclass);
			tickettaskarea.setAttribute("contenteditable", "false");
		}

		ticketarray[ticketidx].tickettask = tickettaskarea.innerText;
		localStorage.setItem("tickets", JSON.stringify(ticketarray));
	});
}

function handlecolor(ticket, id) {
	let ticketcolorband = ticket.querySelector(".ticket-color");
	ticketcolorband.addEventListener("click", function () {
		let ticketidx = getticketidx(id);
		let currentcolor = ticketcolorband.classList[1];
		let currentcolorindex = colors.findIndex(function (color) {
			return currentcolor == color;
		});

		currentcolorindex++;
		let newticketcolor = colors[currentcolorindex % 4];
		ticketcolorband.classList.remove(currentcolor);
		ticketcolorband.classList.add(newticketcolor);

		ticketarray[ticketidx].ticketcolor = newticketcolor;
		localStorage.setItem("tickets", JSON.stringify(ticketarray));
	});
}

for (let i = 0; i < toolboxcolor.length; i++) {
	toolboxcolor[i].addEventListener("click", function () {
		let selectedcolor = toolboxcolor[i].classList[0];

		let filteredtickets = ticketarray.filter(function (ticketobj) {
			return selectedcolor === ticketobj.ticketcolor;
		});

		let allticket = document.querySelectorAll(".ticket-cont");
		for (let i = 0; i < allticket.length; i++) {
			allticket[i].remove();
		}

		filteredtickets.forEach(function (filteredobj) {
			creatTicket(
				filteredobj.tickettask,
				filteredobj.ticketcolor,
				filteredobj.ticketid
			);
		});
	});

	toolboxcolor[i].addEventListener("dblclick", function () {
		let allticket = document.querySelectorAll(".ticket-cont");
		for (let i = 0; i < allticket.length; i++) {
			allticket[i].remove();
		}

		ticketarray.forEach(function (ticketobj) {
			creatTicket(
				ticketobj.tickettask,
				ticketobj.ticketcolor,
				ticketobj.ticketid
			);
		});
	});
}

function getticketidx(id) {
	let ticketidx = ticketarray.findIndex(function (ticketobj) {
		return ticketobj.ticketid === id;
	});
	return ticketidx;
}

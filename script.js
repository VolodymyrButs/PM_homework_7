const container = document.getElementById("container");

const createButton = document.getElementById("create");

const updateButton = document.getElementById("update");

const renameButton = document.getElementById("rename");

const deleteButton = document.getElementById("delete");

const deleteSelectedButton = document.querySelector(".deleteSelected");

let current = null;
let isMoved;
let mouseDownOnContainer = false;

//HANDLERS
const dragstartHandler = (ev) => {
  current = ev.target;
  current.style.opacity = "0.4";
};

const dragoverHandler = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  let files = document.getElementsByTagName("span");

  if (current == evt.target) {
    return;
  }

  let currentpos = 0,
    droppedpos = 0;
  for (let it = 0; it < files.length; it++) {
    if (current == files[it]) {
      currentpos = it;
    }
    if (evt.target == files[it]) {
      droppedpos = it;
    }
  }
  if (currentpos < droppedpos) {
    evt.target.parentNode.insertBefore(current, evt.target.nextSibling);
  } else {
    evt.target.parentNode.insertBefore(current, evt.target);
  }
};

const dragendHandler = (evt) => {
  evt.preventDefault();
  current.style.opacity = "1";
  current = null;
};

const updateHandler = (e) => {
  e.stopPropagation();
  current = e.target;
  updateButton.setAttribute("style", `top:${e.y - 20}px; left:${e.x - 20}px;`);
};

const selectHandler = (e) => {
  isMoved && e.target.classList.add("selected");
};

//WORK WITH FILE
const createFile = () => {
  createButton.style.top = "-200px";
  const name = prompt("Input file name");
  if (name == "" || name == undefined) {
    return;
  }
  let files = document.getElementsByTagName("span");
  for (let file of files) {
    if (file.innerHTML == name) {
      alert("File with this name already exist, input another name");
      return;
    }
  }
  const file = document.createElement("span");
  file.innerHTML = name;
  file.setAttribute("draggable", "true");
  file.addEventListener("contextmenu", (evt) => {
    evt.preventDefault();
    updateHandler(evt);
  });
  file.addEventListener("dragstart", (evt) => dragstartHandler(evt));
  file.addEventListener("dragover", (evt) => dragoverHandler(evt));
  file.addEventListener("dragend", (evt) => dragendHandler(evt));
  file.addEventListener("mouseover", (evt) => selectHandler(evt));
  container.appendChild(file);
};

const deleteFile = () => {
  current.removeEventListener("dragstart", (evt) => dragstartHandler(evt));
  current.removeEventListener("dragover", (evt) => dragoverHandler(evt));
  current.removeEventListener("dragend", (evt) => dragendHandler(evt));
  current.removeEventListener("click", (evt) => updateHandler(evt));
  current.removeEventListener("mouseover", (evt) => selectHandler(evt));
  current.remove();
  updateButton.style.top = "-200px";
  current = null;
};

const renameFile = () => {
  let files = document.getElementsByTagName("span");
  const newName = prompt("Input new file name");
  if (newName == "" || newName == undefined) {
    return;
  }

  for (let file of files) {
    if (file.innerHTML == newName) {
      alert("File with this name already exist, input another name");
      return;
    }
  }
  current.innerHTML = newName;
  updateButton.style.top = "-200px";
};

//BUTTONS
createButton.addEventListener("click", createFile);

renameButton.addEventListener("click", renameFile);

deleteButton.addEventListener("click", deleteFile);

createButton.addEventListener(
  "mouseleave",
  () => (createButton.style.top = "-200px")
);

updateButton.addEventListener(
  "mouseleave",
  () => (updateButton.style.top = "-200px")
);

deleteSelectedButton.addEventListener("mouseleave", () => {
  deleteSelectedButton.style.top = "-200px";
  createButton.style.top = "-200px";
  let files = document.getElementsByTagName("span");
  for (let file of files) {
    file.classList.remove("selected");
  }
});

deleteSelectedButton.addEventListener("click", () => {
  document.querySelectorAll(".selected").forEach((elem) => {
    elem.removeEventListener("dragstart", (evt) => dragstartHandler(evt));
    elem.removeEventListener("dragover", (evt) => dragoverHandler(evt));
    elem.removeEventListener("dragend", (evt) => dragendHandler(evt));
    elem.removeEventListener("click", (evt) => updateHandler(evt));
    elem.removeEventListener("mouseover", (evt) => selectHandler(evt));
    elem.remove();
  });
  deleteSelectedButton.style.top = "-200px";
});

//CONTAINER HANDLERS
container.addEventListener("mousedown", (event) => {
  event.stopPropagation();
  if (event.target == container) {
    mouseDownOnContainer = true;
  }
});

container.addEventListener("mousemove", (event) => {
  event.stopPropagation();
  mouseDownOnContainer ? (isMoved = true) : (isMoved = false);
});

container.addEventListener("mouseup", (event) => {
  event.stopPropagation();

  isMoved &&
    mouseDownOnContainer &&
    document.querySelector(".selected") != null &&
    deleteSelectedButton.setAttribute(
      "style",
      `top:${event.y - 20}px; left:${event.x - 20}px;`
    );
  setTimeout(() => {
    isMoved = false;
    mouseDownOnContainer = false;
  }, 10);
});

container.addEventListener("click", (event) => {
  event.stopPropagation();
  !isMoved &&
    event.target == container &&
    createButton.setAttribute(
      "style",
      `top:${event.y - 20}px; left:${event.x - 20}px;`
    );
});

//ADD EVENTLISTENER TO 'HARDCORED' FILES
window.addEventListener("DOMContentLoaded", function () {
  let files = document.getElementsByTagName("span");
  for (let file of files) {
    file.addEventListener("dragstart", (evt) => dragstartHandler(evt));
    file.addEventListener("dragover", (evt) => dragoverHandler(evt));
    file.addEventListener("dragend", (evt) => dragendHandler(evt));
    file.addEventListener("mouseover", (evt) => selectHandler(evt));
    file.addEventListener("contextmenu", (evt) => {
      evt.preventDefault();
      updateHandler(evt);
    });
  }
});

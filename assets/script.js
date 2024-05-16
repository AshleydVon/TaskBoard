let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

function generateTaskId() {
  return nextId++;
}

function createTaskCard(task) {
  return `
    <div class="card border-secondary mb-3" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
      </div>
    </div>
  `;
}

function renderTaskList() {
  $("#todo-cards, #in-progress-cards, #done-cards").empty(); 

  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    const $card = $(taskCard); 

    $card.addClass("draggable"); 

    $(`#${task.status}-cards`).append($card);
  });

  
  $(".draggable").each(function () {
    $(this).draggable({
      revert: "invalid",
      stack: ".card",
      cursor: "move",
      zIndex: 1000,
      start: function(event, ui) {
        $(this).css("z-index", 1000); 
      },
      stop: function(event, ui) {
        $(this).css("z-index", ""); 
      }
    });
  });

  
  $(".droppable").css("z-index", "1"); 
}

function handleAddTask(event) {
  const title = $("#task-title").val();
  const dueDate = $("#task-due-date").val();
  const description = $("#task-description").val();

  if (title && dueDate && description) {
    const newTask = {
      id: generateTaskId(),
      title: title,
      dueDate: dueDate,
      description: description,
      status: "todo"
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));

    renderTaskList(); 
    $("#exampleModal").modal("hide");
  } else {
    alert("Please fill out all fields.");
  }
}

function handleDeleteTask(event) {
  const card = $(event.target).closest(".card");
  const taskId = parseInt(card.attr("data-id"));

  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));

  card.remove();
}

function handleDrop(event, ui) {
  const card = ui.draggable;
  const taskId = parseInt(card.attr("data-id"));
  const newStatus = $(event.target).attr("id");

  taskList.forEach(task => {
    if (task.id === taskId) {
      task.status = newStatus;
    }
  });

  localStorage.setItem("tasks", JSON.stringify(taskList));
}

$(document).ready(function () {
  renderTaskList();

  $('#addTaskBtn').click(function () {
    handleAddTask(); 
  });

  $("#taskForm").submit(function (event) {
    event.preventDefault();
    handleAddTask(event);
  });

  $(".card").on("click", ".btn-delete-task", handleDeleteTask);

  $(".lane").droppable({
    accept: ".draggable", 
    drop: handleDrop
  });

  $("#task-due-date").datepicker({
    dateFormat: "yy-mm-dd"
  });
});

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

function generateTaskId() {
  return nextId++;
}

function getBootstrapClassByDueDate(dueDate) {
  const currentDate = new Date();
  const due = new Date(dueDate);
  const timeDiff = due - currentDate;
  if (timeDiff < 0) {
    return 'bg-danger'; // Overdue
  } else if (timeDiff < 7 * 24 * 60 * 60 * 1000) { 
    return 'bg-warning';
  } else {
    return 'bg-success';
  }
}

function getBootstrapClassByStatus(status) {
  if (status === 'in-progress') {
    return 'bg-warning'; // In Progress (yellow)
  } else if (status === 'done') {
    return 'bg-success'; // Done (green)
  } else {
    return ''; // Default: no specific color
  }
}

function createTaskCardElement(task) {
  const card = $('<div>').addClass('card border-secondary mb-3').attr('data-id', task.id);
  const cardBody = $('<div>').addClass('card-body');
  const title = $('<h5>').addClass('card-title').text(task.title);
  const description = $('<p>').addClass('card-text').text(task.description);
  const dueDate = $('<p>').addClass('card-text text-muted').text(`Due: ${task.dueDate}`);
  const deleteButton = $('<button>').addClass('btn btn-danger btn-delete-task').text('Delete');

  cardBody.append(title, description, dueDate, deleteButton);
  card.append(cardBody);

  // Set the Bootstrap background color class based on the task's status or due date
  card.removeClass('bg-danger bg-warning bg-success'); // Remove any existing color classes
  if (task.status === 'todo') {
    card.addClass(getBootstrapClassByDueDate(task.dueDate));
  } else {
    card.addClass(getBootstrapClassByStatus(task.status));
  }

  return card[0];
}

function renderTaskList() {
  $('#todo-cards, #in-progress-cards, #done-cards').empty();

  taskList.forEach(task => {
    const taskCard = createTaskCardElement(task);
    const $card = $(taskCard);

    $card.addClass('draggable');

    $(`#${task.status}-cards`).append($card);
  });

  $('.draggable').each(function () {
    $(this).draggable({
      revert: 'invalid',
      stack: '.draggable',
      cursor: 'move',
      zIndex: 1002
    });
  });

  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop
  });
}

function handleAddTask() {
  const title = $('#task-title').val();
  const dueDate = $('#task-due-date').val();
  const description = $('#task-description').val();

  if (title && dueDate && description) {
    const newTask = {
      id: generateTaskId(),
      title: title,
      dueDate: dueDate,
      description: description,
      status: 'todo'
    };

    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('nextId', JSON.stringify(nextId));

    renderTaskList();
    $('#exampleModal').modal('hide');
    // Clear the form fields
    $('#taskForm')[0].reset();
  } else {
    alert('Please fill out all fields.');
  }
}

function handleDeleteTask(event) {
  const card = $(event.target).closest('.card');
  const taskId = parseInt(card.attr('data-id'));

  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(taskList));

  card.remove();
}

function handleDrop(event, ui) {
  const card = ui.draggable;
  const taskId = parseInt(card.attr('data-id'));
  const newStatus = $(event.target).closest('.lane').attr('id').replace('-cards', '');

  taskList = taskList.map(task => {
    if (task.id === taskId) {
      task.status = newStatus;
    }
    return task;
  });

  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}

$(document).ready(function () {
  renderTaskList();

  $('#addTaskBtn').click(function () {
    handleAddTask();
  });

  $('#taskForm').submit(function (event) {
    event.preventDefault();
    handleAddTask();
  });

  $(document).on('click', '.btn-delete-task', handleDeleteTask);

  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop
  });

  $('#task-due-date').datepicker({
    dateFormat: 'yy-mm-dd'
  });
});

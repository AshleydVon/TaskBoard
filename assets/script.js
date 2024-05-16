const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

function generateTaskId() {
  return nextId++;
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

  /
  $('.droppable').css('z-index', '1001');

  $('.draggable').each(function () {
    $(this).draggable({
      revert: 'invalid',
      stack: '.card',
      cursor: 'move',
      zIndex: 1000,
      start: function (event, ui) {
        
      },
      stop: function (event, ui) {
       
      }
    });
  });
}

function handleAddTask(event) {
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
  const newStatus = $(event.target).attr('id');

  taskList.forEach(task => {
    if (task.id === taskId) {
      task.status = newStatus;
    }
  });

  localStorage.setItem('tasks', JSON.stringify(taskList));
}

$(document).ready(function () {
  renderTaskList();

  $('#addTaskBtn').click(function () {
    handleAddTask();
  });

  $('#taskForm').submit(function (event) {
    event.preventDefault();
    handleAddTask(event);
  });

  // Handle delete task button click
  $(document).on('click', '.btn-delete-task', handleDeleteTask);

  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop
  });

  $('#task-due-date').datepicker({
    dateFormat: 'yy-mm-dd'
  });
});

document.addEventListener('DOMContentLoaded', () => {
    let tasks = [];

    // Load tasks from local storage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTaskList();
        }
    }

    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Generate a unique task id
    function generateTaskId() {
        return Date.now().toString();
    }

    // Create a task card
    function createTaskCard(task) {
        const taskCard = document.createElement('div');
        const taskId = task.id;
        taskCard.id = taskId; // Assigning a unique ID to the task card
        taskCard.classList.add('card');
        taskCard.draggable = true; // Making the task card draggable
        taskCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <button class="btn btn-danger delete-task" data-id="${taskId}">Delete</button>
            </div>
        `;
        taskCard.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', taskId); // Set data being dragged
        });

        return taskCard;
    }

    // Render the task list
function renderTaskList() {
    const todoLane = document.getElementById('todo-cards');
    const inProgressLane = document.getElementById('in-progress-cards');
    const doneLane = document.getElementById('done-cards');
    
    // Clear the task lists
    todoLane.innerHTML = '';
    inProgressLane.innerHTML = '';
    doneLane.innerHTML = '';

    // Iterate over tasks and append them to the appropriate lane
    tasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        if (task.status === 'todo') {
            todoLane.appendChild(taskCard);
        } else if (task.status === 'in-progress') {
            inProgressLane.appendChild(taskCard);
        } else if (task.status === 'done') {
            doneLane.appendChild(taskCard);
        }
    });
}

    // Handle adding a new task
    function handleAddTask(event) {
        event.preventDefault();
        const taskTitleElement = document.getElementById('task-title');
        const taskDescriptionElement = document.getElementById('task-description');
        const taskDueDateElement = document.getElementById('task-due-date');
        const task = {
            id: generateTaskId(),
            title: taskTitleElement.value,
            description: taskDescriptionElement.value,
            dueDate: taskDueDateElement.value,
            status: 'todo',
        };
        tasks.unshift(task); // Add the new task to the beginning of the array
        renderTaskList();
        saveTasks(); // Save tasks to local storage
        taskTitleElement.value = '';
        taskDescriptionElement.value = '';
        taskDueDateElement.value = '';
        // Hide the modal
        $('#formModal').modal('hide');
    }

    // Handle deleting a task
    function handleDeleteTask(event) {
        const taskId = event.target.dataset.id;
        tasks = tasks.filter((task) => task.id !== taskId);
        renderTaskList();
        saveTasks(); // Save tasks to local storage
    }

// Handle dropping a task into a new status lane
function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const taskCard = document.getElementById(taskId);
    const newLaneId = event.currentTarget.id;
    const newLaneContainer = document.getElementById(newLaneId + '-cards'); // Select the container for the new lane
    
    // Remove the task card from its current container
    taskCard.parentNode.removeChild(taskCard);

    // Append the task card to the container of the new lane
    newLaneContainer.appendChild(taskCard);

    const task = tasks.find((task) => task.id === taskId);
    if (task) {
        task.status = newLaneId; // Assigning the status based on the ID of the target lane
        saveTasks(); // Save tasks to local storage
    } else {
        console.error('Task not found for ID:', taskId);
    }
}




    // Make lanes droppable
    const lanes = document.querySelectorAll('.lane');
    lanes.forEach((lane) => {
        lane.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        lane.addEventListener('drop', handleDrop);
    });

    // Add event listeners for adding and deleting tasks
    document.getElementById('add-task-button').addEventListener('click', () => {
        $('#formModal').modal('show');
    });
    document.querySelector('#formModal form').addEventListener('submit', handleAddTask);
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-task')) {
            handleDeleteTask(event);
        }
    });

    // Load tasks from local storage when the page loads
    loadTasks();
});

let dragElement = null;


function addDragEvents(task) {
    task.addEventListener('dragstart', () => {
        dragElement = task;
    });

    task.addEventListener('dragend', () => {
        dragElement = null;
    });
}


function applyStatusColor(task, columnId) {
    task.classList.remove('todo-task', 'progress-task', 'done-task');

    if (columnId === 'todo') task.classList.add('todo-task');
    if (columnId === 'progress') task.classList.add('progress-task');
    if (columnId === 'done') task.classList.add('done-task');
}


function updateCounts() {
    document.querySelectorAll('.column').forEach(col => {
        const count = col.querySelectorAll('.task').length;
        col.querySelector('.count').innerText = count;
    });
}


function saveTasks() {
    const data = {};

    document.querySelectorAll('.task-column').forEach(column => {
        const colId = column.parentElement.id;

        data[colId] = Array.from(column.querySelectorAll('.task')).map(task => ({
            title: task.querySelector('h2').innerText,
            description: task.querySelector('p').innerText
        }));
    });

    localStorage.setItem('tasksData', JSON.stringify(data));
    updateCounts();
}


function loadTasks() {
    const savedData = JSON.parse(localStorage.getItem('tasksData'));
    if (!savedData) return;

    Object.keys(savedData).forEach(colId => {
        const column = document.querySelector(`#${colId} .task-column`);

        savedData[colId].forEach(task => {
            const div = createTask(task.title, task.description);
            applyStatusColor(div, colId);
            column.appendChild(div);
        });
    });

    updateCounts();
}


function createTask(title, description) {
    const div = document.createElement('div');
    div.classList.add('task');
    div.setAttribute('draggable', 'true');

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button class="delete">Delete</button>
    `;

    addDragEvents(div);

    div.querySelector('.delete').addEventListener('click', () => {
        div.remove();
        saveTasks();
    });

    return div;
}


document.querySelectorAll('.task-column').forEach(column => {

    column.addEventListener('dragover', e => e.preventDefault());

    column.addEventListener('drop', () => {
        if (!dragElement) return;

        column.appendChild(dragElement);
        applyStatusColor(dragElement, column.parentElement.id);
        saveTasks();
    });
});


const toggleModalBtn = document.querySelector('#toggle-modal');
const modalBg = document.querySelector('.modal .bg');
const modal = document.querySelector('.modal');
const addNewTaskBtn = document.querySelector('#add-new-task');

toggleModalBtn.addEventListener('click', () => {
    modal.classList.toggle('active');
});

modalBg.addEventListener('click', () => {
    modal.classList.remove('active');
});


addNewTaskBtn.addEventListener('click', () => {
    const titleInput = document.querySelector('#task-title-input');
    const descInput = document.querySelector('#task-desc-input');

    if (!titleInput.value.trim()) return;

    const task = createTask(titleInput.value, descInput.value);
    applyStatusColor(task, 'todo');

    document.querySelector('#todo .task-column').appendChild(task);

    saveTasks();

    titleInput.value = '';
    descInput.value = '';
    modal.classList.remove('active');
});


window.addEventListener('load', loadTasks);

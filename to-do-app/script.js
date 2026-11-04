

// form and containers
const taskForm = document.getElementById('task-form');
const tasksContainer = document.getElementById('tasks-container');


//buttons
const openTaskFormBtn = document.getElementById('open-task-form-btn');
const closeTaskFormBtn = document.getElementById('close-task-form-btn');
const addOrUpdateTaskBtn = document.getElementById('add-or-update-task-btn');
const cancelBtn = document.getElementById('cancel-btn');

//inputs and dialog
const confirmCloseDialog = document.getElementById('confirm-close-dialog');
const discardBtn = document.getElementById('discard-btn');
const titleInput = document.getElementById('title-input');
const dateInput = document.getElementById('date-input');
const descriptionInput = document.getElementById('description-input');

//data and storage
const taskData = JSON.parse(localStorage.getItem('data')) || [];
let currentTask = {};

//functions

const removeSpecialChars = (str) => {
    const cleanStr = str.replace(/[^a-zA-Z0-9 ]/g, '');
    return cleanStr;
}

const reset = () => {
    addOrUpdateTaskBtn.innerText = 'Add Task';
    titleInput.value = '';
    dateInput.value = '';
    descriptionInput.value   = '';
    taskForm.classList.toggle('hidden');
    currentTask = {}; 

};

const addOrUpdateTask = () => {
    if(!titleInput.value.trim()){
        alert('Please provide a title.');
        return;
    }
    const cleanedId = removeSpecialChars(titleInput.value.toLowerCase());
    const dataArrIndex = taskData.findIndex(item => item.id === currentTask.id);
    const taskObj = {
        id: `${cleanedId.split(' ').join('-')}-${Date.now()}`,
        title: titleInput.value,
        date: dateInput.value,
        description: descriptionInput.value,
    };
    if(dataArrIndex === -1) {
        taskData.unshift(taskObj);
    } else {
        taskData[dataArrIndex] = taskObj;
    }
    localStorage.setItem('data', JSON.stringify(taskData));
    updateTaskContainer();
    reset();
};

const deleteTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(item => item.id === buttonEl.parentElement.id);
    buttonEl.parentElement.remove();
    taskData.splice(dataArrIndex, 1);
    localStorage.setItem('data', JSON.stringify(taskData));
};
const editTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(item => item.id === buttonEl.parentElement.id);
    currentTask = taskData[dataArrIndex];
    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    descriptionInput.value = currentTask.description;
    addOrUpdateTaskBtn.innerText = 'Update Task';
    taskForm.classList.toggle('hidden');

};

const updateTaskContainer = () => {
    tasksContainer.innerHTML = '';
    taskData.forEach(({id, title, date, description}) => tasksContainer.innerHTML += `
        <div class='task' id='${id}'>
            <p><strong>Title:</strong>${title}</p>
            <p><strong>Date:</strong>${date}</p>
            <p><strong>Description:</strong>${description}</p>
            <button type='button' class='btn' onclick =editTask(this)>Edit</button>
            <button type='button' class='btn' onclick =deleteTask(this)>Delete</button>
        </div>
    `)
};

if(taskData.length) {
    updateTaskContainer();
}

//event listeners
openTaskFormBtn.addEventListener('click', () => {taskForm.classList.toggle('hidden')});
closeTaskFormBtn.addEventListener('click', () => {
    const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;
    if(titleInput.value || dateInput.value || descriptionInput.value && formInputValuesUpdated) {
        confirmCloseDialog.showModal();
    } else {
        reset();
    }
});
cancelBtn.addEventListener('click', () => {confirmCloseDialog.close()});
discardBtn.addEventListener('click', () => {
    confirmCloseDialog.close()
    reset();
});
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addOrUpdateTask();
});
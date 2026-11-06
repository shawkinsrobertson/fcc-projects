

// form and containers
const taskForm = document.getElementById('task-form');
const tasksContainer = document.getElementById('tasks-container');
const sidebar = document.querySelector('.menu-sidebar');
const tasks = document.querySelectorAll('.task');
const projectContainer = document.getElementById('project-container');
const listContainer = document.getElementById('list-container');


//buttons
const openTaskFormBtn = document.getElementById('open-task-form-btn');
const closeTaskFormBtn = document.getElementById('close-task-form-btn');
const addOrUpdateTaskBtn = document.getElementById('add-or-update-task-btn');
const cancelBtn = document.getElementById('cancel-btn');
const deleteProjectsBtn = document.getElementById('delete-projects-btn');
const deleteListsBtn = document.getElementById('delete-lists-btn');

//inputs and dialog
const confirmCloseDialog = document.getElementById('confirm-close-dialog');
const discardBtn = document.getElementById('discard-btn');
const titleInput = document.getElementById('title-input');
const dateInput = document.getElementById('date-input');
const descriptionInput = document.getElementById('description-input');
const projectInput = document.getElementById('project-input');
const listInput = document.getElementById('list-input');
const parentInput = document.getElementById('parent-input');

//data and storage
const taskData = JSON.parse(localStorage.getItem('tasks')) || [];
const projectData = JSON.parse(localStorage.getItem('projects')) || [];
const listData = JSON.parse(localStorage.getItem('lists')) || [];
let currentTask = {};
let currentProject = {};
let currentlist = {};
const newId = crypto.randomUUID();
const formattedDate = dateInput.value.split('-').reverse().join('-').replaceAll('-', '/');

//functions
// const removeSpecialChars = (str) => {
//     const cleanStr = str.replace(/[^a-zA-Z0-9 ]/g, '');
//     return cleanStr;
// }

const reset = () => {
    addOrUpdateTaskBtn.innerText = 'Add Task';
    titleInput.value = '';
    dateInput.value = '';
    projectInput.value = '';
    listInput.value = '';
    descriptionInput.value   = '';
    currentTask = {}; 

};

const createProject = () => {
    const projectObj = {
        id: `project-${newId}`,
        date: formattedDate,
        title: projectInput.value,
    }
    projectData.unshift(projectObj);
    localStorage.setItem('projects', JSON.stringify(projectData));
};

const deleteProject = () => {
    const projectIndex = projectData.findIndex(project => project.id === currentProject.id);
    if(projectIndex === -1) {
        alert(`This project doesn't exist. Are you looking for a different project?`);
        return;
    } else {
        projectData.splice(projectIndex, 1);
    };
    localStorage.setItem('projects', JSON.stringify(projectData));
};

const createList = () => {
    const listObj = {
        id: `list-${newId}`,
        date: formattedDate,
        title: listInput.value,
    }
    listData.unshift(listObj);
    localStorage.setItem('lists', JSON.stringify(listData));
};

const deleteList = () => {
    const listIndex = listData.findIndex(list => list.id === currentList.id);
    if(listIndex === -1) {
        alert(`This list doesn't exist. Are you looking for a different list?`);
        return;
    } else {
        listData.splice(listIndex, 1);
    };
    localStorage.setItem('lists', JSON.stringify(listData));
};


const addOrUpdateTask = () => {
    if(!titleInput.value.trim()){
        alert('Please provide a title. Tasks without names cannot be accomplished.');
        return;
    }
    const dataArrIndex = taskData.findIndex(item => item.id === currentTask.id);
    const parentTask = taskData.filter(item => item.title === parentInput.value);
    const projectExists = projectData.includes(project => project.title === projectInput.value);
    const listExists =listData.includes(list => list.title === listInput.value);
    const taskObj = {
        id: currentTask.id ? currentTask.id : newId,
        timestamp: Date.now(),
        title: titleInput.value,
        date: formattedDate,
        project: projectInput.value || null,
        list: listInput.value || null,
        parentId: parentTask.id || null,
        description: descriptionInput.value,
    };
    //not a current parent or child task, no parent task assigned - new primary task
     if(projectInput.value !== null && !projectExists) {
            createProject(projectInput.value);
        }; 
        if(listInput.value !== null && !listExists) {
            createList(listInput.value);
        };
        if(dataArrIndex === -1) {
            taskData.unshift(taskObj);
        } else {
        taskData[dataArrIndex] = taskObj;
    }

    localStorage.setItem('tasks', JSON.stringify(taskData));
    updateTaskContainer();
    updateProjectContainer();
    updateListContainer();
    reset();
};

const deleteTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(item => item.id === buttonEl.parentElement.id);
    buttonEl.parentElement.remove();
    taskData.splice(dataArrIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(taskData));
};
const editTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(item => item.id === buttonEl.parentElement.id);
    currentTask = taskData[dataArrIndex];
    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    descriptionInput.value = currentTask.description;
    addOrUpdateTaskBtn.innerText = 'Update Task';

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

const updateProjectContainer = () => {
     projectContainer.innerHTML = '';
    projectData.forEach(({id, title, date}) => projectContainer.innerHTML += `
        <div class='project' id='${id}'>
            <p class='project-title'>${title}</p>
            <p class='project-timestamp'>${date}</p>
        </div>
    `)
};
const updateListContainer = () => {
     listContainer.innerHTML = '';
    listData.forEach(({id, title}) => listContainer.innerHTML += `
        <div class='list' id='${id}'>
            <p class='list-title'>${title}</p>
        </div>
    `)
};

if(taskData.length) {
    updateTaskContainer();
}
if(projectData.length) {
    updateProjectContainer();
}
if(listData.length) {
    updateListContainer();
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
deleteProjectsBtn.addEventListener('click', () => {
    projectData.length = 0;
    localStorage.removeItem('projects');
    updateProjectContainer();
});
deleteListsBtn.addEventListener('click', () => {
    listData.length = 0;
    localStorage.removeItem('lists');
    updateListContainer();
});



taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addOrUpdateTask();
});


//expand/collapse sidebar on click, change logo/hamburger menu/close icon display
// sidebar.addEventListener('click',)

// listen for key input on project and list inputs, search current projects/lists, create new if no matching entries
var tasks = [];
var idCount = 0;

const now = new Date(Date.now());

function addTask() {
    const task = document.querySelector('fieldset input');
    const taskName = task.value;
    taskName !== "" && tasks.push({
        id: idCount++,
        taskName,
        time: Date.now(),
        completed: false
    });
    task.value = "";

    window.localStorage.setItem('tasks', JSON.stringify(tasks));
    window.localStorage.setItem('idCount', JSON.stringify(idCount));
    renderTobeList(true);
}

document.querySelector('fieldset button').addEventListener('click', addTask);
document.querySelector('fieldset').onkeydown = (k) => {
    k.key === "Enter" && addTask();
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function itemToList({ id, taskName, time, completed }) {
    const elem = document.createElement('li');
    elem.setAttribute('key', id);

    const t = new Date(time);
    const tme = t.getDay() === now.getDay() ? t.getHours() + ':' + t.getMinutes() : days[t.getDay()];

    elem.innerHTML = `
    <input type="checkbox" class="checkbox" ${completed && "checked"}/>
    <p class="task-name">${taskName}</p>
    <time>${tme}</time>
    <!-- <span>${completed}</span> -->
    <button>delete</button> 
    `;

    var taskId = id;
    elem.querySelector('input').addEventListener('click', (e) => {
        const task = tasks.find(({ id }) => id === taskId);
        task.completed = e.target.checked;
        task.time = Date.now();
        window.localStorage.setItem('tasks', JSON.stringify(tasks));


        renderList(!e.target.checked);
    });

    elem.querySelector('button').addEventListener('click', () => {
        tasks = tasks.filter(({ id }) => id !== taskId);

        completed ? renderCompletedList() : renderTobeList();
        window.localStorage.setItem('tasks', JSON.stringify(tasks));

    })


    return elem;
}

function renderTobeList(newList = false) {
    document.querySelector('.tobe ul')?.remove();
    const tobeList = document.createElement("ul");

    tobeList.append(...tasks.filter(({ completed }) => !completed).sort(({ time }) => time).map(itemToList));
    newList && tobeList.children[0].classList.toggle('new');

    document.querySelector('.tobe').appendChild(tobeList);

}

function renderCompletedList(newList = false) {

    document.querySelector('.completed ul')?.remove();
    const completed = document.createElement("ul");

    completed.append(...tasks.filter(({ completed }) => completed).sort(({ time }) => time, true).reverse().map(itemToList));
    newList && completed.children[0].classList.toggle('new');
    document.querySelector('.completed').appendChild(completed);
}

function renderList(newList = false) {
    renderTobeList(newList);
    renderCompletedList(!newList);
}

function init() {
    const value = [window.localStorage.getItem('tasks'), window.localStorage.getItem('idCount')];
    tasks = value[0] ? JSON.parse(value[0]) : [];
    idCount = value[1] ? JSON.parse(value[1]) : 0;
    renderList();
}
init();



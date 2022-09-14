(function() {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    };

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary', 'disabled');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener("input", function() {
            if (input.value !== '') {
                button.classList.remove('disabled');
            } else {
                button.classList.add('disabled')
            }
        });

        button.addEventListener("click", function() {
            button.classList.add('disabled')
        });

        return {
            form,
            input,
            button,
        };
    };

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    };

    function createTodoItem(name) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        // done = item.classList.toggle('list-group-item-success');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        };
    };

    function createTodoApp(container, title = 'Список дел', arrayObjectsTodo = [], key) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();


        if (localStorage.getItem(key) !== null || localStorage.getItem(key) !== '') {
            arrayObjectsTodo = localStorage[key] ? JSON.parse(localStorage.getItem(key)) : arrayObjectsTodo
        };

        // Здесь отрисовываю дела, которые должны отображаться сразу, напрямую, не из формы(по умолчанию) 
        for (let i = 0; i < arrayObjectsTodo.length; i++) {
            let todoItem = createTodoItem(arrayObjectsTodo[i].name, arrayObjectsTodo[i].done);
            todoList.append(todoItem.item);
            console.log(arrayObjectsTodo[i].name, 'arrayObjectsTodo[i].name');
            console.log(todoItem.item, 'todoItem.item не из формы');

            if (arrayObjectsTodo[i].done === true) {
                todoItem.item.classList.add('list-group-item-success');
            };

            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success');
                if (todoItem.item.classList.contains('list-group-item-success')) {
                    arrayObjectsTodo[i].done = true;
                } else { arrayObjectsTodo[i].done = false; };
                localStorage.setItem(key, JSON.stringify(arrayObjectsTodo));
            });

            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    let newItems = JSON.parse(localStorage.getItem(key))
                    let newArray = newItems.filter(item => item.name !== arrayObjectsTodo[i].name);
                    todoItem.item.remove();
                    localStorage.setItem(key, JSON.stringify(newArray));
                }
            });
        };
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);


        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!todoItemForm.input.value) {
                return;
            };

            // Здесь создаю обьект и записываю его в адекватном виде в массив
            let todoObj = {};
            todoObj.name = todoItemForm.input.value;
            todoObj.done = false;
            arrayObjectsTodo.push(todoObj);

            let todoItem = createTodoItem(todoItemForm.input.value);
            console.log(todoItem.item, 'todoItem.item из формы');
            localStorage.setItem(key, JSON.stringify(arrayObjectsTodo));

            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success');
                if (todoItem.item.classList.contains('list-group-item-success')) {
                    todoObj.done = true;
                };
                localStorage.setItem(key, JSON.stringify(arrayObjectsTodo));
            });

            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    let newArray = JSON.parse(localStorage.getItem(key))
                    for (let i = 0; i < newArray.length; i++) {
                        console.log(newArray.length, 'newArray.length');
                        if (newArray[i].name === todoObj.name) {
                            console.log(newArray[i].name, 'i.name');
                            console.log(todoObj.name, 'todoItem.name');
                            newArray.splice(i, 1)
                            localStorage.setItem(key, JSON.stringify(newArray));
                        }
                        todoItem.item.remove();
                    }
                }
            });
            todoList.append(todoItem.item);
            todoItemForm.input.value = '';
        });
        localStorage.setItem(key, JSON.stringify(arrayObjectsTodo));
    };
    window.createTodoApp = createTodoApp;
})();
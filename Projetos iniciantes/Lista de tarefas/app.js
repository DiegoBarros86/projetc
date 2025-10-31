    (function(){
    const STORAGE_KEY = 'todo-list-v1';
    let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let filter = 'all';

    const $list = document.getElementById('list');
    const $form = document.getElementById('form');
    const $newTodo = document.getElementById('newTodo');
    const $count = document.getElementById('count');
    const $filters = document.querySelectorAll('.filters button');
    const $clearCompleted = document.getElementById('clearCompleted');

    function save(){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    function uid(){
        return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
    }

    function render(){
        $list.innerHTML = '';
        const visible = todos.filter(t => {
        if(filter === 'all') return true;
        if(filter === 'active') return !t.completed;
        if(filter === 'completed') return t.completed;
        });

        visible.forEach(t => {
        const li = document.createElement('li');
        li.dataset.id = t.id;
        li.className = t.completed ? 'completed' : '';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!t.completed;
        checkbox.setAttribute('aria-label','Marcar tarefa como concluída');
        checkbox.addEventListener('change', () => toggleComplete(t.id));

        const textWrap = document.createElement('div');
        textWrap.className = 'text';

        const span = document.createElement('span');
        span.textContent = t.text;
        span.tabIndex = 0;
        span.title = 'Duplo clique para editar';
        span.addEventListener('dblclick', () => startEdit(t.id, span));
        span.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') startEdit(t.id, span); });

        textWrap.appendChild(span);

        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'icon-btn';
        editBtn.title = 'Editar';
        editBtn.innerHTML = '✏️';
        editBtn.addEventListener('click', ()=> startEdit(t.id, span));

        const delBtn = document.createElement('button');
        delBtn.className = 'icon-btn danger';
        delBtn.title = 'Remover';
        delBtn.innerHTML = '🗑️';
        delBtn.addEventListener('click', ()=> removeTodo(t.id));

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        li.appendChild(checkbox);
        li.appendChild(textWrap);
        li.appendChild(actions);

        $list.appendChild(li);
        });

        const remaining = todos.filter(t => !t.completed).length;
        $count.textContent = `${remaining} tarefa${remaining !== 1 ? 's' : ''}`;
    }

    function addTodo(text){
        const trimmed = (text || '').trim();
        if(!trimmed) return false;
        todos.unshift({id: uid(), text: trimmed, completed:false});
        save(); render(); return true;
    }

    function removeTodo(id){
        todos = todos.filter(t => t.id !== id);
        save(); render();
    }

    function toggleComplete(id){
        const t = todos.find(x=>x.id===id);
        if(!t) return;
        t.completed = !t.completed;
        save(); render();
    }

    function startEdit(id, span){
        const li = span.closest('li');
        const t = todos.find(x=>x.id===id);
        if(!t) return;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = t.text;
        span.replaceWith(input);
        input.focus();

        function finish(saveEdit){
        if(saveEdit){
            const v = input.value.trim();
            if(v) t.text = v;
            else removeTodo(id);
        }
        save(); render();
        }

        input.addEventListener('blur', ()=> finish(true));
        input.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter') finish(true);
        if(e.key === 'Escape') finish(false);
        });
    }

    $form.addEventListener('submit', (e)=>{
        e.preventDefault();
        if(addTodo($newTodo.value)) $newTodo.value = '';
        $newTodo.focus();
    });

    $filters.forEach(btn => btn.addEventListener('click', ()=>{
        $filters.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.filter;
        render();
    }));

    $clearCompleted.addEventListener('click', ()=>{
        todos = todos.filter(t=>!t.completed);
        save(); render();
    });

    // inicializar
    render();

    // forçar foco no campo ao carregar
    window.addEventListener('load', ()=> $newTodo.focus());
    })();

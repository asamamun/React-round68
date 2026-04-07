/**
 * A simple reactive state helper.
 * It calls the callback whenever a property on the state object is changed.
 */
function createReactiveState(initialValue, onUpdate) {
    return new Proxy(initialValue, {
        set(target, property, value) {
            target[property] = value;
            onUpdate(target); // Automatically trigger render
            return true;
        }
    });
}

// 1. Define our State
const state = createReactiveState(
    {
        todos: [
            { id: 1, text: 'Learn Proxies', completed: false },
            { id: 2, text: 'Build reactive apps', completed: true }
        ]
    },
    render // Re-render whenever state changes
);

// 2. The Render Function
function render(currentState) {
    const listElement = document.getElementById('todoList');
    const statsElement = document.getElementById('stats');

    // Render the list items
    listElement.innerHTML = currentState.todos.map(todo => `
        <li class="${todo.completed ? 'completed' : ''}">
            <span>${todo.text}</span>
            <button onclick="toggleTodo(${todo.id})">
                ${todo.completed ? 'Undo' : 'Done'}
            </button>
        </li>
    `).join('');

    // Update stats
    const remaining = currentState.todos.filter(t => !t.completed).length;
    statsElement.textContent = `Pending tasks: ${remaining}`;
}

// 3. Action: Add Todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text) {
        // We trigger the Proxy's 'set' by assigning a NEW array (React-style)
        state.todos = [
            ...state.todos, 
            { id: Date.now(), text, completed: false }
        ];
        input.value = ''; // Clear input
    }
}

// 4. Action: Toggle Todo
window.toggleTodo = (id) => {
    state.todos = state.todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
};

// 5. Explicitly wire up the Add button
// This ensures the event listener is attached when the script loads
document.getElementById('addBtn').addEventListener('click', addTodo);

// 6. Handle "Enter" key in input
document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Initial Render
render(state);

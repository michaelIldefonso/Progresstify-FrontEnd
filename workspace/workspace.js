document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('project-board');
    const addColumnButton = document.getElementById('add-column');
    const trashCan = document.getElementById('trash-can');
    let draggedCard = null;

    // Function to add a new column
    function addColumn() {
        const column = document.createElement('div');
        column.classList.add('project-column');
        column.draggable = true;

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '5px';

        const title = document.createElement('input');
        title.type = 'text';
        title.value = 'New Column';
        title.classList.add('column-title');
        title.style.border = 'none';
        title.style.fontSize = '16px';
        title.style.fontWeight = 'bold';
        title.style.width = '100%';
        title.style.background = 'transparent';
        title.style.outline = 'none';
        title.style.transition = 'background 0.2s ease-in-out';
        title.addEventListener('focus', () => {
            title.style.background = 'rgba(255, 255, 255, 0.2)';
            title.select();
        });
        title.addEventListener('blur', () => {
            title.style.background = 'transparent';
            if (title.value.trim() === '') {
                title.value = 'Untitled Column';
            }
        });
        title.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                title.blur();
            }
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = '❌';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'red';
        closeButton.style.fontSize = '16px';
        closeButton.addEventListener('click', () => column.remove());

        header.appendChild(title);
        header.appendChild(closeButton);

        const addCardButton = document.createElement('div');
        addCardButton.classList.add('add-card');
        addCardButton.textContent = '+ Add Card';
        addCardButton.addEventListener('click', () => addCard(column, addCardButton));

        column.appendChild(header);
        column.appendChild(addCardButton);
        board.appendChild(column);

        column.addEventListener('dragover', dragOver);
        column.addEventListener('dragleave', dragLeave);
        column.addEventListener('drop', drop);

        title.focus(); // Auto-focus on title when a column is added
    }

    // Function to add a card to a column
    function addCard(column, addCardButton) {
        const existingInput = column.querySelector('.task-input');
        if (existingInput) return; // Prevent multiple inputs

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter task... (Press Enter to add, Esc to cancel)';
        input.className = 'task-input';

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim() !== '') {
                const newCard = document.createElement('div');
                newCard.className = 'project-card';
                newCard.textContent = input.value;
                newCard.draggable = true;

                newCard.addEventListener('dragstart', dragStart);
                newCard.addEventListener('dragend', dragEnd);

                column.insertBefore(newCard, addCardButton);
                input.remove();
            } else if (e.key === 'Escape') {
                input.remove();
            }
        });

        column.insertBefore(input, addCardButton);
        input.focus();
    }

    // Drag & Drop Logic
    function dragStart(e) {
        draggedCard = this;
        this.classList.add('dragging');
        setTimeout(() => (this.style.display = 'none'), 0);
    }

    function dragEnd() {
        this.classList.remove('dragging');
        this.style.display = 'block';
    }

    function dragOver(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    }

    function dragLeave() {
        this.classList.remove('drag-over');
    }

    function drop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');

        const addCardButton = this.querySelector('.add-card');
        const afterElement = getDragAfterElement(this, e.clientY);

        if (afterElement == null) {
            this.insertBefore(draggedCard, addCardButton); // Always keep "+ Add Card" at the bottom
        } else {
            this.insertBefore(draggedCard, afterElement);
        }

        draggedCard.style.display = 'block';
        draggedCard = null;
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.project-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Trash Can Logic
    trashCan.addEventListener('dragover', (e) => {
        e.preventDefault();
        trashCan.classList.add('drag-over');
    });

    trashCan.addEventListener('dragleave', () => {
        trashCan.classList.remove('drag-over');
    });

    trashCan.addEventListener('drop', () => {
        if (draggedCard) {
            draggedCard.remove();
            draggedCard = null;
        }
        trashCan.classList.remove('drag-over');
    });

    addColumnButton.addEventListener('click', addColumn);
});

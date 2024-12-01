document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-category');
    const saveButton = document.getElementById('save-category');
    const addCategoryButtons = document.querySelectorAll('.add-category');

    saveButton.style.display = 'none';
    addCategoryButtons.forEach(button => {
        button.style.display = 'none';
    });

    function toggleEditMode(isEditing) {
        if (isEditing) {
            editButton.style.display = 'none';
            saveButton.style.display = 'inline-block';
            addCategoryButtons.forEach(button => {
                button.style.display = 'inline-block';
            });
        } else {
            editButton.style.display = 'inline-block';
            saveButton.style.display = 'none';
            addCategoryButtons.forEach(button => {
                button.style.display = 'none';
            });
        }
    }

    editButton.addEventListener('click', () => {
        toggleEditMode(true);
    });

    saveButton.addEventListener('click', () => {
        toggleEditMode(false);
    });
});

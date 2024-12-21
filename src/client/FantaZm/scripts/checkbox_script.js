document.addEventListener('DOMContentLoaded', () => {
    const selectAllCheckbox = document.getElementById('selectAll');
    const itemCheckboxes = document.querySelectorAll('.inputCheck');

    function toggleSelectAll(checked){
        itemCheckboxes.forEach(item => item.checked = checked);
    }

    function updateSelectAll(){
        const allSelected = Array.from(itemCheckboxes).every(item => item.checked);
        selectAllCheckbox.checked = allSelected;
    }

    selectAllCheckbox.addEventListener('change', () => {
        toggleSelectAll(selectAllCheckbox.checked);
    });

    itemCheckboxes.forEach(item => {
        item.addEventListener('change', updateSelectAll);
    });
});
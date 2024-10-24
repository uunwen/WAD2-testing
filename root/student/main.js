// Function to toggle 'selected' class on filter options when clicked
function toggleSelect(element) {
    // Toggle the 'selected' class
    element.classList.toggle("selected");
}

// Optional: Handle the submit button click event
document.getElementById('submit-btn').addEventListener('click', function() {
    // Gather all selected filters
    let selectedFilters = [];

    // Loop through all elements with the 'selected' class
    document.querySelectorAll('.selected').forEach(function(filter) {
        selectedFilters.push(filter.innerText);
    });

    // Get the minimum hours needed value
    const minHoursInput = document.querySelector('input[placeholder="Min (hours)"]');
    const minHoursValue = minHoursInput.value;

    // Check if the minHoursValue is valid and not empty
    if (minHoursValue) {
        selectedFilters.push("Min Hours Needed: " + minHoursValue + " hours");
    }

    // Debug: Display selected filters in the console
    console.log("Selected filters: ", selectedFilters);

    // Here, you could send the selected filters to your server or do further processing
    alert("Selected Filters: " + selectedFilters.join(", "));
});
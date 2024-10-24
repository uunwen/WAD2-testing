async function fetchDataAndRenderChart() {
    try {
        const snapshot = await database.ref('events').once('value');
        const events = snapshot.val();
        const labels = [];
        const dataPoints = [];

        for (const eventKey in events) {
            labels.push(events[eventKey]["Project Name"]);
            dataPoints.push(events[eventKey]["SignUpCount"]); // Replace with your actual data field
        }

        renderChart(labels, dataPoints);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderChart(labels, dataPoints) {
    const ctx = document.getElementById('myChart').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Sign-Ups',
                data: dataPoints,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Call the function on page load
window.onload = () => {
    fetchDataAndRenderChart();
};

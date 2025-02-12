document.addEventListener("DOMContentLoaded", () => {
    // Attach the submit event to the form
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Clear previous results
        const responseDiv = document.getElementById('response');
        const graphImg = document.getElementById('result-graph');
        const scoreDiv = document.getElementById('score');
        responseDiv.innerHTML = "";
        graphImg.style.display = "none";
        scoreDiv.textContent = "";

        // Collect form data
        const formData = new FormData(this);

        // Send form data to the server
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Display results
                if (data.message) {
                    responseDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
                    if (data.plot_url) {
                        graphImg.src = `data:image/png;base64,${data.plot_url}`;
                        graphImg.style.display = "block";
                    }
                    scoreDiv.textContent = `Resume Score: ${data.score}`;
                } else if (data.error) {
                    responseDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                responseDiv.innerHTML = `<p style="color: red;">An error occurred: ${error.message}</p>`;
            });
    });
});

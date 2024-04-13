document.addEventListener('DOMContentLoaded', () => {
    const BASEURL = 'http://localhost:3002';

    function performSearch() {
        var input = document.getElementById('searchInput').value;
        if (!input) {
            alert('Please enter a keyword to search.');
            return;
        }

        fetch(BASEURL + '/api/search_flex_docs', {  // Changed to new search endpoint for FlexSearch
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ query: input })
        })
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching data.');
        });
    }

    function displayResults(results) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';  // Clear previous results

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="result-item">No results found.</div>';
            return;
        }

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.textContent = result.text;  // Assuming the result object has a 'text' property
            resultsContainer.appendChild(resultElement);
        });
    }

    function initiateIndexing() {
        fetch(BASEURL + '/api/populate_index_flex_docs', {  // Changed to new indexing endpoint for FlexSearch
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            alert('Indexing completed: ' + data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to initiate indexing.');
        });
    }

    // document.querySelector('button#searchButton').addEventListener('click', performSearch);
    // document.querySelector('button#indexButton').addEventListener('click', initiateIndexing);
    document.querySelector('button#flexSearchButton').addEventListener('click', performSearch);  // New event listener for FlexSearch
    document.querySelector('button#flexIndexButton').addEventListener('click', initiateIndexing);  // New event listener for Flex indexing
});

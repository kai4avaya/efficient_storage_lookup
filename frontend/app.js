document.addEventListener('DOMContentLoaded', () => {
    const BASEURL = 'http://localhost:3002';

    function performSearch() {

        timer.reset()
        timer.start()
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
        }).finally(() => {
            timer.stop()
        })
    }
    function displayResults(results) {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';  // Clear previous results
    
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<div class="result-item">No results found.</div>';
            return;
        }
    
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            if (result) {
                resultElement.textContent = `${result.url} - ${result.content}`;
            } else {
                resultElement.textContent = "Result not found";
            }
            resultsContainer.appendChild(resultElement);
        });
    }
    

    function initiateIndexing() {
        timer.reset()
        timer.start()
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
        }).finally(() => {
            timer.stop()
        })
    }

let startTime;
let timerInterval;

const timer = {
  running: false,
  
  start: function() {
    if (!this.running) {
      this.running = true;
      startTime = Date.now();
      timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        timerDisplay.textContent = this.formatTime(elapsedTime);
      }, 1); // Update the display every millisecond
    }
  },
  
  stop: function() {
    if (this.running) {
      this.running = false;
      clearInterval(timerInterval);
    }
  },
  
  reset: function() {
    this.stop();
    timerDisplay.textContent = '00:00:000';
  },
  
  formatTime: function(milliseconds) {
    let ms = milliseconds % 1000;
    let seconds = Math.floor((milliseconds / 1000) % 60);
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    ms = ms < 100 ? (ms < 10 ? '00' + ms : '0' + ms) : ms;
  
    return `${minutes}:${seconds}:${ms}`;
  }
};


const timerDisplay = document.getElementById('timerDisplay');


    // document.querySelector('button#searchButton').addEventListener('click', performSearch);
    // document.querySelector('button#indexButton').addEventListener('click', initiateIndexing);
    document.querySelector('button#flexSearchButton').addEventListener('click', performSearch);  // New event listener for FlexSearch
    document.querySelector('button#flexIndexButton').addEventListener('click', initiateIndexing);  // New event listener for Flex indexing
});

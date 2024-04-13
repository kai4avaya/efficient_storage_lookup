// import lunr from 'lunr';

// let conversations = [];
// let index;

// // Function to rebuild the Lunr index with the current conversations
// function rebuildIndex() {
//   index = lunr(function () {
//     this.ref('id');
//     this.field('title');
//     this.field('content');
    
//     // Add each conversation in the conversations array to the index
//     conversations.forEach(conv => this.add(conv));
//   });
// }

// // Add a new conversation to the array and rebuild the index
// export function addConversation(title, content) {
//   const id = conversations.length + 1;
//   const newConversation = { id: String(id), title, content }; // Ensure id is a string for Lunr ref
//   conversations.push(newConversation);
  
//   rebuildIndex(); // Rebuild the index with the new conversation added
//   console.log("saved newConversation", newConversation);
//   return newConversation;
// }

// // Edit an existing conversation
// export function editConversation(id, title, content) {
//   const conversationIndex = conversations.findIndex(c => c.id === id);
//   if (conversationIndex === -1) {
//     return null;
//   }

//   // Update the conversation
//   conversations[conversationIndex].title = title;
//   conversations[conversationIndex].content = content;
  
//   rebuildIndex(); // Rebuild the index with the updated conversation
  
//   return conversations[conversationIndex];
// }

// export function searchTopKDocuments(query, k = 5) {
//   // Ensure index is initialized before searching
//   if (!index) rebuildIndex();

//   const searchResults = index.search(query);
//   searchResults.sort((a, b) => b.score - a.score);
//   const topKResults = searchResults.slice(0, k);
//   const topKDocuments = topKResults.map(result => conversations.find(conv => conv.id === result.ref));
//   return topKDocuments;
// }

// // Initialize the index for the first time
// rebuildIndex();


import lunr from 'lunr';

let conversations = [];
let index;

function rebuildIndex() {
    index = lunr(function () {
        this.ref('id');
        this.field('url');
        this.field('text');
        this.field('processedDate');

        conversations.forEach(conv => this.add(conv));
    });
}

export function addDocumentToLunr(url, text) {
    const id = conversations.length + 1; // Generate a new ID based on array length
    const newDocument = { id: String(id), url, text, processedDate: new Date().toISOString() };
    conversations.push(newDocument);

    rebuildIndex(); // Rebuild the index with the new document added
    console.log("Indexed new document:", newDocument);
    return newDocument;
}

export function searchTopKDocuments(query, k = 5) {
    if (!index) rebuildIndex();

    const searchResults = index.search(query);
    searchResults.sort((a, b) => b.score - a.score);
    const topKResults = searchResults.slice(0, k);
    const topKDocuments = topKResults.map(result => conversations.find(conv => conv.id === result.ref));
    return topKDocuments;
}

// Initialize the index for the first time
rebuildIndex();

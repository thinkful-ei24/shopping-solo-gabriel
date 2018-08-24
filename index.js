const STORE = {
  data: [{ name: 'test', completed: false, filtered: false }],
  hideCompleted: false
};

const SHOPPING_LIST_CLASS = 'ul.shopping-list';

// Function for removing items from store
function removeItemFromStore(index) {
  // Removes the array item from index in store
  STORE.data.splice(index, 1);
}

// You should be able to delete items from the list
function handleDeleteItemClicked() {
  // input
  $('ul.shopping-list').on('click', '.shopping-item-delete', function(event) {
    // update store
    const index = retrieveItemIndexFromDOM($(event.target));
    // Remove the array item at index
    removeItemFromStore(index);
    // rerender
    renderShoppingList();
  });
}

// You should be able to check items on the list
function handleItemCheckClicked() {
  // Need to use event delegation Listen for when a user clicks the check button
  console.log('in handle checked');
  $('ul.shopping-list').on('click', '.shopping-item-toggle', function(event) {
    // Retrieve the item's index in STORE from ther data attr
    const index = retrieveItemIndexFromDOM($(event.target));
    // Toggle the checked property in the store
    toggleCheckedForListItem(index);
    // Re-render the shopping list
    renderShoppingList();
  });
}

// Function for retrieving item index from DOM
function retrieveItemIndexFromDOM(eventObj) {
  // Return the value of data-item-index attribute
  return eventObj.closest('li').attr('data-item-index');
}

// Function for toggling the checked status of a list item in store
function toggleCheckedForListItem(index) {
  // Set value of boolean to opposite of boolean
  STORE.data[index].completed = !STORE.data[index].completed;
}

// Handle submit event listener
function handleAddItem() {
  // Listen for when users submit a new list item
  $('#js-shopping-list-form').submit(event => {
    // Prevent submission
    event.preventDefault();
    // Add item to datastore
    addItemToStore();
    // Rerender the shopping list
    renderShoppingList();
  });
}

// You should be able to add items to the list
function addItemToStore() {
  // Get the name of the new item from the text input
  const inputObject = $('.js-shopping-list-entry');
  // Get string of new item's name
  const newListItem = inputObject.val();
  // Clear out the value of the input so new items can be addeed
  inputObject.val('');
  // Update the store
  STORE.data.push(constructStoreObject(newListItem));
}

function constructStoreObject(listItem) {
  return {
    name: listItem,
    completed: false,
    filtered: false
  };
}

// Function generating HTML for a li from an object and index
function listItemToHTML(itemObject, itemIndex) {
  // Set checkedStatus based on if item is completed or not in store
  const checkedStatus = itemObject.completed ? 'shopping-item__checked' : '';
  // Check filtered status, if filtered set hidden class else empty string
  const hiddenStatus = itemObject.filtered ? 'hidden' : '';

  // Return generated html interpolating classes and such
  return `
  <li class="${hiddenStatus}" data-item-index="${itemIndex}">
    <span class="shopping-item ${checkedStatus}">${itemObject.name}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle">
        <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete">
        <span class="button-label">delete</span>
      </button>
      <button class="shopping-item-edit">
        <span class="button-label">edit</span>
      </button>
    </div>
  </li>
  `;
}

// Edit handler function
function handleEdit() {
  $('ul.shopping-list').on('click', '.shopping-item-edit', function(event) {
    // Gets the index of the target
    const index = retrieveItemIndexFromDOM($(event.target));
    // Edit the name in the store based on index
    editItemNameInStore(index);
    // Render
    renderShoppingList();
  });
}

// Function for editing
function editItemNameInStore(index) {
  // Updates name in store
  STORE.data[index].name = promptUserForItemName(index);
}

// Function for prompting user for new name
function promptUserForItemName(index) {
  // Get the current name from the store
  const currentItemName = STORE.data[index].name;
  // Prompt for a new name
  return prompt('Enter new item name', currentItemName);
}

// Function for updating HTML on page
function updateShoppingListHTML(cssClass, items) {
  // Set shopping list selector's html to string of items array
  $(cssClass).html(items.join(''));
}

// Function for handling hide completed toggle
function handleHideCompletedToggle() {
  $('#js-toggle-hidden').on('click', function(event) {
    toggleHideCompleted();
  });
}

// Function for toggling hide completed
function toggleHideCompleted() {
  // Toggle hideCompleted property
  STORE.hideCompleted = !STORE.hideCompleted;
  // Loop through STORE.data
  STORE.data.forEach(item => {
    if (item.completed === true && STORE.hideCompleted === true) {
      // If item is completed and hideCompleted is true filter it out
      item.filtered = true;
    } else {
      // Otherwise don't filter it
      item.filtered = false;
    }
  });
  renderShoppingList();
}

// User can type in a search term and the displayed list will be filtered by item names containing the search term
// handle search submit
function handleSearchRequest() {
  // listen for search submission
  $('#js-shopping-list-search').submit(event => {
    // prevent refresh
    event.preventDefault();
    // execute search result logic
    const searchObject = $('.js-shopping-list-search');
    displaySearchResults($(searchObject));
    // render
    renderShoppingList();
  });
}

// Function for displaying search results
function displaySearchResults(searchObject) {
  // capture search input
  const searchTerm = searchObject.val();
  // reset search input
  searchObject.val('');
  // loop through STORE.data and toggle filtered unless a match is found
  STORE.data.forEach(item => {
    if (!item.name.includes(searchTerm)) {
      item.filtered = true; // if name doesn't include term filter it out
    } else {
      item.filtered = false; // if name does include term
    }
  });
}

// Function for handling search reset
function handleResetSearch() {
  $('#js-reset-search').on('click', function(event) {
    STORE.data.forEach(item => {
      item.filtered = false;
    });
    renderShoppingList();
  });
}

// Shopping list should be rendered to the page
function renderShoppingList() {
  // Check STORE.hideCompleted to see what to render on page
  if (STORE.hideCompleted) {
    // hide complete is on
    const items = STORE.data.map(listItemToHTML);
    // place html on page
    updateShoppingListHTML(SHOPPING_LIST_CLASS, items);
  } else {
    // hide complete is off
    const items = STORE.data.map(listItemToHTML);
    // place html on page
    updateShoppingListHTML(SHOPPING_LIST_CLASS, items);
  }
}

// On ready function
function handleShoppingList() {
  // Render the DOM
  renderShoppingList();
  // Run handler functions
  handleAddItem();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCompletedToggle();
  handleSearchRequest();
  handleResetSearch();
  handleEdit();
}

$(handleShoppingList);

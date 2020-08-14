// Storage Controller
const storageController = (() => {
    return {
        storeItem: (item) => {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
            else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: () => {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            }
            else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items;
        },
        updateItemStorage: (updatedItem) => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: (currentItemId) => {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if (currentItemId === item.id) {
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));            
        },
        clearAllItemsFromStorage: () => {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const itemController = (() => {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: storageController.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Returned public methods
    return {
        logData: () => {
            return data;
        },        
        getItems: () => {
            return data.items;
        },
        addItem: (name, calories) => {
            let ID;
            
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } 
            else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            const newItem = new Item(ID, name, calories);

            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: () => {
            let total = 0;
            data.items.forEach(item => {
                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        getItemById: (id) => {
            let found = null;
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: (item) => {
            data.currentItem = item;
        },
        getCurrentItem: () => {
            return data.currentItem;
        },
        updateItem: (name, calories) => {
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: (id) => {
            const 
                ids = data.items.map((item) => {
                    return item.id;
                }), 
                index = ids.indexOf(id)
            ;

            data.items.splice(index, 1)
        },
        clearAllItems: () => {
            data.items = [];
        }
    };
})();

// UI Controller
const uiController = (() => {
    const uiSelectors = {
        itemListId: 'item-list',
        addButtonId: 'add-btn',
        updateButtonId: 'update-btn',
        deleteButtonId: 'delete-btn',
        backButtonId: 'back-btn',
        clearAllButtonId: 'clear-btn',
        itemNameInputId: 'item-name',
        itemCaloriesInputId: 'item-calories',
        totalCaloriesSpanId: 'total-calories',
        listItemClass: 'collection-item'
    };

    const prepareAndAppendItem = (item) => {
        let itemHtml = `
        <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>
        </li>
        `;
        return itemHtml;
    }

    // Returned public methods
    return {
        populateItemList: (itemsCollection) => {
            itemsCollection.forEach(item => {
                document.getElementById(uiSelectors.itemListId).insertAdjacentHTML('beforeend', prepareAndAppendItem(item));
            });
        },
        getItemInput: () => {
            return {
                name: document.getElementById(uiSelectors.itemNameInputId).value,
                calories: document.getElementById(uiSelectors.itemCaloriesInputId).value
            }
        },
        getSelectors: () => {
            return uiSelectors;
        },
        addListItem: (item) => {
            document.getElementById(uiSelectors.itemListId).style.display = 'block';
            document.getElementById(uiSelectors.itemListId).insertAdjacentHTML('beforeend', prepareAndAppendItem(item));
        },
        clearInputFields: () => {
            document.getElementById(uiSelectors.itemNameInputId).value = '';
            document.getElementById(uiSelectors.itemCaloriesInputId).value = '';
        },
        showList: () => {
            document.getElementById(uiSelectors.itemListId).style.display = 'block';
        },
        addTotalCalories: () => {
            const totalCalories = itemController.getTotalCalories();
            document.getElementById(uiSelectors.totalCaloriesSpanId).textContent = totalCalories;
        },
        clearEditState: () => {
            uiController.clearInputFields();
            document.getElementById(uiSelectors.deleteButtonId).style.display = 'none';
            document.getElementById(uiSelectors.updateButtonId).style.display = 'none';
            document.getElementById(uiSelectors.backButtonId).style.display = 'none';
            document.getElementById(uiSelectors.addButtonId).style.display = 'inline-block';
            // Enable enter on add-btn
            document.getElementById(uiSelectors.addButtonId).type = 'submit';
            // Disable enter on update-btn
            document.getElementById(uiSelectors.updateButtonId).type = 'button';
        },
        showEditState: () => {
            document.getElementById(uiSelectors.deleteButtonId).style.display = 'inline-block';
            document.getElementById(uiSelectors.updateButtonId).style.display = 'inline-block';
            document.getElementById(uiSelectors.backButtonId).style.display = 'inline-block';
            document.getElementById(uiSelectors.addButtonId).style.display = 'none';
            // Disable enter on add-btn
            document.getElementById(uiSelectors.addButtonId).type = 'button';
            // Enable enter on update-btn
            document.getElementById(uiSelectors.updateButtonId).type = 'submit';
        },
        addItemToForm: () => {
            document.getElementById(uiSelectors.itemNameInputId).value = itemController.getCurrentItem().name;
            document.getElementById(uiSelectors.itemCaloriesInputId).value = itemController.getCurrentItem().calories;
            uiController.showEditState();
        }, 
        updateListItem: (item) => {
            let 
                listItemsCollection = document.getElementsByClassName(uiSelectors.listItemClass),
                listItemsArray = [...listItemsCollection]    
            ;

            listItemsArray.forEach(listItem => {
                const itemId = listItem.getAttribute('id');

                if (itemId === `item-${item.id}`) {
                    let newItemContent = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `;
                    document.getElementById(`${itemId}`).textContent = '';
                    document.getElementById(`${itemId}`).insertAdjacentHTML('beforeend', newItemContent);
                }
            });
        },
        deleteListItem: (id) => {
            const 
                itemId = `item-${id}`,
                item = document.getElementById(`${itemId}`);
            ;

            item.remove();

            if (document.getElementById(uiSelectors.itemListId).textContent.trim() === '') {
                document.getElementById(uiSelectors.itemListId).style.display = 'none';
            }
        },
        clearAllListItems: () => {
            document.getElementById(uiSelectors.itemListId).textContent = '';
            document.getElementById(uiSelectors.itemListId).style.display = 'none';
        }
    };
})();

// App Controller
const appController = (() => {
    // Load event listeners
    const loadEventListeners = () => {
        const uiSelectors = uiController.getSelectors();

        // Add item
        document.getElementById(uiSelectors.addButtonId).addEventListener('click', itemAddSubmit);

        // Edit button click
        document.getElementById(uiSelectors.itemListId).addEventListener('click', itemEditSubmit);

        // Update button click
        document.getElementById(uiSelectors.updateButtonId).addEventListener('click', itemUpdateSubmit);

        // Delete button click
        document.getElementById(uiSelectors.deleteButtonId).addEventListener('click', itemDeleteSubmit);

        // Back button click
        document.getElementById(uiSelectors.backButtonId).addEventListener('click', uiController.clearEditState);

        // Clear button click
        document.getElementById(uiSelectors.clearAllButtonId).addEventListener('click', clearAll);

    };
    
    const itemAddSubmit = (e) => {
        const input = uiController.getItemInput();

        if(input.name !== '' && input.calories !== '') {
            const newItem = itemController.addItem(input.name, input.calories);

            // Add item to UI
            uiController.addListItem(newItem);

            // Clear fields
            uiController.clearInputFields();

            // Add total calories to UI
            uiController.addTotalCalories();

            // Store item in local storage
            storageController.storeItem(newItem);
        }

        e.preventDefault();
    };

    // Edit item submit
    const itemEditSubmit = (e) => {
        if (e.target.classList.contains('edit-item')) {
            const 
                itemIdInList = e.target.parentNode.parentNode.id,
                listIdArr = itemIdInList.split('-'),
                itemId = parseInt(listIdArr[1]),
                itemToEdit = itemController.getItemById(itemId)
            ;

            // Set current item
            itemController.setCurrentItem(itemToEdit);

            // Add item to form
            uiController.addItemToForm();
        }

        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = (e) => {

        const 
            input = uiController.getItemInput(),
            updatedItem = itemController.updateItem(input.name, input.calories)
        ;

        uiController.updateListItem(updatedItem);
        uiController.addTotalCalories();
        uiController.clearEditState();

        // Update local storage
        storageController.updateItemStorage(updatedItem);

        e.preventDefault();
    }
    
    // Delete item submit
    const itemDeleteSubmit = (e) => {
        const currentItem = itemController.getCurrentItem();

        itemController.deleteItem(currentItem.id);
        uiController.deleteListItem(currentItem.id);
        uiController.addTotalCalories();
        uiController.clearEditState();

        // Delete from local storage
        storageController.deleteItemFromStorage(currentItem.id);

        e.preventDefault();
    }

    // Clear all items click
    const clearAll = (e) => {
        itemController.clearAllItems();
        uiController.clearAllListItems();
        uiController.addTotalCalories();

        storageController.clearAllItemsFromStorage();

        e.preventDefault();
    }

    // Returned public methods
    return {
        init: () => {
            // Fetch items from data structure
            const 
                items = itemController.getItems(),
                totalCalories = itemController.getTotalCalories()
            ;

            if (items.length > 0) {
                uiController.showList();
                uiController.populateItemList(items);
            }

            // Add total calories to UI
            uiController.addTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    };
})(itemController, uiController, storageController);

appController.init();
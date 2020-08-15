// STORAGE CONTROLLER
const StorageCtrl = (function () {
  // public methods
  return {
    storeItem: function (item) {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    },
  };
})();

// ITEM CONTROLLER
const ItemCtrl = (function () {
  const Item = function (id, name, protein, carbs, fat) {
    this.id = id;
    this.name = name;
    this.protein = protein;
    this.carbs = carbs;
    this.fat = fat;
  };
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalCalories: 0,
  };
  // public methods
  return {
    getItems: function () {
      return data.items;
    },

    addItem: function (name, protein, carbs, fat) {
      let ID;
      // create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      protein = parseInt(protein);
      carbs = parseInt(carbs);
      fat = parseInt(fat);
      // create new item
      newItem = new Item(ID, name, protein, carbs, fat);
      data.items.push(newItem);
      return newItem;
    },

    getItemById: function (id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function (name, protein, carbs, fat) {
      protein = parseInt(protein);
      carbs = parseInt(carbs);
      fat = parseInt(fat);
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.protein = protein;
          item.carbs = carbs;
          item.fat = fat;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function (id) {
      ids = data.items.map(function (item) {
        return item.id;
      });
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },

    clearAllItems: function () {
      data.items = [];
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    getTotalProtein: function () {
      let total = 0;
      data.items.forEach(function (item) {
        total += item.protein;
      });
      data.totalProtein = total;
      return data.totalProtein;
    },

    getTotalCarbs: function () {
      let total = 0;
      data.items.forEach(function (item) {
        total += item.carbs;
      });
      data.totalCarbs = total;
      return data.totalCarbs;
    },

    getTotalFat: function () {
      let total = 0;
      data.items.forEach(function (item) {
        total += item.fat;
      });
      data.totalFat = total;
      return data.totalFat;
    },

    getTotalCalories: function () {
      let total = 0;
      data.items.forEach(function (item) {
        total += item.protein * 4;
      });
      data.items.forEach(function (item) {
        total += item.carbs * 4;
      });
      data.items.forEach(function (item) {
        total += item.fat * 7;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },

    logData: function () {
      return data;
    },
  };
})();

// UI CONTROLLER
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemProteinInput: '#item-protein',
    itemCarbsInput: '#item-carbs',
    itemFatInput: '#item-fat',
    totalProtein: '.total-protein',
    totalCarbs: '.total-carbs',
    totalFat: '.total-fat',
    totalCalories: '.total-calories',
  };
  // public methods
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.protein} protein - ${item.carbs} carbs - ${item.fat} fat</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>`;
      });
      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        protein: document.querySelector(UISelectors.itemProteinInput).value,
        carbs: document.querySelector(UISelectors.itemCarbsInput).value,
        fat: document.querySelector(UISelectors.itemFatInput).value,
      };
    },

    addlistItem: function (item) {
      document.querySelector(UISelectors.itemList).style.display = 'block';
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.protein} protein - ${item.carbs} carbs - ${item.fat} fat</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      `;
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
      document.querySelector(UISelectors.itemNameInput).focus();
    },

    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // convert node list to array
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        const itemId = listItem.getAttribute('id');
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.protein} protein - ${item.carbs} carbs - ${item.fat} fat</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          `;
        }
      });
    },

    deleteListItem: function (id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
      const totalProtein = ItemCtrl.getTotalProtein();
      const totalCarbs = ItemCtrl.getTotalCarbs();
      const totalFat = ItemCtrl.getTotalFat();
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalProtein(totalProtein);
      UICtrl.showTotalCarbs(totalCarbs);
      UICtrl.showTotalFat(totalFat);
      UICtrl.showTotalCalories(totalCalories);
      UICtrl.setInitialState();
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemProteinInput).value = '';
      document.querySelector(UISelectors.itemCarbsInput).value = '';
      document.querySelector(UISelectors.itemFatInput).value = '';
    },

    addItemToForm: function () {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemProteinInput
      ).value = ItemCtrl.getCurrentItem().protein;
      document.querySelector(
        UISelectors.itemCarbsInput
      ).value = ItemCtrl.getCurrentItem().carbs;
      document.querySelector(
        UISelectors.itemFatInput
      ).value = ItemCtrl.getCurrentItem().fat;
      UICtrl.showEditState();
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      });
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalProtein: function (totalProtein) {
      document.querySelector(
        UISelectors.totalProtein
      ).textContent = totalProtein;
    },

    showTotalCarbs: function (totalCarbs) {
      document.querySelector(UISelectors.totalCarbs).textContent = totalCarbs;
    },

    showTotalFat: function (totalFat) {
      document.querySelector(UISelectors.totalFat).textContent = totalFat;
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },

    setInitialState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = 'block';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },

    showEditState: function () {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.itemNameInput).focus();
    },

    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// APP CONTROLLER
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();
    // add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);
    // disble submit on enter when editing
    document.addEventListener('keypress', function (e) {
      if (
        document.querySelector(UISelectors.addBtn).style.display === 'none' &&
        (e.keyCode === 13 || e.which === 13)
      ) {
        e.preventDefault();
      }
      return false;
    });
    // edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);
    // update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);
    // back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', UICtrl.setInitialState);
    // delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);
    // clear items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemsClick);
  };

  const itemAddSubmit = function (e) {
    const input = UICtrl.getItemInput();
    if (!input.protein) {
      input.protein = '0';
    }
    if (!input.carbs) {
      input.carbs = '0';
    }
    if (!input.fat) {
      input.fat = '0';
    }
    if (input.name !== '') {
      const newItem = ItemCtrl.addItem(
        input.name,
        input.protein,
        input.carbs,
        input.fat
      );
      // add item to UI list
      UICtrl.addlistItem(newItem);
      const totalProtein = ItemCtrl.getTotalProtein();
      const totalCarbs = ItemCtrl.getTotalCarbs();
      const totalFat = ItemCtrl.getTotalFat();
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalProtein(totalProtein);
      UICtrl.showTotalCarbs(totalCarbs);
      UICtrl.showTotalFat(totalFat);
      UICtrl.showTotalCalories(totalCalories);
      StorageCtrl.storeItem(newItem);
      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      // get id of the item
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      // get item to edit
      const itemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  const itemUpdateSubmit = function (e) {
    const input = UICtrl.getItemInput();
    const updatedItem = ItemCtrl.updateItem(
      input.name,
      input.protein,
      input.carbs,
      input.fat
    );

    UICtrl.updateListItem(updatedItem);
    const totalProtein = ItemCtrl.getTotalProtein();
    const totalCarbs = ItemCtrl.getTotalCarbs();
    const totalFat = ItemCtrl.getTotalFat();
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalProtein(totalProtein);
    UICtrl.showTotalCarbs(totalCarbs);
    UICtrl.showTotalFat(totalFat);
    UICtrl.showTotalCalories(totalCalories);
    // update local storage
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.setInitialState();
    e.preventDefault;
  };

  const itemDeleteSubmit = function (e) {
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id);
    // delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    e.preventDefault();
  };

  const clearAllItemsClick = function () {
    ItemCtrl.clearAllItems();
    const totalProtein = ItemCtrl.getTotalProtein();
    const totalCarbs = ItemCtrl.getTotalCarbs();
    const totalFat = ItemCtrl.getTotalFat();
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalProtein(totalProtein);
    UICtrl.showTotalCarbs(totalCarbs);
    UICtrl.showTotalFat(totalFat);
    UICtrl.showTotalCalories(totalCalories);
    UICtrl.removeItems();
    StorageCtrl.clearItemsFromStorage();
    UICtrl.hideList();
  };

  // public methods
  return {
    init: function () {
      UICtrl.setInitialState();
      const items = ItemCtrl.getItems();
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }
      const totalProtein = ItemCtrl.getTotalProtein();
      const totalCarbs = ItemCtrl.getTotalCarbs();
      const totalFat = ItemCtrl.getTotalFat();
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalProtein(totalProtein);
      UICtrl.showTotalCarbs(totalCarbs);
      UICtrl.showTotalFat(totalFat);
      UICtrl.showTotalCalories(totalCalories);
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();

var inventory;

(function () {
  inventory = {
    collection: [],
    last_id: 0,
    item_proto: Object.freeze({
      id: 0,
      name: '',
      stock_number: '',
      quantity: 1
    }),

    setJQelements: function () {
      this.$inv_table = $('#inventory');
      this.$add_btn = $('#add_item');
      this.$inv_item = $('#inventory_item').remove();
    },
    setDate: function () {
      $('#order_date').text((new Date()).toUTCString());
    },
    cacheTemplate: function () {
      this.template = Handlebars.compile(this.$inv_item.html());
    },
    add: function () {
      var new_item = Object.assign({}, this.item_proto);
      this.last_id += 1;
      new_item.id = this.last_id;
      this.collection.push(new_item);
      return new_item;
    },
    addItem: function () {
      var item = this.add();
      this.$inv_table.append(this.template({ id: item.id }));
      this.$inv_table.find('tr').last().find('input[type=text]').first().trigger('focus');
    },
    update: function (id, key, value) {
      var update_item = this.collection.find(function (item) {
        return (item.id === id);
      });
      update_item[key] = value;
    },
    updateItem: function (e) {
      var new_value = $(e.target).val();
      var matches = e.target.name.match(/^item_(.*)_(\d+)$/);
      var key = matches[1];
      var id = +matches[2];
      if (!id || !key) {
        return;
      }
      this.update(id, key, new_value);
    },
    delete: function (id) {
      this.collection = this.collection.filter(function (item) {
        return (item.id !== id);
      });
    },
    deleteItem: function (e) {
      var $thisRow = $(e.target).closest('tr');
      var id = +$thisRow.find('input[type=hidden]').val();
      e.preventDefault();
      if (!id) {
        return;
      }
      $thisRow.remove();
      this.delete(id);
    },
    bindEvents: function () {
      this.$add_btn.on('click', this.addItem.bind(this));
      this.$inv_table.on('blur', 'input', this.updateItem.bind(this));
      this.$inv_table.on('click', 'a.delete', this.deleteItem.bind(this));
    },
    init: function () {
      this.setJQelements();
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    }
  };
})();

$(inventory.init.bind(inventory));

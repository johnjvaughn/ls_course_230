var inventory;

(function () {
  inventory = {
    collection: [],
    lastId: 0,
    itemProto: Object.freeze({
      id: 0,
      name: "",
      stock_number: "",
      quantity: 1,
    }),

    setJQelements: function () {
      this.$table = $("table");
      this.$add_btn = $("#add_item");
    },
    setDate: function () {
      var today = new Date();
      $("#order_date").text(today.toUTCString());
    },
    cacheTemplate: function () {
      var $inv_item = $("#inventory_item").remove();
      this.template = $inv_item.text();
    },
    add: function () {
      var new_item = Object.assign({}, this.itemProto);
      this.lastId += 1;
      new_item.id = this.lastId;
      this.collection.push(new_item);
      return this.lastId;
    },
    addItem: function () {
      var id = this.add();
      var item_HTML = this.template.replace(/ID/g, String(id));
      this.$table.append(item_HTML);
      this.$table.find("tr").last().find("input[type=text]").first().trigger("focus");
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
      if (!id || !key) return;
      this.update(id, key, new_value);
    },
    delete: function (id) {
      this.collection = this.collection.filter(function (item) {
        return (item.id !== id);
      });
    },
    deleteItem: function (e) {
      e.preventDefault();
      var $thisRow = $(e.target).closest("tr");
      var id = +$thisRow.find("input[type=hidden]").val();
      if (!id) return;
      $thisRow.remove();
      this.delete(id);
    },
    bindEvents: function () {
      this.$add_btn.on("click", this.addItem.bind(this));
      this.$table.on("blur", "input", this.updateItem.bind(this));
      this.$table.on("click", "a.delete", this.deleteItem.bind(this));
    },
    init: function () {
      this.setJQelements();
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    },
  };
})();

$(inventory.init.bind(inventory));

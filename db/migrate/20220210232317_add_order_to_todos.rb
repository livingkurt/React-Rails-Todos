class AddOrderToTodos < ActiveRecord::Migration[6.1]
  def change
    add_column :todos, :order, :integer
  end
end

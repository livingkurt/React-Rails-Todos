class AddCategoryToTodos < ActiveRecord::Migration[6.1]
  def change
    add_column :todos, :category_id, :string
    add_index :todos, :category_id
  end
end

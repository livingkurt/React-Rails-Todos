class AddCategoryToTodos < ActiveRecord::Migration[6.1]
  def change
    add_reference :todos, :category, null: false, foreign_key: true
  end
end

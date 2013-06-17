class AddTitleToBlock < ActiveRecord::Migration
  def change
    add_column :blocks, :title, :string
  end
end

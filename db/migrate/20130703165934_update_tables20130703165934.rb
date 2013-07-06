class UpdateTables20130703165934 < ActiveRecord::Migration
  def change












    # ------------------------------:
    # migration for table items
    # ------------------------------:

    # new columns:
    add_column :items, :file_id, :integer
    add_index :items, :file_id

  end
end

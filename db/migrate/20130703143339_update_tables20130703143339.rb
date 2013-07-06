class UpdateTables20130703143339 < ActiveRecord::Migration
  def change










    # ------------------------------:
    # migration for table blocks
    # ------------------------------:

    # new columns:
    add_column :blocks, :projects_as_block_id, :integer
    add_index :blocks, :projects_as_block_id


    # ------------------------------:
    # migration for table items
    # ------------------------------:

    # new columns:
    add_column :items, :blocks_as_item_id, :integer
    add_index :items, :blocks_as_item_id

  end
end

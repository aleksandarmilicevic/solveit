class UpdateTables20130703141919 < ActiveRecord::Migration
  def change












    # ------------------------------:
    # migration for table items
    # ------------------------------:

    # new columns:
    add_column :items, :caption, :string

  end
end

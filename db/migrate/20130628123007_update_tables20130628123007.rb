class UpdateTables20130628123007 < ActiveRecord::Migration
  def change



    # ------------------------------:
    # migration for table file_records 
    # ------------------------------:

    # obsolete columns:
    remove_column :file_records, :width
    remove_column :file_records, :height
    remove_column :file_records, :type

    create_table :image_records do |t| 
      t.references :file
      t.column :width, :integer
      t.column :height, :integer

      t.timestamps 
    end





    # ------------------------------:
    # migration for table items 
    # ------------------------------:

    # obsolete columns:
    remove_column :items, :image_type

  end
end

class UpdateTables20130628191944 < ActiveRecord::Migration
  def change




    # ------------------------------:
    # migration for table image_records 
    # ------------------------------:

    # obsolete columns:
    remove_column :image_records, :type

    # new columns:
    add_column :image_records, :img_type, :string






  end
end

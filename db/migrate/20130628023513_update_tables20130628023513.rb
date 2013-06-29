class UpdateTables20130628023513 < ActiveRecord::Migration
  def change



    # ------------------------------:
    # migration for table file_records 
    # ------------------------------:

    # new columns:
    add_column :file_records, :filename, :string






  end
end

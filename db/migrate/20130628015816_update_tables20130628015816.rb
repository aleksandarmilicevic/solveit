class UpdateTables20130628015816 < ActiveRecord::Migration
  def change



    create_table :file_records do |t| 
      t.column :content, :binary
      t.column :content_type, :string
      t.column :size, :integer
      t.column :width, :integer
      t.column :height, :integer
      t.column :type, :string

      t.timestamps 
    end


    drop_table :images


    # ------------------------------:
    # migration for table items 
    # ------------------------------:

    # new columns:
    add_column :items, :image_type, :string

  end
end

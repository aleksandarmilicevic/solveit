class UpdateTables20130626225651 < ActiveRecord::Migration
  def change



    create_table :images do |t| 
      t.column :content, :binary
      t.column :content_type, :string
      t.column :size, :integer
      t.column :width, :integer
      t.column :height, :integer

      t.timestamps 
    end





    # ------------------------------:
    # migration for table items 
    # ------------------------------:

    # obsolete columns:
    remove_column :items, :url
    remove_column :items, :image_file_name
    remove_column :items, :image_content_type
    remove_column :items, :image_file_size
    remove_column :items, :image_updated_at

    # new columns:
    add_column :items, :image_id, :integer
    add_index :items, :image_id

  end
end

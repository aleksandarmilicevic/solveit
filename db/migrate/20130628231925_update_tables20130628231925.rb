class UpdateTables20130628231925 < ActiveRecord::Migration
  def change





    create_table :hash_entry_records do |t| 
      t.column :key, :string
      t.column :value, :string
      t.references :hash_records_as_entry

      t.timestamps 
    end

    create_table :hash_records do |t| 

      t.timestamps 
    end





    # ------------------------------:
    # migration for table items 
    # ------------------------------:

    # new columns:
    add_column :items, :gui_settings_id, :integer
    add_index :items, :gui_settings_id

  end
end

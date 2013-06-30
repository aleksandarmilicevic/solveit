class UpdateTables20130629210226 < ActiveRecord::Migration
  def change











    create_table :comments do |t| 
      t.references :sender
      t.column :sender_type, :string
      t.column :message, :text
      t.references :items_as_comment
      t.column :items_as_comment_type, :string

      t.timestamps 
    end


  end
end

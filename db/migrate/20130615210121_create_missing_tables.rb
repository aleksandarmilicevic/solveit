class CreateMissingTables < ActiveRecord::Migration
  def change
    create_table :web_clients do |t| 
      t.column :auth_token, :string
      t.references :user, {:polymorphic=>true}
      t.references :user, {:polymorphic=>true}
      t.column :type, :string

      t.timestamps 
    end

    create_table :web_servers do |t| 
      t.column :type, :string

      t.timestamps 
    end

    create_table :auth_users do |t| 
      t.column :name, :string
      t.column :email, :string
      t.column :password_hash, :string
      t.column :remember_token, :string
      t.column :type, :string

      t.timestamps 
    end

    create_table :roles do |t| 
      t.column :name, :string

      t.timestamps 
    end

    create_table :groups do |t| 
      t.references :owner, {:polymorphic=>true}

      t.timestamps 
    end

    create_table :projects do |t| 
      t.references :creator, {:polymorphic=>true}
      t.column :is_private, :boolean

      t.timestamps 
    end

    create_table :projects_blocks_blocks, {:id=>false} do |t| 
      t.column :project_id, :int
      t.column :block_id, :int
    end

    create_table :blocks do |t| 

      t.timestamps 
    end

    create_table :blocks_items_items, {:id=>false} do |t| 
      t.column :block_id, :int
      t.column :item_id, :int
    end

    create_table :items do |t| 
      t.column :text, :string
      t.column :html, :string
      t.column :url, :string
      t.column :type, :string

      t.timestamps 
    end

    create_table :group_member_tuples do |t| 
      t.references :group_0, {}
      t.references :role_1, {}
      t.references :user_2, {:polymorphic=>true}

      t.timestamps 
    end
  end
end

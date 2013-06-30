# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130629210226) do

  create_table "auth_users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_hash"
    t.string   "remember_token"
    t.string   "type"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  create_table "blocks", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "title"
  end

  create_table "blocks_items_items", :id => false, :force => true do |t|
    t.integer "block_id"
    t.integer "item_id"
  end

  create_table "comments", :force => true do |t|
    t.integer  "sender_id"
    t.string   "sender_type"
    t.text     "message"
    t.integer  "items_as_comment_id"
    t.string   "items_as_comment_type"
    t.datetime "created_at",            :null => false
    t.datetime "updated_at",            :null => false
  end

  create_table "file_records", :force => true do |t|
    t.binary   "content"
    t.string   "content_type"
    t.integer  "size"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.string   "filename"
    t.string   "filepath"
  end

  create_table "group_member_tuples", :force => true do |t|
    t.integer  "group_0_id"
    t.integer  "role_1_id"
    t.integer  "user_2_id"
    t.string   "user_2_type"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "groups", :force => true do |t|
    t.integer  "owner_id"
    t.string   "owner_type"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "hash_entry_records", :force => true do |t|
    t.string   "key"
    t.string   "value"
    t.integer  "hash_records_as_entry_id"
    t.datetime "created_at",               :null => false
    t.datetime "updated_at",               :null => false
  end

  create_table "hash_records", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "image_records", :force => true do |t|
    t.integer  "file_id"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "img_type"
  end

  create_table "items", :force => true do |t|
    t.string   "text"
    t.string   "html"
    t.string   "type"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
    t.integer  "image_id"
    t.integer  "gui_settings_id"
  end

  add_index "items", ["gui_settings_id"], :name => "index_items_on_gui_settings_id"
  add_index "items", ["image_id"], :name => "index_items_on_image_id"

  create_table "projects", :force => true do |t|
    t.integer  "creator_id"
    t.string   "creator_type"
    t.boolean  "is_private"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.string   "title"
    t.text     "description"
  end

  create_table "projects_blocks_blocks", :id => false, :force => true do |t|
    t.integer "project_id"
    t.integer "block_id"
  end

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "web_clients", :force => true do |t|
    t.string   "auth_token"
    t.integer  "user_id"
    t.string   "user_type"
    t.string   "type"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "web_servers", :force => true do |t|
    t.string   "type"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end

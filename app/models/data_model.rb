require 'red/stdlib/web/auth/model'
require 'red/stdlib/crud/model'

include RedLib::Web::Auth
include RedLib::Crud

#===========================================================
# Data model
#===========================================================
Red::Dsl.data_model do
  
  record User < AuthUser, {
  } 
  
  record Role, {
    name: String
  }
  
  record Group, {
    owner: User,
    members: Role * User,
  } do 
    validates :owner, :presence => true
  end
  
  record Project, {
    title: String,
    description: Text,
    creator: User,
    is_private: Bool,
    blocks: (set Block),
  } do
    validates :creator, :presence => true
  end
  
  record Block, {
    title: String,
    items: (set Item)
  } do
    # TODO validates :projects_as_block, :non_empty
  end
  
  abstract(record Item)
  
  record PlainText < Item, {
    text: String,
  }
  
  record HTMLText < Item, {
    html: String,
  }
  
  record Image < Item, {
    url: String
  }
  
end

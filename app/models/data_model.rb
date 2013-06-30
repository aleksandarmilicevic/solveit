require 'red/stdlib/web/auth/model'
require 'red/stdlib/crud/model'
require 'red/stdlib/util/image'
require 'red/stdlib/util/hash_record'

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

  record Comment, {
    sender: User, 
    message: Text
  } do
    validates :sender, :presence => true
    validates :message, :presence => true
  end
  
  record Item do
    abstract

    field gui_settings: RedLib::Util::HashRecord
    field comments: (set Comment), :owned => true
  end
  
  record PlainText < Item, {
    text: String,
  }
  
  record HTMLText < Item, {
    html: String,
  }
  
  record Figure < Item, {
    image: RedLib::Util::ImageRecord,
  } do

    def image_gui_style
      #TODO read from gui_settings
      h = 150;
      ar = image ? image.aspect_ratio : 1
      "width: #{h*ar}px; height: #{h}px"
    end
  end
  
end

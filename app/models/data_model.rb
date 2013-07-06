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
  } do
    field blocks: (set Block), :owned => true

    validates :creator, :presence => true
  end

  record Block, {
    title: String,
  } do
    field items: (set Item), :owned => true

    # TODO validates :projects_as_block, :non_empty

    def section_index
      #TODO change the model to make it a seq
      self.projects_as_block.blocks.index(self)
    end
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

    field gui_settings: RedLib::Util::HashRecord, :owned => true
    field comments: (set Comment), :owned => true
    field caption: String

    #TODO validate that blocks_as_item exists

    def section_index
      self.blocks_as_item.section_index
    end

    def item_index
      #TODO change the model to make it a seq
      self.blocks_as_item.items.index(self)
    end
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

  record Attachment < Item, {
  } do
    field file: RedLib::Util::FileRecord, :owned => true
  end

end

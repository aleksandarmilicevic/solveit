Red::Dsl.event_model do

  event CreateProjectBlock do
    params {{
        project: Project,
        title: String
      }}

    requires {
      check_present :project
    }

    ensures {
      block = Block.new
      block.title = title
      block.save!
      project.blocks << block
      project.save!
      block
    }
  end

  event UploadFigure do
    attr_reader :img

    params {{
        figure: Figure,
        file: FileRecord
      }}

    requires {
      check_all_present
    }

    ensures {
      @img = RedLib::Util::ImageRecord.new
      @img.file = file
      @img.try_infer_metadata
      @img.save!
      figure.image = img
      figure.gui_settings.set("img.style", "") rescue nil
      figure.save!
    }
  end

  event CreateItemFromFile do
    attr_reader :item

    params {{
        block: Block,
        file: FileRecord
      }}

    requires {
      check_all_present
    }

    ensures {
      puts "uploadede: #{file.content_type}"
      case
      when file.content_type.starts_with?("image/")
        Red.conf.log.debug "creating a figure from image: #{file.filename}"
        @item = Figure.new
        ev = UploadFigure.new :figure => @item, :file => file
        ev.execute
      else
        Red.conf.log.debug "creating an attachment from file: #{file.filename}"
        @item = Attachment.new
        @item.file = file
        @item.save!
      end
      if @item
        block.items << @item
        block.save!
      end
      @item
    }
  end

  event CreateAndAddComment do
    params {{
        item: Item,
        message: String
      }}

    requires {
      check_all_present
    }

    ensures {
      c = Comment.new :message => message
      c.sender = from.user
      c.save!
      item.comments << c
      item.save!
      c
    }
  end

end

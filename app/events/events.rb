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
    params {{
        figure: Figure,
        file: FileRecord
      }}

    requires {
      check_all_present
    }

    ensures {
      img = RedLib::Util::ImageRecord.new 
      img.file = file
      img.try_infer_metadata
      img.save!
      figure.image = img
      figure.save!
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

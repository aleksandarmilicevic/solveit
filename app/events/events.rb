Red::Dsl.event_model do

  event CreateProjectBlock do
    params {{
        project: Project, 
        title: String
      }}

    requires {
      !project.nil?
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

end

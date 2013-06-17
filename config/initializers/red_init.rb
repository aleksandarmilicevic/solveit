# configure Red
Red.configure do |c|
  c.alloy.logger = SDGUtils::IO::LoggerIO.new(Rails.logger)
  c.root = Rails.configuration.root
  c.view_paths = Rails.configuration.paths["app/views"]

  c.autoviews = false

  c.alloy.inv_field_namer = lambda { |fld| 
    default_name = "#{fld.parent.red_table_name}_as_#{fld.name.singularize}"
    begin 
      orig_fld = fld.parent.meta.extra[:for_field]
      if orig_fld
        if fld.type.range.klass == orig_fld.parent
          orig_fld.name
        else
          "#{orig_fld.parent.red_table_name}_as_#{orig_fld.name.singularize}"
        end
      else
        default_name
      end
    rescue Exception => e
      puts("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" + e.message)
      default_name
    end
  }
end

# Finalize Red
Red.initialize!


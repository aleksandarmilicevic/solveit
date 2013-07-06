class FetchItemFileController < ApplicationController
  def src
    file = get_file rescue nil
    if file.nil?
      error "image not found", nil, 404
    else
      data = file.read_content
      opts = send_data_opts.merge :filename => file.filename, 
                                  :type => file.content_type
      send_data data, opts
    end
  end

  protected

  def send_data_opts
    {:disposition => "inline"}
  end

  def get_file
    find_item.file
  end
  
  def find_item(item_id=nil)
    id = item_id || params[:id]
    begin 
      Item.find(id)
    rescue
      raise NotFoundError, "Item not found"
    end    
  end
end

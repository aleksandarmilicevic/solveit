class FetchFigureController < ApplicationController
  
  def src
    fig = find_figure
    file = fig.image.file rescue nil
    if file.nil?
      error "image not found", nil, 404
    else
      data = file.read_content
      send_data data, :filename => file.filename, 
                      :type => file.content_type, :disposition => "inline"
    end
  end

  private
  
  def find_figure(fig_id=nil)
    id = fig_id || params[:id]
    begin 
      Figure.find(id)
    rescue
      raise NotFoundError, "Figure not found"
    end    
  end
end

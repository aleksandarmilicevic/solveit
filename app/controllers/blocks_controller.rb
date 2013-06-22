class BlocksController < ApplicationController
  
  def new
  end
  
  def create
  end
  
  def show
    @block = find_block
    
    layout = params.key?("partial") ? false : true

    respond_to do |format|
      format.html { render :layout => layout }
    end
  end
  
  def edit
    @project = find_project
  end
  
  def update
  end
  
  private
        
  def find_block(block_id=nil)
    id = block_id || params[:id]
    begin 
      Block.find(id)
    rescue
      raise NotFoundError, "Block not found"
    end
  end

end

class FetchFigureController < FetchItemFileController

  async

  protected

  def send_data_opts
    {:disposition => "attachment"}
  end

  def get_file
    find_item.image.file
  end


end

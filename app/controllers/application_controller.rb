class NotFoundError < StandardError
end


class ApplicationController < RedAppController  
  include SessionsHelper
  
  around_filter :catch_errors


  # Force signout to prevent CSRF attacks
  def handle_unverified_request
    sign_out
    super
  end

  protected
  
  def catch_errors
    begin
      yield
    rescue NotFoundError => e
      flash[:error] = e.message
      redirect_to root_url 
    end    
  end 
  
end

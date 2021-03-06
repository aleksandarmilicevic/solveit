module SessionsHelper

  def sign_in(user)
    cookies.permanent[:remember_token] = user.remember_token
    self.current_user = user
  end

  def sign_out
    self.current_user = nil
    cookies.delete(:remember_token)
  end

  def signed_in?
    !current_user.nil?
  end

  def current_user=(user)
    @current_user = user
    client.user = user
    client.save!
  end

  def current_user
    @current_user ||= User.all.find{|u| u.remember_token == cookies[:remember_token]}  #User.find_by_remember_token(cookies[:remember_token])
  end

end

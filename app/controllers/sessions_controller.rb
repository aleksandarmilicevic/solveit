class SessionsController < ApplicationController
  def new
  end

  def create
    user_email = params[:session][:email]
    user_pswd = params[:session][:password]
    user = User.find_by_email(user_email.downcase)
    if user && user.authenticate(user_pswd)
      # Sign the user in and redirect to the user's show page.
      sign_in(user)
      redirect_to user
    else
      # Create an error message and re-render the signin form.
      msg = user ? "Invalid password for user #{user_email}"
                 : "User #{user_email} not found"
      flash.now[:error] = msg
      render 'new'
    end
  end

  def destroy
    sign_out
    redirect_to root_url
  end

end

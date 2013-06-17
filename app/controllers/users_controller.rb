class UsersController < ApplicationController
 
  before_filter :redirect_unless_signed_in, :only => [:edit, :update]
  before_filter :redirect_unless_correct_user, :only => [:edit, :update, :show]
   
  def new
    @user = User.new
  end
  
  def edit
    @user = find_user
  end
  
  def update
    @user = find_user
    user_params = params[:user]
    @user.name = user_params[:name] 
    @user.password = user_params[:password] 
    if @user.save()
      flash[:success] = "Profile updated"
      sign_in @user
      redirect_to @user
    else
      render 'edit'
    end
  end
  
  def show
    @user = find_user
  end

  def create
    @user = User.new()
    user_params = params[:user]
    @user.name = user_params[:name]
    @user.email = user_params[:email]
    @user.password = user_params[:password]
    if @user.save
      sign_in @user
      flash[:success] = "Welcome to SolveIT!"
      redirect_to @user
    else
      render 'new'
    end
  end
  
  private 
    
  def redirect_unless_signed_in
    redirect_to signin_url, :notice => "Please sign in." unless signed_in?
  end
  
  def redirect_unless_correct_user
    unless find_user == current_user
      flash[:error] = "Not authorized" 
      redirect_to root_url
    end    
  end
      
  def find_user(user_id=nil)
    id = user_id || params[:id]
    begin 
      User.find(id)
    rescue
      raise NotFoundError, "User not found"
    end
  end
  
end

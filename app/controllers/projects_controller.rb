class ProjectsController < ApplicationController
  
  def new
    @project = Project.new
  end
  
  def create
    @project = Project.new()
    project_params = params[:project]
    @project.title = project_params[:title]
    @project.description = project_params[:description]
    puts project_params[:is_private]
    @project.is_private = project_params[:is_private]
    @project.creator = current_user
    if @project.save
      flash[:success] = "Project '#{@project.title}' created!"
      redirect_to @project
    else
      render 'new'
    end    
  end
  
  def show
    @project = find_project
    # render 'project'
  end
  
  def edit
    @project = find_project
  end
  
  def update
    @project = find_project
    @project.update_attributes(params[:project])
    if @project.save()
      flash[:success] = "Project '#{@project.title}' updated"
      redirect_to @project
    else
      render 'edit'
    end
  end
  
  private
        
  def find_project(project_id=nil)
    id = project_id || params[:id]
    begin 
      Project.find(id)
    rescue
      raise NotFoundError, "Project not found"
    end
  end

  
end

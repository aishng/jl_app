class JobsController < ApplicationController
#2 @s denotes class variable vs instance variable (@) 
  #@@joblist = [{
     #"artist"=> "TL",
     #"client"=> "Nike",
     #"title"=> "FW 2014",
     #"contact"=> "Marnie Jones",
     #"fee"=> "40,000", 
     #"expenses"=> "204,000" }]
  
  def index 
    #render json: @@joblist
    @jobs = Job.all
    #render json: Job.all
  end 
  def create
     @job = Job.new(job_params)
     @job.save  
    # if request.xhr?
        #render :json => Job.all
     #else 
       # redirect_to_jobs_path
     #end
  end 
  #def show
   # @job = Job.find(params[:id])
  #end
  private
    def job_params
      params.require(:job).permit(:artist, :client, :title, :contact, :fee, :expenses)
    end
end

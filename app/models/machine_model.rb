require 'red/stdlib/web/auth/model'

include RedLib::Web::Auth

#===========================================================
# Machine model
#===========================================================
Red::Dsl.machine_model do
  
  machine Client < AuthClient, 
  {
    user: User
  }
  
  machine Server < AuthServer, 
  {

  }
  
end 

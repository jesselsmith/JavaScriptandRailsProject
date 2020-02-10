class CharactersController < ApplicationController


  private
  
  def character_params(params)
    params.require(:character).permit(:name)
  end
end

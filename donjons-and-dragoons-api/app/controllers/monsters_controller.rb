class MonstersController < ApplicationController
  respond_to :json
  def create

  end
end

private

def create_monster_params(params)
  params.require(:monster).permit(:name, :level, :armor, :weapon, :current_hp, :xp)
end
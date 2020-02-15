class MonstersController < ApplicationController
  respond_to :json
  def create
    monster = Monster.new_monster_from_api(params[:monster])
    if monster.save
      render json: MonsterSerializer.new(monster)
    else
      render json: { message: "Invalid Monster" }
    end
  end
end

private

def create_monster_params(params)
  params.require(:monster).permit(:name, :type, :index, :hit_points, :challenge_rating, :armor_class, :actions[])
end
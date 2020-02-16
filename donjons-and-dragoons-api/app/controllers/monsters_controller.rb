class MonstersController < ApplicationController
  respond_to :json
  def create
    monster = Monster.new_monster_from_api(create_monster_params(params))
    if monster.save
      render json: MonsterSerializer.new(monster)
    else
      render json: { message: "Invalid Monster" }
    end
  end
end

def update
  monster = Monster.find(params[:id])
  if monster
    monster.update(update_monster_params(params))
    render json: MonsterSerializer.new(monster)
  else
    render json: {message: "That monster could not be found!"}
  end
end

private

def create_monster_params(params)
  params.require(:monster).permit(:name, :type, :slug, :hit_points, :challenge_rating, :armor_class, actions: [:name, :desc, :attack_bonus])
end

def update_monster_params(params)
  params.require(:monster).permit(:current_hp)
end

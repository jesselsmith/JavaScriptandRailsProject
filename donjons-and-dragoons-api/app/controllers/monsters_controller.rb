class MonstersController < ApplicationController
  respond_to :json
  def create
    character = Character.find_by(id: params[:character_id])
    if character
      monster = Monster.new_monster_from_api(create_monster_params(params))
      monster.character_id = character.id
      if monster.save
        character.monster = monster
        render json: MonsterSerializer.new(monster)
      else
        render json: { message: "Invalid Monster" }
      end
    else
      render json: {message: "Could not find that character."}
    end
  end

  def show
    render_monster {}
  end

  def update
    render_monster do
      if (params[:monster].key? :current_hp) && (params[:monster][:current_hp].negative?)
        params[:monster][:current_hp] = 0
      end
      @monster.update(update_monster_params(params))
    end
  end

  def destroy
    render_monster { @monster.destroy }
  end

  private

  def create_monster_params(params)
    params.require(:monster).permit(:name, :type, :slug, :hit_points, :challenge_rating, :armor_class, actions: [:name, :desc, :attack_bonus])
  end

  def update_monster_params(params)
    params.require(:monster).permit(:current_hp)
  end

  def find_monster
    Monster.find(params[:id])
  end

  def render_monster
    @monster = find_monster
    if @monster
      yield
      render json: MonsterSerializer.new(@monster)
    else
      render json: { message: 'That monster could not be found' }
    end
  end
end

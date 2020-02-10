class CharactersController < ApplicationController
  def create
    character = Character.new(new_character_params(params))
    character.level = 1
    character.armor = "chainmail"
    character.weapon = "longsword"
    character.current_hp = character.max_hp
    charcter.xp = 0
    character.user_id = current_user
    if character.save
      render json: character
    else
      render json: { message: "There was an error in character creation" }
    end
  end

  def destroy
    character = find_character
    if character
      character.destroy
      render json: character
    else
      render json: { message: "That character could not be found" }
    end
  end

  def update
    character = find_character
    if character
      character.update(update_character_params(params))
      render json: character
    else
      render json: { message: "That character could not be found" }
    end
  end

  private

  def new_character_params(params)
    params.require(:character).permit(:name)
  end

  def update_character_params(params)
    params.require(:character).permit(:name, :level, :armor, :weapon, :current_hp, :xp)
  end

  def find_character
    Character.find_by(id: params[:id])
  end
end

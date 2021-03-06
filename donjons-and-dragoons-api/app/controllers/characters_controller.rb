class CharactersController < ApplicationController
  respond_to :json

  before_action :authenticate_user!
  def create
    character = current_user.characters.build(new_character_params(params))
    if character.save
      render json: CharacterSerializer.new(character)
    else
      render json: { message: 'There was an error in character creation' }
    end
  end

  def show
    render_character
  end

  def index
    render json: current_user.characters
  end

  def destroy
    render_character { @character.destroy }
  end

  def update
    render_character { @character.update(update_character_params(params)) }
  end

  private

  def new_character_params(params)
    params.require(:character).permit(:name)
  end

  def update_character_params(params)
    params.require(:character).permit(:name, :level, :armor, :weapon,
                                      :current_hp, :xp, :hit_dice, :gold,
                                      :second_wind_used,
                                      :encounters_since_short_rest,
                                      :encounters_since_long_rest)
  end

  def render_character
    @character = find_character
    if @character
      yield
      render json: CharacterSerializer.new(@character)
    else
      render json: { message: 'That character could not be found' }
    end
  end

  def find_character
    Character.find_by(id: params[:id])
  end
end

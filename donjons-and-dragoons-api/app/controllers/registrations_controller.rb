class RegistrationsController < Devise::RegistrationsController
  respond_to :json
  def create
    build_resource(sign_up_params)
    resource.save
    sign_up(resource_name, resource)
    render_resource(resource)
  end

  private

  def sign_up_params()
    params.permit(:email, :password, :password_confirmation)
  end
end
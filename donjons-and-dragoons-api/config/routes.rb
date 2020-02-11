Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'
  resources :monsters
  resources :characters, only: [:index, :show, :create, :update, :destroy]
  root 'home#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

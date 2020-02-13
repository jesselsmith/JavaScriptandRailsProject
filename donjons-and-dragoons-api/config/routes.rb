Rails.application.routes.draw do
  devise_for :users,  controllers: { registrations: 'registrations' }
  resources :monsters
  resources :characters, only: [:index, :show, :create, :update, :destroy]
  root 'home#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

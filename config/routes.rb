Rails.application.routes.draw do
  resources :categories
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'todos#index'
  scope '/api/v1' do
    resources :todos do
      member do
        get :uncompleted
        put :update_form
        put :update_order
      end
    end
  end
end

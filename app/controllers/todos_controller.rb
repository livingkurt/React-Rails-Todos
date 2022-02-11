class TodosController < ApplicationController
  skip_forgery_protection

  def index
    @todos = Todo.all.order(order: :asc)
  end

  def uncompleted
    @todos = Todo.where(done: false)
  end

  def show
    @todo = Todo.find(params[:id])
  end

  def create
    todo = Todo.create(todo_param)
    render json: todo
  end

  def update
    todo = Todo.find(params[:id])
    todo.update!(todo_param)
    render json: todo
  end
  
  def update_order
    todo = Todo.find(params[:id])
    todo.update!(todo_param)
    render json: todo
  end

  def update_form
    todo = Todo.find(params[:id])
    todo.update!(todo_param)
    render json: todo
  end

  def destroy
    todo = Todo.find(params[:id])
    todo.destroy
    head :no_content, status: :ok
  end

  private
    def todo_param
      params.require(:todo).permit(:title, :description, :order, :done)
    end
end

# class TodosController < ApplicationController
#   before_action :set_todo, only: %i[ show edit update destroy ]

#   # GET /todos or /todos.json
#   def index
#     @todos = Todo.all
#   end

#   # GET /todos/1 or /todos/1.json
#   def show
#   end

#   # GET /todos/new
#   def new
#     @todo = Todo.new
#   end

#   # GET /todos/1/edit
#   def edit
#   end

#   # POST /todos or /todos.json
#   def create
#     @todo = Todo.new(todo_params)

#     respond_to do |format|
#       if @todo.save
#         format.html { redirect_to todo_url(@todo), notice: "Todo was successfully created." }
#         format.json { render :show, status: :created, location: @todo }
#       else
#         format.html { render :new, status: :unprocessable_entity }
#         format.json { render json: @todo.errors, status: :unprocessable_entity }
#       end
#     end
#   end

#   # PATCH/PUT /todos/1 or /todos/1.json
#   def update
#     respond_to do |format|
#       if @todo.update(todo_params)
#         format.html { redirect_to todo_url(@todo), notice: "Todo was successfully updated." }
#         format.json { render :show, status: :ok, location: @todo }
#       else
#         format.html { render :edit, status: :unprocessable_entity }
#         format.json { render json: @todo.errors, status: :unprocessable_entity }
#       end
#     end
#   end

#   # DELETE /todos/1 or /todos/1.json
#   def destroy
#     @todo.destroy

#     respond_to do |format|
#       format.html { redirect_to todos_url, notice: "Todo was successfully destroyed." }
#       format.json { head :no_content }
#     end
#   end

#   private
#     # Use callbacks to share common setup or constraints between actions.
#     def set_todo
#       @todo = Todo.find(params[:id])
#     end

#     # Only allow a list of trusted parameters through.
#     def todo_params
#       params.require(:todo).permit(:title, :description, :done)
#     end
# end

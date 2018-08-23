class TestusersController < ApplicationController
  before_action :set_testuser, only: [:show, :edit, :update, :destroy]

  # GET /testusers
  # GET /testusers.json
  def index
    @testusers = Testuser.all
  end

  # GET /testusers/1
  # GET /testusers/1.json
  def show
  end

  # GET /testusers/new
  def new
    @testuser = Testuser.new
  end

  # GET /testusers/1/edit
  def edit
  end

  # POST /testusers
  # POST /testusers.json
  def create
    @testuser = Testuser.new(testuser_params)

    respond_to do |format|
      if @testuser.save
        format.html { redirect_to @testuser, notice: 'Testuser was successfully created.' }
        format.json { render :show, status: :created, location: @testuser }
      else
        format.html { render :new }
        format.json { render json: @testuser.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /testusers/1
  # PATCH/PUT /testusers/1.json
  def update
    respond_to do |format|
      if @testuser.update(testuser_params)
        format.html { redirect_to @testuser, notice: 'Testuser was successfully updated.' }
        format.json { render :show, status: :ok, location: @testuser }
      else
        format.html { render :edit }
        format.json { render json: @testuser.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /testusers/1
  # DELETE /testusers/1.json
  def destroy
    @testuser.destroy
    respond_to do |format|
      format.html { redirect_to testusers_url, notice: 'Testuser was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_testuser
      @testuser = Testuser.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def testuser_params
      params.require(:testuser).permit(:name, :email, :validated)
    end
end

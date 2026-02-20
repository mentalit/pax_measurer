class MeasurementsController < ApplicationController
  before_action :set_measurement, only: %i[ show edit update destroy ]
  before_action :get_room, only: %i[ new create index]

  # GET /measurements or /measurements.json
  def index
    @measurements = @room.measurements
  end

  # GET /measurements/1 or /measurements/1.json
  def show
  end

  # GET /measurements/new
  def new
    @measurement = @room.measurements.build
  end

  # GET /measurements/1/edit
  def edit
  end

  # POST /measurements or /measurements.json
  def create
    @measurement = @room.measurements.build(measurement_params)

    respond_to do |format|
      if @measurement.save
        format.html { redirect_to @measurement, notice: "Measurement was successfully created." }
        format.json { render :show, status: :created, location: @measurement }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @measurement.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /measurements/1 or /measurements/1.json
  def update
    respond_to do |format|
      if @measurement.update(measurement_params)
        format.html { redirect_to @measurement, notice: "Measurement was successfully updated.", status: :see_other }
        format.json { render :show, status: :ok, location: @measurement }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @measurement.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /measurements/1 or /measurements/1.json
  def destroy
    @measurement.destroy!

    respond_to do |format|
      format.html { redirect_to measurements_path, notice: "Measurement was successfully destroyed.", status: :see_other }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_measurement
      @measurement = Measurement.find(params[:id])
    end

    def get_room
      @room = Room.find(params[:room_id])
    end

    

    # Only allow a list of trusted parameters through.
    def measurement_params
      params.require(:measurement).permit(:length, :width, :depth, :room_id)
    end
end

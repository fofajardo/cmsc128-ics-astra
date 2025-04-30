import httpStatus from "http-status-codes";
import { v4 as uuidv4 } from 'uuid';
import degreeProgramService from "../services/degreeProgramService.js";

const getAllDegreePrograms = async (req, res) => {
  try {
    const { data, error } = await degreeProgramService.fetchAllDegreePrograms(req.supabase);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "No degree programs found",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      degreePrograms: data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getDegreeProgramById = async (req, res) => {
  try {
      const { id } = req.params;

      const { data, error } = await degreeProgramService.fetchDegreeProgramById(req.supabase, id);

      if (error || !data) {
          return res.status(httpStatus.NOT_FOUND).json({
              status: "AS AS AILED",
              message: "Degree program not found",
          });
      }

      return res.status(httpStatus.OK).json({
          status: "OK",
          degreeProgram: data,
      });
  } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: "FAILED",
          message: error.message,
      });
  }
};

const createDegreeProgram = async (req, res) => {
  try {
    const { name, level, user_id, institution, year_started, year_graduated } = req.body;

    if (!name || !level || !user_id || !institution || !year_started || !year_graduated) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "All fields are required",
      });
    }

    const degreeProgramData = {
      id: uuidv4(),
      name,
      level,
      user_id,
      institution,
      year_started,
      year_graduated,
    };

    const { data, error } = await degreeProgramService.insertDegreeProgram(req.supabase, degreeProgramData);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Degree program successfully created",
      degreeProgram: data[0],
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const updateDegreeProgram = async (req, res) => {
  const { id } = req.params;
  const { name, level, user_id, institution, year_started, year_graduated } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ status: "FAILED", message: "Degree program ID is required" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (level) updates.level = level;
    if (user_id) updates.user_id = user_id;
    if (institution) updates.institution = institution;
    if (year_started) updates.year_started = year_started;
    if (year_graduated) updates.year_graduated = year_graduated;

    const { data, error } = await req.supabase
      .from("degree_programs")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      if (error.details && error.details.includes("not found")) {
        return res.status(404).json({ status: "FAILED", message: "Degree program not found" });
      }
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ status: "FAILED", message: "Degree program not found" });
    }

    return res.status(200).json({ status: "UPDATED", message: "Degree program successfully updated", degreeProgram: data[0] });
  } catch (err) {
    console.error("Error updating degree program:", err.message);
    return res.status(500).json({ status: "FAILED", message: err.message });
  }
};

const deleteDegreeProgram = async (req, res) => {
  const { id } = req.params;

  try {
      if (!id) {
          return res.status(400).json({ status: "FAILED", message: "Degree program ID is required" });
      }

      // Perform the delete operation and select the deleted row
      const { data, error } = await degreeProgramService.deleteDegreeProgramById(req.supabase, id);

      if (error) {
          if (error.details && error.details.includes("not found")) {
              return res.status(404).json({ status: "FAILED", message: "Degree program not found" });
          }
          throw error;
      }

      return res.status(200).json({ status: "DELETED", message: "Degree program successfully deleted" });
  } catch (err) {
      console.error("Error deleting degree program:", err.message);
      return res.status(500).json({ status: "FAILED", message: err.message });
  }
};

const getAlumniByYearGraduated = async (req, res) => {
  try {
    const { year_graduated } = req.params;

    if (!year_graduated) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Year graduated is required",
      });
    }

    const { data, error } = await degreeProgramService.fetchAlumniByYearGraduated(req.supabase, year_graduated);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: `No alumni found for the year ${year_graduated}`,
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      alumni: data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getDegreeProgramsByUserId = async (req, res) => {
  try {
      // The param name should match your route definition /:id
      const { id } = req.params; // Changed from userId to id to match your route

      console.log("Fetching degree programs for user_id:", id);

      if (!id) {
          return res.status(httpStatus.BAD_REQUEST).json({
              status: "FAILED",
              message: "User ID is required",
          });
      }

      const { data, error } = await degreeProgramService.fetchDegreeProgramsByUserId(req.supabase, id);

      if (error) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
              status: "FAILED",
              message: error.message,
          });
      }
      
      // Return empty array instead of error if no data found
      return res.status(httpStatus.OK).json({
          status: "OK",
          degreePrograms: data || [],
      });
  }
  catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          status: "FAILED",
          message: error.message,
      });
  }
};

const degreeProgramController = {
  getDegreeProgramsByUserId,
  getAllDegreePrograms,
  getDegreeProgramById,
  createDegreeProgram,
  updateDegreeProgram,
  deleteDegreeProgram,
  getAlumniByYearGraduated,
};

export default degreeProgramController;
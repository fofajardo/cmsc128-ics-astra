import httpStatus from "http-status-codes";
import { v4 as uuidv4 } from 'uuid';
import degreeProgramService from "../services/degreeProgramService.js";

const getAllDegreePrograms = (supabase) => async (req, res) => {
  try {
    const { data, error } = await degreeProgramService.fetchAllDegreePrograms(supabase);

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

const getDegreeProgramById = (supabase) => async (req, res) => {
  try {
      const { id } = req.params;

      const { data, error } = await supabase
          .from("degree_programs")
          .select("*")
          .eq("id", id)
          .single();

      if (error || !data) {
          return res.status(httpStatus.NOT_FOUND).json({
              status: "FAILED",
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

const createDegreeProgram = (supabase) => async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Name and level are required",
      });
    }

    const degreeProgramData = {
      id: uuidv4(),
      name,
      level,
    };

    const { data, error } = await degreeProgramService.insertDegreeProgram(supabase, degreeProgramData);

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

const updateDegreeProgram = (supabase) => async (req, res) => {
  const { id } = req.params;
  const { name, level } = req.body;

  try {
      if (!id) {
          return res.status(400).json({ status: "FAILED", message: "Degree program ID is required" });
      }

      const updates = {};
      if (name) updates.name = name;
      if (level) updates.level = level;

      const { data, error } = await supabase
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

const deleteDegreeProgram = (supabase) => async (req, res) => {
  const { id } = req.params;

  try {
      if (!id) {
          return res.status(400).json({ status: "FAILED", message: "Degree program ID is required" });
      }

      // Perform the delete operation and select the deleted row
      const { data, error } = await supabase
          .from("degree_programs")
          .delete()
          .eq("id", id)
          .select(); // Ensure the deleted row is returned

      if (error) {
          if (error.details && error.details.includes("not found")) {
              return res.status(404).json({ status: "FAILED", message: "Degree program not found" });
          }
          throw error;
      }

      if (!data || data.length === 0) {
          return res.status(404).json({ status: "FAILED", message: "Degree program not found" });
      }

      return res.status(200).json({ status: "DELETED", message: "Degree program successfully deleted" });
  } catch (err) {
      console.error("Error deleting degree program:", err.message);
      return res.status(500).json({ status: "FAILED", message: err.message });
  }
};

const degreeProgramController = {
  getAllDegreePrograms,
  getDegreeProgramById,
  createDegreeProgram,
  updateDegreeProgram,
  deleteDegreeProgram,
};

export default degreeProgramController;